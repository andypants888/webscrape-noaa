const puppeteer = require("puppeteer");

// DB Fields to be Sent
// let statsNow = {
//   "Yesterday-Max Radio-Blackout": "missing",
//   "Yesterday-RB-color": "missing",
// };

// console.log(statsNow);

// statsNow["Yesterday-Max Radio-Blackout"] = "Purple Alert!";
// statsNow["Yesterday-RB-color"] = "Red Alert!";

// console.log(statsNow);

async function scrape() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto("https://www.swpc.noaa.gov/");

    // Get Summary Statistics of NOAA
    const solarWindStatsHandles = await page.$$(
      "#summary > ul > li > .summary-field-value"
    );

    // Test Variables
    // let summaryCount = 1;
    // let scaleCount = 1;
    // let minorProbCount = 1;
    // let majorProbCount = 1;
    // let solarStormProbCount = 1;

    // Get Solar Wind Stats
    for (const elementHandle of solarWindStatsHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      console.log(`Summary-item:`, item);

      // Test length, count, dates
      // console.log("length: ", solarWindStatsHandles.length);
      // console.log(summaryCount);
      // summaryCount++;

      // if (summaryCount === 4) {
      //   console.log("Solar Wind Stats 4/4 collected");
      //   now = new Date();
      //   console.log(`Current Time: ${now}`);
      // }
    }

    // Get Scale Descriptions eg. 'null', 'none', 'minor', 'moderate', 'strong', 'severe'
    const scaleDescriptionHandles = await page.$$(
      ".noaa_scale .noaa_scale_group .noaa_scale_description"
    );

    for (const elementHandle of scaleDescriptionHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      console.log(`Description:`, item);

      // Test length, count, dates
      // console.log("length: ", scaleDescriptionHandles.length);
      // console.log(scaleCount);
      // scaleCount++;

      // if (scaleCount === 9) {
      //   console.log("Scale Descriptions 9/9 collected");
      //   now = new Date();
      //   console.log(`Current Time: ${now}`);
      // }
    }

    // Get Minor Radio Blackout Probability out of 100%
    const minorProbHandles = await page.$$(".noaa_scale .minor_prob");

    for (const elementHandle of minorProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      console.log(item, "chance of Minor Radio Blackout");

      // Test length, count, dates
      // console.log("length: ", minorProbHandles.length);
      // console.log(minorProbCount);
      // minorProbCount++;

      // if (minorProbCount === 3) {
      //   console.log("Minor Blackout probabilities 3/3 collected");
      //   now = new Date();
      //   console.log(`Current Time: ${now}`);
      // }
    }

    // Get Major Radio Blackout Probability out of 100%
    const majorProbHandles = await page.$$(".noaa_scale .major_prob");

    for (const elementHandle of majorProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      console.log(item, "chance of Major Radio Blackout");

      // Test length, count, dates
      // console.log("length: ", majorProbHandles.length);
      // console.log(majorProbCount);
      // majorProbCount++;

      // if (majorProbCount === 3) {
      //   console.log("Major Blackout probabilities 3/3 collected");
      //   now = new Date();
      //   console.log(`Current Time: ${now}`);
      // }
    }

    // Get Solar Storm Probability out of 100%
    const solarStormProbHandles = await page.$$(".noaa_scale .prob");

    for (const elementHandle of solarStormProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      // Simple Tests
      console.log(item, "chance of Solar Storm Blackout");

      // Test length, count, dates
      // console.log("length: ", solarStormProbHandles.length);
      // console.log(solarStormProbCount);
      // solarStormProbCount++;

      // if (solarStormProbCount === 3) {
      //   console.log("Solar Storm probabilities 3/3 collected");
      //   now = new Date();
      //   console.log(`Current Time: ${now}`);
      // }
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
