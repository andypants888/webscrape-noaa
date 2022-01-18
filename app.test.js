app = require("./app");

test("creates an empty array", () => {
  expect(app.emptyArr).toEqual([]);
});
console.log("app.emptyArr: ", app.emptyArr);
