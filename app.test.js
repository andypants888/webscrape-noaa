// const { scrape } = require("./app");

app = require("./app");

jest.setTimeout(30000);

// let data = app.scrape();

// data.then((arg) => {
//   console.log(arg);
// });

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
    expect(data).toBe(app.package);
  });
});

// test("promise is returned", async () => {
//   jest.setTimeout(30000);
//   const data = await scrape();
//   expect(data).toHaveProperty("solar_wind_speed");
// });

// console.log("app.emptyArr: ", app.emptyArr);

// console.log(app.package);
