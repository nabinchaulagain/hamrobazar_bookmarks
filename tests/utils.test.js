const { getTimeFrom } = require("../utils");
const { randomInt } = require("./helpers/random");
describe("time should work", () => {
  it("for few seconds", () => {
    const date = Date.now() - randomInt(1, 30) * 1000;
    expect(getTimeFrom(date)).toEqual("a few seconds ago");
  });
  it("for seconds", () => {
    const rand = randomInt(31, 59);
    const date = Date.now() - rand * 1000;
    expect(getTimeFrom(date)).toMatch(/seconds ago/i);
  });
  it("for minutes", () => {
    const date = Date.now() - randomInt(2, 59) * 1000 * 60;
    expect(getTimeFrom(date)).toMatch(/minutes ago/i);
  });
  it("for hours", () => {
    const date = Date.now() - randomInt(2, 23) * 1000 * 60 * 60;
    expect(getTimeFrom(date)).toMatch(/hours ago/i);
  });
  it("for days", () => {
    const date = Date.now() - randomInt(2, 29) * 1000 * 60 * 60 * 24;
    expect(getTimeFrom(date)).toMatch(/days ago/i);
  });
  it("for months", () => {
    const date = Date.now() - randomInt(2, 11) * 1000 * 60 * 60 * 24 * 30;
    expect(getTimeFrom(date)).toMatch(/months ago/i);
  });
  it("for years", () => {
    const date = Date.now() - randomInt(1, 200000) * 1000 * 60 * 60 * 24 * 30 * 12;
    expect(getTimeFrom(date)).toMatch(/years ago/i);
  });
});
