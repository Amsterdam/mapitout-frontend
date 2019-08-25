import { fetchAreas, cache } from "./travelTime";
import * as http from "./util/http";
import { omit } from "lodash-es";

import * as getDepartureTimeModule from "./util/getDepartureTime";

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock("../env.js");

const requestSpy = jest.spyOn(http, "request").mockImplementation();

describe("fetchAreas", () => {
  beforeEach(() => {
    cache.areas = {};
  });

  const getDepartureTimeSpy = jest
    .spyOn(getDepartureTimeModule, "getDepartureTime")
    .mockImplementation();

  beforeEach(() => {
    getDepartureTimeSpy.mockReturnValue(new Date("2019-07-15T09:00:00.000Z"));
  });

  const validRangeParam1 = {
    id: "0",
    origin: "",
    originId: "",
    originLat: 0,
    originLng: 0,
    originTypeId: 0,
    travelTime: 45,
    transportTypeValue: "0"
  };

  const validRangeParam2 = {
    id: "1",
    origin: "",
    originId: "",
    originLat: 0,
    originLng: 0,
    originTypeId: 0,
    travelTime: 45,
    transportTypeValue: "0"
  };

  it("should return an empty array when passed an invalid or empty rangesParams parameter", async () => {
    const result1 = await fetchAreas({});
    const result2 = await fetchAreas([]);

    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("should return a cached value if any is found", async () => {
    const cacheKey = [validRangeParam1]
      .map(rangeParams => omit(rangeParams, ["id", "origin"]))
      .map(rangeParams =>
        Object.values(rangeParams)
          .sort()
          .join("-")
      )
      .join(";");

    const expectedResult = { results: [] };

    cache.areas[cacheKey] = expectedResult;

    const result = await fetchAreas([validRangeParam1]);

    expect(requestSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual(expectedResult);
  });

  describe("when no cached value exists", () => {
    it("should call request with the correct url and request configuration object", async () => {
      const rangesParams1 = [validRangeParam1];
      const rangesParams2 = [validRangeParam1, validRangeParam2];

      requestSpy.mockResolvedValue({
        results: []
      });

      await fetchAreas(rangesParams1);
      await fetchAreas(rangesParams2);

      getDepartureTimeSpy.mockReturnValue(new Date("2019-07-15T09:00:00.000Z"));

      expect(requestSpy).toHaveBeenCalledTimes(2);
      expect(requestSpy.mock.calls[0]).toMatchSnapshot();
      expect(requestSpy.mock.calls[1]).toMatchSnapshot();
    });

    it("should throw an error when request rejects", async () => {
      const expectedError = new Error("test-error");

      requestSpy.mockRejectedValue(expectedError);

      await expect(fetchAreas([validRangeParam1])).rejects.toThrow(
        expectedError
      );
    });

    it("should throw and error if request returns an invalid response", async () => {
      requestSpy.mockResolvedValue({
        response: {}
      });

      await expect(fetchAreas([validRangeParam1])).rejects.toThrow();
    });

    it("should return an empty array if request returns an empty response", async () => {
      const expectedResult = [];

      requestSpy.mockResolvedValue({
        results: []
      });

      const result = await fetchAreas("test");

      expect(result).toEqual(expectedResult);
    });

    it("should return the correct value when request resolves with a valid response and save it to cache", async () => {
      const rangesParams = [validRangeParam1, validRangeParam2];

      requestSpy.mockResolvedValue({
        results: [
          {
            search_id: "0",
            rangeId: "0",
            shapes: [
              {
                shell: [[1, 2]],
                holes: [[3, 4]]
              }
            ]
          }
        ]
      });

      const result = await fetchAreas(rangesParams);

      const cacheKey = rangesParams
        .map(rangeParams => omit(rangeParams, ["id", "origin"]))
        .map(rangeParams =>
          Object.values(rangeParams)
            .sort()
            .join("-")
        )
        .join(";");

      const expectedResult = [{ id: "0", paths: [[[1, 2]], [3, 4]] }];

      expect(result).toEqual(expectedResult);
      expect(cache.areas[cacheKey]).toEqual(expectedResult);
    });
  });
});
