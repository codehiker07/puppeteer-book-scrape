import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://www.typingtest.com/')
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('.css-47sehv')
    await page.click('.css-47sehv')
    await page.waitForSelector('label.switch')
    await page.click('label.switch')
    await page.waitForSelector('span.trigger-arrow')
    await page.click('span.trigger-arrow')
    const secondToWait = (Math.floor(Math.random() * 4) + 1) * 1000
    await new Promise(resolve => setTimeout(resolve, secondToWait));
    await page.click('ul.dropdownvisible li:nth-child(3)');
    await page.click('.start-btn.over-anim')

    await browser.close()
})();