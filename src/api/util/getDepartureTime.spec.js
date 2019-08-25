import { getDepartureTime } from "./getDepartureTime";

describe("getDepartureTime", () => {
  it("should return the current day 9AM GMT+1 if the current day is a Monday", () => {
    const date = new Date(2019, 3, 1, 13, 1, 0, 0);

    const departureTime = getDepartureTime(date);

    expect(departureTime.toISOString()).toBe("2019-04-01T09:00:00.000Z");
  });

  it("should return the next Monday9AM GMT+1 if the current day is not a Monday", () => {
    const date = new Date(2019, 3, 5, 13, 1, 0, 0);

    const departureTime = getDepartureTime(date);

    expect(departureTime.toISOString()).toBe("2019-04-08T09:00:00.000Z");
  });
});
