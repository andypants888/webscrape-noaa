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
  // If on 2nd iteration, reset all.
  console.log("before deleted ID", typeof currentPackage["_id"]);
  if (typeof currentPackage["_id"] === "object") {
    console.log("Begin Tests");
    delete currentPackage["_id"];

    console.log("Current Package BEFORE RESET", currentPackage, scrapedPackage);
    for (const member in currentPackage) delete currentPackage[member];
    console.log("New Package BEFORE reset", newPackage);

    // Reset Scraped Package
    scrapedPackage = [];
    // Reset currentPackage Object
    currentPackage = JSON.parse(JSON.stringify(newPackage));

    console.log("Current Package AFTER reset", currentPackage, scrapedPackage);
    console.log("New Package AFTER reset", newPackage);
    console.log("End Tests");
    // Repeat errors in lines 44 to 138 on repeat?
  }
  console.log("new Date test: ", new Date());

  console.log("after delete ID", typeof currentPackage["_id"]);

  currentPackage["scrape_time"] = new Date();

  console.log("Trying to launch puppeteer...");

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    console.log("Trying to execute main function...");
    const page = await browser.newPage();
    await page.goto("https://www.swpc.noaa.gov/");

    // Get Summary Statistics of NOAA
    const solarWindStatsHandles = await page.$$(
      "#summary > ul > li > .summary-field-value"
    );

    // Get Solar Wind Stats
    for (const elementHandle of solarWindStatsHandles) {
      const item = await page.evaluate((elem) => elem.innerHTML, elementHandle);
      console.log("Puppeteer is functioning...");

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
    console.log("result: ", result);
    return preResult;
  } catch (error) {
    console.log("error in scrape function");
  } finally {
    browser.close();

    // Use Heroku Scheduler to Loop instead of nodejs.
    // setTimeout(scrape, 30000);
  }
}

async function sendData() {
  const uri = `mongodb+srv://spaceweather:${process.env.PASSWORD}@cluster0.ya4xd.mongodb.net/test?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await createForecast(client, currentPackage);
    console.log("Trying to connect MongoDB");
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

  console.log(`ID: ${result.insertedId} Forecast for ${new Date()} added`);
}

scrape();

// Production 20 min = 1,200,000 ms
// setInterval(() => scrape(),  1200000);

// Interval Test 30 secs = 30,000ms
// const interval30Sec = setInterval(() => scrape(), 30000);

exports.scrape = scrape;
// exports.wrapper = wrapper;
// exports.exam = exam;
exports.package = currentPackage;
exports.emptyArr = scrapedPackage;
