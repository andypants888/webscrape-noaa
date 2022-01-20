// const { scrape } = require("./app");

app = require("./app");

jest.setTimeout(30000);

// optional jest flags
// --coverage --watchAll --detectOpenHandles

test("creates an empty array", () => {
  expect(app.emptyArr).toEqual([]);
});

test("promise is resolves to exam text", () => {
  return app.exam().then((data) => {
    expect(data).toBe("exam text");
  });
});

test("app.scrape = function", () => {
  expect(typeof app.scrape).toBe("function");
});

// test("app.scrape = function", () => {
//   expect(typeof app.scrape).toBe("function");
// });

test("main scrape func returns obj package", () => {
  return app.scrape().then((data) => {
    console.log("app.package: ", app.package);
    console.log("data: ", data);

    // Intentional Failure Test
    // console.log("wind speed: ", app.package["solar_wind_speed"]);
    // app.package["solar_wind_speed"] = "GARBAGE!";
    // console.log("wind speed: ", app.package["solar_wind_speed"]);

    expect(typeof app.package["solar_wind_speed"]).toBe("number");
    expect(typeof app.package["solar_mag_field_1"]).toBe("number");
    expect(typeof app.package["solar_mag_field_2"]).toBe("number");
    expect(typeof app.package["yester_max_radio_blackout"]).toBe("string");
    expect(typeof app.package["yester_max_solar_radiation"]).toBe("string");
    expect(typeof app.package["yester_max_geomag_storm"]).toBe("string");
    expect(typeof app.package["current_radio_blackout"]).toBe("string");
    expect(typeof app.package["current_solar_radiation"]).toBe("string");
    expect(typeof app.package["current_geomag_storm"]).toBe("string");
    expect(typeof app.package["predict_day1_geomag_storm"]).toBe("string");
    expect(typeof app.package["predict_day2_geomag_storm"]).toBe("string");
    expect(typeof app.package["predict_day3_geomag_storm"]).toBe("string");
    expect(typeof app.package["predict_day1_minor_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day2_minor_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day3_minor_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day1_major_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day2_major_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day3_major_radio_blackout"]).toBe(
      "number"
    );
    expect(typeof app.package["predict_day1_solar_storm"]).toBe("number");
    expect(typeof app.package["predict_day2_solar_storm"]).toBe("number");
    expect(typeof app.package["predict_day3_solar_storm"]).toBe("number");
  });
});

// test("main scrape func returns obj package2", () => {
//   expect(typeof app.package["solar_wind_speed"]).toBe("number");
//   expect(typeof app.package["solar_mag_field_1"]).toBe("number");
//   expect(typeof app.package["solar_mag_field_2"]).toBe("number");
// });

// test("solar numbers all valid", () => {
//   expect(typeof app.package["solar_wind_speed"]).toBe("number");
//   expect(typeof app.package["solar_mag_field_1"]).toBe("number");
//   expect(typeof app.package["solar_mag_field_2"]).toBe("number");
//   expect(typeof app.package["radio_flux"]).toBe("number");
// });

// test("solar numbers all valid", () => {
//   console.log(app.package);
//   expect(typeof app.package["yester_max_radio_blackout"]).toBe("string");
//   expect(typeof app.package["yester_max_solar_radiation"]).toBe("string");
//   expect(typeof app.package["yester_max_geomag_storm"]).toBe("string");
// });

// test("promise is returned", async () => {
//   jest.setTimeout(30000);
//   const data = await scrape();
//   expect(data).toHaveProperty("solar_wind_speed");
// });

// console.log("app.emptyArr: ", app.emptyArr);

// console.log(app.package);
