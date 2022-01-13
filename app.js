const puppeteer = require("puppeteer");

// let testArray = [];

async function scrape() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto("https://www.swpc.noaa.gov/");

    // Get Summary Statistics of NOAA
    const summaryStatHandles = await page.$$(
      "#summary > ul > li > .summary-field-value"
    );

    let summaryCount = 1;
    let scaleCount = 1;

    for (const elementHandle of summaryStatHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      // console.log(`Summary-item:`, item);
      // console.log("length: ", summaryStatHandles.length);
      // console.log("summaryCount");
      summaryCount++;

      if (summaryCount === 4) {
        console.log("Summary Stats 4/4 collected");
        now = new Date();
        console.log(`Current Time: ${now}`);
      }
    }

    // Get Letter R, G, S Scales of NOAA
    const scalesStatHandles = await page.$$(
      ".noaa_scale .noaa_scale_group .noaa_scale_value"
    );

    for (const elementHandle of scalesStatHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      // console.log(`Scale-item:`, item);
      // console.log("length: ", scalesStatHandles.length);
      // console.log("scaleCount");
      scaleCount++;

      if (scaleCount === 9) {
        console.log("NOAA Scales Letters 9/9 collected");
        now = new Date();
        console.log(`Current Time: ${now}`);
      }
    }

    await browser.close();
  } catch (error) {}
}
// Production 30 min = 1,800,000 ms
// const interval30Min = setInterval(() => scrape(), 1800000);

// Instant Test
scrape();

// Interval Test 15 secs = 15,000ms
// const interval15Sec = setInterval(() => scrape(), 15000);
