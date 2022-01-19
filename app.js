const puppeteer = require("puppeteer");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const now = new Date();

let scrapedPackage = [];

let currentPackage = {
  solar_wind_speed: 0,
  solar_mag_field_1: 1,
  solar_mag_field_2: 2,
  radio_flux: 3,
  yester_max_radio_blackout: 4,
  yester_max_solar_radiation: 5,
  yester_max_geomag_storm: 6,
  current_radio_blackout: 7,
  current_solar_radiation: 8,
  current_geomag_storm: 9,
  predict_day1_geomag_storm: 10,
  predict_day2_geomag_storm: 11,
  predict_day3_geomag_storm: 12,
  predict_day1_minor_radio_blackout: 13,
  predict_day2_minor_radio_blackout: 14,
  predict_day3_minor_radio_blackout: 15,
  predict_day1_major_radio_blackout: 16,
  predict_day2_major_radio_blackout: 17,
  predict_day3_major_radio_blackout: 18,
  predict_day1_solar_storm: 19,
  predict_day2_solar_storm: 20,
  predict_day3_solar_storm: 21,
  scrape_time: now,
};

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
      // console.log(`Summary-item:`, item);
      scrapedPackage.push(item);

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
      // console.log(`Description:`, item);
      scrapedPackage.push(item);

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
      // console.log(item, "chance of Minor Radio Blackout");
      scrapedPackage.push(item);
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
      // console.log(item, "chance of Major Radio Blackout");
      scrapedPackage.push(item);

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
      // console.log(item, "chance of Solar Storm");
      scrapedPackage.push(item);

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

    // Replace placeholders in current Package
    for (key in currentPackage) {
      for (let i = 0; i < scrapedPackage.length; i++) {
        if (i === currentPackage[key]) {
          currentPackage[key] = scrapedPackage[i];
          // console.log(currentPackage);
        }
      }
    }
    for (key in currentPackage) {
      if (
        key === "solar_wind_speed" ||
        key === "solar_mag_field_1" ||
        key === "solar_mag_field_2" ||
        key === "radio_flux"
      ) {
        // Test
        // console.log("match_nums: ", key, currentPackage[key]);
        currentPackage[key] = Number(currentPackage[key]);
      } else if (
        key === "predict_day1_minor_radio_blackout" ||
        key === "predict_day2_minor_radio_blackout" ||
        key === "predict_day3_minor_radio_blackout" ||
        key === "predict_day1_major_radio_blackout" ||
        key === "predict_day2_major_radio_blackout" ||
        key === "predict_day3_major_radio_blackout" ||
        key === "predict_day1_solar_storm" ||
        key === "predict_day2_solar_storm" ||
        key === "predict_day3_solar_storm"
      ) {
        // console.log("match_%s: ", key, currentPackage[key]);
        const percentRemoved = currentPackage[key].replace("%", "");
        // console.log(percentRemoved);
        currentPackage[key] = Number(percentRemoved);
      }
    }
    // Main overall collection test
    // console.log("Object to be sent", currentPackage);

    // Call to MongoDB
    sendData().catch(console.error);

    await browser.close();
    // test passing function through
    // let testPackage = await new Promise((resolve, reject) => {
    //   console.log("test promise is running");
    //   resolve(currentPackage);
    // });
    const result = await new Promise((resolve, reject) => {
      resolve(currentPackage);
    });
    console.log("result: ", result);
    return result;

    // return currentPackage;
  } catch (error) {}

  // console.log("direct from NOAA", scrapedPackage);
}
// Production 30 min = 1,800,000 ms
// const interval30Min = setInterval(() => scrape(), 1800000);

// Instant Test

// Interval Test 15 secs = 15,000ms
// const interval15Sec = setInterval(() => scrape(), 15000);
async function sendData() {
  const uri = `mongodb+srv://spaceweather:${process.env.PASSWORD}@cluster0.ya4xd.mongodb.net/test?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    // Write Seperate Function
    // await listDatabases(client);

    // In-line listDatabases Test
    // const databasesList = await client.db().admin().listDatabases();
    // console.log(databasesList);
    await createForecast(client, currentPackage);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function createForecast(client, newForecast) {
  const result = await client
    .db("test-db")
    .collection("test-collection")
    .insertOne(newForecast);

  // Test for insert success to mongoDB
  // console.log(`ID: ${result.insertedId} Forecast for ${new Date()} added`);
}

async function exam() {
  const result = await new Promise((resolve, reject) => {
    resolve("exam text");
  });
  console.log(result);
  return result;
}

async function wrapper() {
  const scum = await scrape();
  console.log(scum);
  return scum;
}

scrape();

exam();
// wrapper();

// Test exam() without jest
// let data = exam();
// data.then((arg) => {
//   console.log(arg);
// });

// async function read() {
//   let data = await test();
//   console.log(data);
// }
// read();
exports.scrape = scrape;
exports.wrapper = wrapper;
exports.exam = exam;
exports.package = currentPackage;
exports.emptyArr = scrapedPackage;
