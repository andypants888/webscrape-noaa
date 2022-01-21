const puppeteer = require("puppeteer");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

let scrapedPackage = [];

let newPackage = {
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
  scrape_time: {},
};

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
  scrape_time: {},
};

async function scrape() {
  currentPackage["scrape_time"] = new Date();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.swpc.noaa.gov/");

    // Get Summary Statistics of NOAA
    const solarWindStatsHandles = await page.$$(
      "#summary > ul > li > .summary-field-value"
    );

    // Get Solar Wind Stats
    for (const elementHandle of solarWindStatsHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      scrapedPackage.push(item);
    }

    // Get Scale Descriptions eg. 'null', 'none', 'minor', 'moderate', 'strong', 'severe'
    const scaleDescriptionHandles = await page.$$(
      ".noaa_scale .noaa_scale_group .noaa_scale_description"
    );

    for (const elementHandle of scaleDescriptionHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      scrapedPackage.push(item);
    }

    // Get Minor Radio Blackout Probability out of 100%
    const minorProbHandles = await page.$$(".noaa_scale .minor_prob");

    for (const elementHandle of minorProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      scrapedPackage.push(item);
    }

    // Get Major Radio Blackout Probability out of 100%
    const majorProbHandles = await page.$$(".noaa_scale .major_prob");

    for (const elementHandle of majorProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      scrapedPackage.push(item);
    }

    // Get Solar Storm Probability out of 100%
    const solarStormProbHandles = await page.$$(".noaa_scale .prob");

    for (const elementHandle of solarStormProbHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);

      scrapedPackage.push(item);
    }

    // Replace placeholders in current Package
    for (key in currentPackage) {
      for (let i = 0; i < scrapedPackage.length; i++) {
        if (i === currentPackage[key]) {
          currentPackage[key] = scrapedPackage[i];
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
        const percentRemoved = currentPackage[key].replace("%", "");
        currentPackage[key] = Number(percentRemoved);
      }
    }

    // Call to MongoDB
    sendData().catch(console.error);

    await browser.close();
    const preResult = new Promise((resolve, reject) => {
      resolve(currentPackage);
    });
    // const result = await preResult;
    // console.log("result: ", result);
    return preResult;
  } catch (error) {
    console.log("error in scrape function");
  } finally {
    browser.close();
    // Loop is NOT properly resetting to original state.
    // Same MongoDB ID is being generated each time?
    // Date is being generated only once per loop. Scrape needs to be in a for loop?
    console.log("Begin Tests");
    // console.log("Before next loop", currentPackage);

    console.log(currentPackage, scrapedPackage);
    currentPackage = {};
    scrapedPackage = [];
    console.log(currentPackage, scrapedPackage);

    // console.log("Solar Wind Speed", currentPackage["solar_wind_speed"]);
    // console.log(
    //   "Minor RB",
    //   currentPackage["predict_day1_minor_radio_blackout"]
    // );
    // console.log("Solar Storm", currentPackage["predict_day1_solar_storm"]);

    currentPackage = newPackage;
    console.log("Current Package", currentPackage);
    console.log("End Tests");
    // Repeat errors in lines 44 to 138 on repeat?
    setTimeout(scrape, 30000);
  }
}
// Production 60 min = 3,600,000 ms
// const interval3Hours = setInterval(() => scrape(), 10800000);

// Staging Fast Test once per minute
// const interval1Min = setInterval(() => scrape(), 30000);

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
    // console.error(err);
  } finally {
    await client.close();
  }
}

async function createForecast(client, newForecast) {
  const result = await client
    .db("spaceWeather")
    .collection("NOAA")
    .insertOne(newForecast);

  // Test for insert success to mongoDB
  // Fires off only one time on loop...?
  console.log(`ID: ${result.insertedId} Forecast for ${new Date()} added`);
}

// Test Dummy Function
async function exam() {
  const result = await new Promise((resolve, reject) => {
    resolve("exam text");
  });
  console.log(result);
  return result;
}

// Trying to wrap main function with promise return
async function wrapper() {
  const scum = await scrape();
  console.log(scum);
  return scum;
}

scrape();
// console.log(currentPackage);

// exam();
// wrapper();

exports.scrape = scrape;
exports.wrapper = wrapper;
exports.exam = exam;
exports.package = currentPackage;
exports.emptyArr = scrapedPackage;
