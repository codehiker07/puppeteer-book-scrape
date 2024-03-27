import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://quotes.toscrape.com/')
    await page.waitForSelector('div.col-md-4 p a')
    await page.click('div.col-md-4 p a')
    await page.waitForSelector('#username')
    await page.type('#username', 'motiur', { delay: 100 })
    // await page.waitForSelector('#password')
    await page.type("#password", 'Moti123', { delay: 100 })
    await page.click('input[value="Login"]')
    await browser.close()
})();