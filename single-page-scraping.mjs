import puppeteer from "puppeteer";
import xlsx from "xlsx";


async function getPageData(url, page) {

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    const title = await page.$eval('.col-sm-6.product_main h1', (el) => el.innerText)
    const price = await page.$eval('.col-sm-6.product_main .price_color', (el) => el.innerText.slice(1))
    const inStock = await page.$eval('.col-sm-6.product_main p.instock', (el) => el.innerText.split(' (')[1].split(' ')[0])
    // console.log(title, price, inStock);

    return {
        title: title,
        price: price,
        inStock: inStock,
    }
};

async function getLinks() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com/')
    const links = await page.$$eval('.row .product_pod .image_container a', imgs => imgs.map(img => img.href));
    await browser.close();
    return links;
}

async function main() {
    const allLinks = await getLinks()

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const scrapedData = [];

    for (let link of allLinks) {
        const data = await getPageData(link, page);
        // const secondToWait = (Math.floor(Math.random() * 4) + 1) * 1000
        // await new Promise(resolve => setTimeout(resolve, secondToWait));

        // console.log(data);
        scrapedData.push(data)
        console.log(scrapedData);

        //Write files in excel
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(scrapedData)
        xlsx.utils.book_append_sheet(wb, ws);
        xlsx.writeFile(wb, 'Books.xlsx');
    }
    await browser.close();
    console.log("Data Scrape Done!");
}

main();
