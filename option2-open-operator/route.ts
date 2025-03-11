import { NextResponse } from 'next/server';
import { CoreMessage, generateObject, UserContent } from "ai";
import { z } from "zod";
import { ObserveResult, Stagehand } from "@browserbasehq/stagehand";
import { createAzure } from '@ai-sdk/azure';

// Configuración del provider de Azure
const azureProvider = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME || "thirdwishgroup-ai",
  apiKey: process.env.OPENAI_API_KEY || "e78***",
  apiVersion: process.env.OPENAI_API_VERSION || "2024-08-01-preview",
});

const LLMClient = azureProvider('gpt-4o', {
  apiVersion: process.env.OPENAI_API_VERSION || "2024-08-01-preview",
});

type Step = {
  text: string;
  reasoning: string;
  tool: "GOTO" | "ACT" | "EXTRACT" | "OBSERVE" | "CLOSE" | "WAIT" | "NAVBACK";
  instruction: string;
};

/**
 * Inicializa Stagehand.
 * Si se pasa un sessionID, intenta reanudar esa sesión; en caso de error
 * (por ejemplo, error 429, sesión COMPLETED o "not running") se procede a crear una nueva sesión sin intentar cerrarla.
 */
async function initStagehand(sessionID?: string): Promise<Stagehand> {
  let stagehand;
  if (sessionID) {
    try {
      console.log(`Intentando reanudar la sesión ${sessionID}`);
      stagehand = new Stagehand({
        browserbaseSessionID: sessionID,
        env: "BROWSERBASE",
        logger: () => {},
      });
      await stagehand.init();
      return stagehand;
    } catch (error: any) {
      console.error("Error al reanudar la sesión, se procederá a crear una nueva sesión:", error);
      // Si el error indica que la sesión ya está terminada o no está corriendo, no se intenta cerrarla
      if (!error.message.includes("not running") && !error.message.includes("COMPLETED")) {
        try {
          const tempStagehand = new Stagehand({
            browserbaseSessionID: sessionID,
            env: "BROWSERBASE",
            logger: () => {},
          });
          await tempStagehand.init();
          await tempStagehand.close();
        } catch (e) {
          console.error("Error al cerrar la sesión antigua:", e);
        }
      } else {
        console.log("La sesión ya está terminada, no es necesario cerrarla.");
      }
    }
  }
  // Si no se pudo reanudar (o no se proporcionó sessionID), se crea una nueva sesión con reintentos
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      console.log("Creando una nueva sesión");
      stagehand = new Stagehand({
        env: "BROWSERBASE",
        logger: () => {},
      });
      await stagehand.init();
      return stagehand;
    } catch (error: any) {
      console.error(`Error al crear una nueva sesión (intento ${attempts + 1}):`, error);
      if (error.message.includes("429")) {
        const delay = Math.pow(2, attempts) * 1000; // backoff exponencial
        console.log(`Esperando ${delay}ms antes de reintentar`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
      attempts++;
    }
  }
  throw new Error("No se pudo crear una nueva sesión después de múltiples intentos.");
}

async function runStagehand({
  sessionID,
  method,
  instruction,
}: {
  sessionID: string;
  method: "GOTO" | "ACT" | "EXTRACT" | "OBSERVE" | "CLOSE" | "WAIT" | "NAVBACK";
  instruction?: string;
}) {
  const stagehand = await initStagehand(sessionID);
  const page = stagehand.page;

  try {
    switch (method) {
      case "GOTO":
        await page.goto(instruction!, {
          waitUntil: "commit",
          timeout: 60000,
        });
        break;

      case "ACT":
        await page.act(instruction!);
        break;

      case "EXTRACT": {
        const { extraction } = await page.extract(instruction!);
        return extraction;
      }

      case "OBSERVE":
        return await page.observe({
          instruction,
          useAccessibilityTree: true,
        });

      case "SCREENSHOT": {
        const cdpSession = await page.context().newCDPSession(page);
        const { data } = await cdpSession.send("Page.captureScreenshot");
        return data;
      }

      case "WAIT":
        await new Promise((resolve) =>
          setTimeout(resolve, Number(instruction))
        );
        break;

      case "NAVBACK":
        await page.goBack();
        break;

      case "CLOSE":
        await stagehand.close();
        break;
    }
  } catch (error) {
    await stagehand.close();
    throw error;
  }
}

async function sendPrompt({
  goal,
  sessionID,
  previousSteps = [],
  previousExtraction,
}: {
  goal: string;
  sessionID: string;
  previousSteps?: Step[];
  previousExtraction?: string | ObserveResult[];
}) {
  let currentUrl = "";

  try {
    const stagehand = await initStagehand(sessionID);
    currentUrl = await stagehand.page.url();
    await stagehand.close();
  } catch (error) {
    console.error("Error obteniendo información de la página:", error);
  }

  const content: UserContent = [
    {
      type: "text",
      text: `Considera la siguiente captura de pantalla de una página web${currentUrl ? ` (URL: ${currentUrl})` : ""}, con el objetivo de "${goal}".
${previousSteps.length > 0
    ? `Pasos previos realizados:
${previousSteps
  .map(
    (step, index) => `
Paso ${index + 1}:
- Acción: ${step.text}
- Razonamiento: ${step.reasoning}
- Herramienta utilizada: ${step.tool}
- Instrucción: ${step.instruction}
`
  )
  .join("\n")}`
    : ""
}
Determina el siguiente paso inmediato a realizar para lograr el objetivo.

Lineamientos:
1. Desglosa acciones complejas en pasos atómicos.
2. Para comandos ACT, utiliza solo una acción a la vez.
3. Evita combinar múltiples acciones en una sola instrucción.
4. Si el objetivo se ha alcanzado, retorna "close".`,
    },
  ];

  if (
    previousSteps.length > 0 &&
    previousSteps.some((step) => step.tool === "GOTO")
  ) {
    content.push({
      type: "image",
      image: (await runStagehand({
        sessionID,
        method: "SCREENSHOT",
      })) as string,
    });
  }

  if (previousExtraction) {
    content.push({
      type: "text",
      text: `El resultado de la ${
        Array.isArray(previousExtraction) ? "observación" : "extracción"
      } previa es: ${previousExtraction}.`,
    });
  }

  const message: CoreMessage = {
    role: "user",
    content,
  };

  const result = await generateObject({
    model: LLMClient,
    schema: z.object({
      text: z.string(),
      reasoning: z.string(),
      tool: z.enum([
        "GOTO",
        "ACT",
        "EXTRACT",
        "OBSERVE",
        "CLOSE",
        "WAIT",
        "NAVBACK",
      ]),
      instruction: z.string(),
    }),
    messages: [message],
  });

  return {
    result: result.object,
    previousSteps: [...previousSteps, result.object],
  };
}

async function selectStartingUrl(goal: string) {
  const message: CoreMessage = {
    role: "user",
    content: [
      {
        type: "text",
        text: `Given the goal: "${goal}", determine the best URL to start from.
Choose from:
1. A relevant search engine (Google, Bing, etc.)
2. A direct URL if you're confident about the target website
3. Any other appropriate starting point

Return a URL that would be most effective for achieving this goal.`,
      },
    ],
  };

  const result = await generateObject({
    model: LLMClient,
    schema: z.object({
      url: z.string().url(),
      reasoning: z.string(),
    }),
    messages: [message],
  });

  return result.object;
}

export async function GET() {
  return NextResponse.json({ message: "Agent API endpoint ready" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goal, sessionId, previousSteps = [], action } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId in request body" },
        { status: 400 }
      );
    }

    switch (action) {
      case "START": {
        if (!goal) {
          return NextResponse.json(
            { error: "Missing goal in request body" },
            { status: 400 }
          );
        }
        const { url, reasoning } = await selectStartingUrl(goal);
        const firstStep = {
          text: `Navigating to ${url}`,
          reasoning,
          tool: "GOTO" as const,
          instruction: url,
        };

        await runStagehand({
          sessionID: sessionId,
          method: "GOTO",
          instruction: url,
        });

        return NextResponse.json({
          success: true,
          result: firstStep,
          steps: [firstStep],
          done: false,
        });
      }
      case "GET_NEXT_STEP": {
        if (!goal) {
          return NextResponse.json(
            { error: "Missing goal in request body" },
            { status: 400 }
          );
        }
        const { result, previousSteps: newPreviousSteps } = await sendPrompt({
          goal,
          sessionID: sessionId,
          previousSteps,
        });
        return NextResponse.json({
          success: true,
          result,
          steps: newPreviousSteps,
          done: result.tool === "CLOSE",
        });
      }
      case "EXECUTE_STEP": {
        const { step } = body;
        if (!step) {
          return NextResponse.json(
            { error: "Missing step in request body" },
            { status: 400 }
          );
        }
        const extraction = await runStagehand({
          sessionID: sessionId,
          method: step.tool,
          instruction: step.instruction,
        });
        return NextResponse.json({
          success: true,
          extraction,
          done: step.tool === "CLOSE",
        });
      }
      default:
        return NextResponse.json(
          { error: "Invalid action type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in agent endpoint:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
