const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs/promises');
const SITE =
    'https://www.cisco.com/c/en/us/products/routers/product-listing.html';

const dirName = 'cisco routers';

const dirPath = path.join(process.cwd(), dirName);
const currentDate = new Date().toISOString().replace(/:/g, '-');

const fileName = `Routers_${currentDate}.txt`;

const filePath = path.join(dirPath, fileName);

const changeFolder = async (dirPath) => {
    try {
        // Checking the presence of a directory
        await fs.access(dirPath);
        console.log('The directory exists. Deleting the old directory...');

        // Deleting a directory
        await fs.rm(dirPath, { recursive: true, force: true });
        console.log('The old directory has been deleted.');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Directory not found, create a new one...');
        } else {
            console.error('Error checking directory:', error);
            return; // Terminate function execution on error
        }
    }

    // Create a new directory
    await fs.mkdir(dirPath);
    console.log('The directory was successfully created:', dirPath);
};

const basicFunction = async () => {
    await changeFolder(dirPath);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(SITE, {
        waitUntil: 'networkidle2',
        timeout: 180000,
    });

    const data = await page.evaluate(() => {
        const parentDiv = document.getElementById(
            'res-listing-product-portfolio'
        );
        if (parentDiv) {
            const elements =
                parentDiv.getElementsByClassName('list-section-cat');

            return Array.from(elements).map((element) => element.innerText);
        }
    });
    const dataLinks = await page.evaluate(() => {
        const parentDivLinks = document.getElementById(
            'res-listing-product-portfolio'
        );
        if (parentDivLinks) {
            const elementsLinks =
                parentDivLinks.getElementsByClassName('list-section-cat');

            // Converting a collection of elements into an array
            return Array.from(elementsLinks).flatMap((elementsLinks) => {
                // Selecting all li inside the element
                const listItems = elementsLinks.getElementsByTagName('li');

                // Convert the li collection into an array and get links from each <li>
                return Array.from(listItems).flatMap((li) => {
                    const linkElements = li.getElementsByTagName('a'); // We get all the links inside the current li
                    return Array.from(linkElements).map((a) => a.href); // Returning the href array
                });
            });
        }
        return []; // Return an empty array if parentDiv is not found
    });
    const columnText = await data.join('\n');
    console.log(columnText);
    console.log(dataLinks);
    await fs.writeFile(filePath, columnText, (err) => {
        if (err) {
            return console.error(`Error creating file: ${err.message}`);
        }
    });
    console.log(
        'The file was successfully created in the "cisco routers" folder.'
    );

    for (const url of dataLinks) {
        try {
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 180000,
            });
            // We are looking for a hyperlink with the text “data sheet”

            const dataSheetLink = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                return links
                    .filter(
                        (link) =>
                            link.textContent.includes('data sheet') ||
                            link.textContent.includes('data_sheet')
                    )
                    .map((link) => link.href); // We get the href array of all matching links
            });
            if (dataSheetLink) {
                console.log(`Found data sheet link: ${dataSheetLink}`);

                // Follow every link found
                for (const link of dataSheetLink) {
                    console.log('Follow the link:', link);

                    try {
                        await page.goto(link, {
                            waitUntil: 'networkidle2',
                            timeout: 180000,
                        });
                        await page.evaluate(() => {
                            const bannerIds = [
                                'cocoa-proactice-chat',
                                'onetrust-banner-sdk',
                            ];
                            bannerIds.forEach((id) => {
                                const banner = document.getElementById(id);
                                if (banner) {
                                    banner.style.display = 'none';
                                }
                            });
                        });

                        // Extracting the page title from the URL (last segment)
                        const urlSegments = link.split('/');
                        const penultimateSegment =
                            urlSegments[urlSegments.length - 2];
                        const lastSegment = urlSegments[urlSegments.length - 1];
                        const fileName =
                            `${penultimateSegment}-${lastSegment}.pdf`.replace(
                                /[<>:"/\\|?*]/g,
                                '-'
                            );
                        const filePath = path.join(dirPath, fileName);

                        // Save the page in PDF format
                        await page.pdf({ path: filePath, format: 'A4' });

                        console.log(`Page saved as PDF: ${filePath}`);

                        // Waiting for link elements to load
                        await page.waitForSelector('a');

                        const dataSheetLinkJunior = await page.evaluate(() => {
                            const linksJunior = Array.from(
                                document.querySelectorAll('a')
                            );

                            // Logging the text of all links for analysis
                            linksJunior.forEach((link) =>
                                console.log(link.textContent)
                            );

                            return linksJunior
                                .filter(
                                    (link) =>
                                        link.textContent
                                            .toLowerCase()
                                            .includes('data sheet') ||
                                        link.textContent
                                            .toLowerCase()
                                            .includes('data_sheet')
                                )
                                .map((link) => link.href); // We get the href array of all matching links
                        });

                        if (dataSheetLinkJunior.length > 0) {
                            console.log(dataSheetLinkJunior);
                        } else {
                            console.log('No links to data sheet');
                        }

                        // Follow every link found
                        for (const linkJunior of dataSheetLinkJunior) {
                            console.log('Follow the link:', linkJunior);

                            try {
                                await page.goto(linkJunior, {
                                    waitUntil: 'networkidle2',
                                    timeout: 180000,
                                });
                                await page.evaluate(() => {
                                    const bannerIds = [
                                        'cocoa-proactice-chat',
                                        'onetrust-banner-sdk',
                                    ];
                                    bannerIds.forEach((id) => {
                                        const banner =
                                            document.getElementById(id);
                                        if (banner) {
                                            banner.style.display = 'none';
                                        }
                                    });
                                });

                                // Extracting the page title from the URL (last segment)
                                const urlSegmentsJunior = linkJunior.split('/');
                                const penultimateSegmentJunior =
                                    urlSegmentsJunior[
                                        urlSegmentsJunior.length - 2
                                    ];
                                const lastSegmentJunior =
                                    urlSegmentsJunior[
                                        urlSegmentsJunior.length - 1
                                    ].split('?')[0];
                                const fileNameJunior =
                                    `${penultimateSegmentJunior}-${lastSegmentJunior}.pdf`.replace(
                                        /[<>:"/\\|?*]/g,
                                        '-'
                                    );
                                const filePathJunior = path.join(
                                    dirPath,
                                    fileNameJunior
                                );

                                // Save the page in PDF format
                                await page.pdf({
                                    path: filePathJunior,
                                    format: 'A4',
                                });

                                console.log(
                                    `The younger page is saved in PDF: ${filePathJunior}`
                                );
                            } catch (error) {
                                console.error('Error loading page:', error);
                            }
                        }
                    } catch (error) {
                        console.error('Error loading page:', error);
                    }
                }
            } else {
                console.log(`Data sheet link not found on: ${url}`);
                await page.goBack();
            }
        } catch (error) {
            console.error(
                `Error loading page: ${url}. Reason: ${error.message}`
            );
            // Here you can perform additional actions if an error occurs, for example, write to the log
        }
    }

    await browser.close();
};

basicFunction().catch((err) => console.error(err));
