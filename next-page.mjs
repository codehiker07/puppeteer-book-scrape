import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://books.toscrape.com/')

    // await page.waitForSelector('.pager .next a')
    while (await page.$('.pager .next a')) {
        await page.click('.pager .next a');
        const secondToWait = (Math.floor(Math.random() * 4) + 1) * 1000
        await new Promise(resolve => setTimeout(resolve, secondToWait));
    }
    await browser.close()
})();