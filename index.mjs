import puppeteer from "puppeteer";
import xlsx from "xlsx";


(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage();

    await page.goto('https://books.toscrape.com/');
    await page.setViewport({ width: 1080, height: 1024 });

    // Screenshots
    // await page.screenshot({ path: './screenshots/books-first-page.jpg' })
    // await page.screenshot({ path: './screenshots/books-full-page.jpg', fullPage: true })

    // Get the title of the page
    const pageTitle = await page.title();
    // console.log("Page Title:", pageTitle);

    // Get category names and links
    const categories = await page.$$eval('.side_categories ul.nav-list > li > ul > li > a', categoryLinks => {
        return categoryLinks.map(link => {
            const name = link.innerText;
            const href = link.getAttribute('href');
            return {
                name: name,
                link: new URL(href, window.location.origin).href
            };
        });
    });

    // console.log("Categories:", categories);


    // Extract image links
    // await page.waitFor(1000);
    const imageLinks = await page.$$eval('.row .product_pod .image_container a', imgs => {
        return imgs.map(img => img.href);
    });
    // console.log(imageLinks);

    //Write files in excel
    const aoaLinks = imageLinks.map(l => [l]);
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(aoaLinks);
    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, 'links.xlsx');

    // Extract Book Titles
    await page.waitForSelector('.row .product_pod h3 a')
    const titles = await page.$$eval('.row .product_pod h3 a', links => {
        return links.map(link => link.textContent);
    });
    // console.log("Titles:", titles);

    // Extract Star Rating
    await page.waitForSelector('.row .product_pod p.star-rating')
    const ratings = await page.$$eval('.row .product_pod p.star-rating', bookRating => {
        return bookRating.map(rating => rating.className.split(' ')[1])
    });
    // console.log(ratings);

    // Extract Book Price in Numeric Value
    await page.waitForSelector('.row .product_pod p.price_color')
    const bookPrice = await page.$$eval('.row .product_pod p.price_color', prices => {
        return prices.map(price => price.textContent.slice(1))
    });
    // console.log(bookPrice);

    // Extract Availability

    const availability = await page.$$eval('.row .product_pod p.instock', bookStock => {
        return bookStock.map(inStock => inStock.className.split(' ')[1])
    });
    // console.log(availability);

    await browser.close();
})();

