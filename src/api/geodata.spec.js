import { searchAddresses, geoLocateAddress, cache } from "./geodata";
import * as http from "./util/http";
import { ENDPOINT_ADDRESS_SEARCH, ENDPOINT_GEOLOCATION } from "../env";

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock("../env.js");

const requestSpy = jest.spyOn(http, "request").mockImplementation();

describe("searchAddresses", () => {
  it("should return an empty array when passed an invalid or empty parameter", async () => {
    const result1 = await searchAddresses({});
    const result2 = await searchAddresses();

    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("should call request with the correct url and request configuration object", async () => {
    const testQuery = "test";

    requestSpy.mockResolvedValue({
      response: {
        docs: []
      }
    });

    await searchAddresses(testQuery);

    const expectedUrl = `${ENDPOINT_ADDRESS_SEARCH}?q=${testQuery}`;
    const expectedRequestConfig = {
      method: "GET"
    };

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(expectedUrl, expectedRequestConfig);
  });

  it("should throw an error when request rejects", async () => {
    const expectedError = new Error("test-error");

    requestSpy.mockRejectedValue(expectedError);

    await expect(searchAddresses("test")).rejects.toThrow(expectedError);
  });

  it("should throw and error if request returns an invalid response", async () => {
    requestSpy.mockResolvedValue({
      response: {}
    });

    await expect(searchAddresses("test")).rejects.toThrow();
  });

  it("should return an empty array if request returns an empty response", async () => {
    const expectedResult = [];

    requestSpy.mockResolvedValue({
      response: {
        docs: []
      }
    });

    const result = await searchAddresses("test");

    expect(result).toEqual(expectedResult);
  });

  it("should return the correct value when request resolves with a valid response", async () => {
    const expectedResult = [
      {
        id: "test",
        address: "test"
      }
    ];

    requestSpy.mockResolvedValue({
      response: {
        docs: [
          {
            id: "test",
            weergavenaam: "test"
          }
        ]
      }
    });

    const result = await searchAddresses("test");

    expect(result).toEqual(expectedResult);
  });
});

describe("geoLocateAddress", () => {
  beforeEach(() => {
    cache.geoLocation = {};
  });

  it("should return null when passed an invalid or empty parameter", async () => {
    const result1 = await geoLocateAddress({});
    const result2 = await geoLocateAddress();

    expect(result1).toEqual(null);
    expect(result2).toEqual(null);
    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("should return a cached value if any is found", async () => {
    const testAddressId = "test";
    const cachedValue = {
      id: "test",
      address: "test",
      lat: 1234,
      lng: 5678
    };

    cache.geoLocation[testAddressId] = cachedValue;

    const result = await geoLocateAddress(testAddressId);

    expect(requestSpy).toHaveBeenCalledTimes(0);
    expect(result).toEqual(cachedValue);
  });

  describe("when no cached value exists", () => {
    it("should call request with the correct url and request configuration object", async () => {
      requestSpy.mockResolvedValue({
        response: {
          docs: []
        }
      });
      const testAddressIt = "test";

      await geoLocateAddress(testAddressIt);

      const expectedUrl = `${ENDPOINT_GEOLOCATION}?id=${testAddressIt}`;
      const expectedRequestConfig = {
        method: "GET"
      };

      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(requestSpy).toHaveBeenCalledWith(
        expectedUrl,
        expectedRequestConfig
      );
    });

    it("should throw an error when request rejects", async () => {
      const expectedError = new Error("test-error");

      requestSpy.mockRejectedValue(expectedError);

      await expect(geoLocateAddress("test")).rejects.toThrow(expectedError);
    });

    it("should throw and error if request returns an invalid response", async () => {
      requestSpy.mockResolvedValue({
        response: {}
      });

      await expect(geoLocateAddress("test")).rejects.toThrow();
    });

    it("should return null if request returns an empty response", async () => {
      const expectedResult = null;

      requestSpy.mockResolvedValue({
        response: {
          docs: []
        }
      });

      const result = await geoLocateAddress("test");

      expect(result).toEqual(expectedResult);
    });

    it("should return the correct value when request resolves with a valid response and save it to cache", async () => {
      const testAddressId = "test";
      const expectedResult = {
        id: testAddressId,
        address: "test",
        lat: 11.11,
        lng: 12.12
      };

      requestSpy.mockResolvedValue({
        response: {
          docs: [
            {
              centroide_ll: "POINT(12.12 11.11)",
              weergavenaam: "test"
            }
          ]
        }
      });

      const result = await geoLocateAddress(testAddressId);

      expect(result).toEqual(expectedResult);
      expect(cache.geoLocation[testAddressId]).toEqual(expectedResult);
    });
  });
});
