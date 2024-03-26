
import puppeteer from "puppeteer"
import fs from "fs"
import path from "path";

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.goto('https://books.toscrape.com/');
    await page.waitForSelector('.product_pod .thumbnail')
    // const imageUrl = await page.$eval('.thumbnail .carousel-inner img', el => el.src)
    const allImageUrl = await page.$$eval('.product_pod .thumbnail', imgsAll => imgsAll.map(a => a.src))
    // console.log(allImageUrl);

    for (let imageUrl of allImageUrl) {
        const filename = imageUrl.split('/').pop();
        const downloadPath = path.join('./images');
        const imagePath = path.join(downloadPath, filename);

        const imageBuffer = await page.goto(imageUrl).then(response => response.buffer());
        fs.writeFileSync(imagePath, imageBuffer);

        console.log('Image Downloaded!');
    }
    await browser.close();
})();