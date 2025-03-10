import 'dotenv/config';
import puppeteer from "puppeteer";
import { PuppeteerAgent } from "@midscene/web/puppeteer";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Modo visual para depuración
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 768,
    deviceScaleFactor: 1,
  });

  await page.goto("https://madrid.wipo.int/feecalcapp/");
  await sleep(5000); // espera a que cargue la página

  // Inicializa el agente de Midscene
  const agent = new PuppeteerAgent(page);

  // Combina todas las acciones en una única instrucción
  await agent.aiAction(
    `1. In the "Type of transaction" field, type "New Application" and press Enter.
     2. In the "Office of origin" field, search for "Philippines" and select it.
     3. In the "Número de clases" field, type "10" and press Enter.
     4. In the "Search contracting parties" field, type "Spain" and select the highlighted option.
     5. Click the "Calculate fee" button.`
  );
  
  // Espera un poco para que se ejecute toda la secuencia y se muestre el resultado
  await sleep(20000);

  // Extraer el resultado de la tarifa
  const feeResult = await agent.aiQuery(
    '{ fee: string }, extract the calculated fee displayed on the page'
  );
  console.log("Calculated fee:", feeResult);

  await browser.close();
})();
