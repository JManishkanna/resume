const puppeteer = require('puppeteer');

async function generateERDiagramImage() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log('Loading ER diagram...');
    await page.goto(`file://${__dirname}/er_diagram.html`);

    // Wait for Mermaid to render
    await page.waitForSelector('.mermaid svg', { timeout: 10000 });

    console.log('Taking screenshot...');
    await page.screenshot({
        path: 'er_diagram.jpg',
        fullPage: true,
        quality: 90
    });

    console.log('ER diagram saved as er_diagram.jpg');
    await browser.close();
}

generateERDiagramImage().catch(console.error);