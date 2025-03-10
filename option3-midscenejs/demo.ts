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
  await sleep(5000);

  // Inicializa el agente de Midscene
  const agent = new PuppeteerAgent(page);

  // Paso 1: En "Type of transaction", escribe "New Application" y pulsa Enter
  await agent.aiAction('In the "Type of transaction" field, type "New Application" and press Enter');
  await sleep(5000);

  // Paso 2: En "Office of origin", busca y selecciona "Madrid"
  await agent.aiAction('In the "Office of origin" field, search for "Philippines" and select it');
  await sleep(5000);

  // Paso 3: En "Número de clases", escribe "10" y pulsa Enter
  await agent.aiAction('In the "Número de clases" field, type "10" and press Enter');
  await sleep(5000);

  // Paso 4: En "Search contracting parties", escribe "Spain" y selecciona el recuadro correspondiente
  await agent.aiAction('In the "Search contracting parties" field, type "Spain" and select the highlighted option');
  await sleep(5000);

  // Paso 5: Haz clic en el botón "Calculate fee"
  await agent.aiAction('Click the "Calculate fee" button');
  await sleep(5000);

  // Paso 6: Extraer el resultado de la tarifa
  const feeResult = await agent.aiQuery(
    '{ fee: string }, extract the calculated fee displayed on the page'
  );
  console.log("Calculated fee:", feeResult);

  await browser.close();
})();




