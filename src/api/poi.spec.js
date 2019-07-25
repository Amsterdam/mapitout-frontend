import { fetchPois, lookupPoi } from "./poi";
import * as http from "./util/http";

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock("../env.js");

const requestSpy = jest.spyOn(http, "request").mockImplementation();

describe("fetchPois", () => {
  it("should return an empty array when passed an invalid or empty area parameter", async () => {
    const result1 = await fetchPois({});
    const result2 = await fetchPois({
      paths: {}
    });
    const result3 = await fetchPois({
      paths: []
    });
    const result4 = await fetchPois();

    expect(result1).toEqual([]);
    expect(result2).toEqual([]);
    expect(result3).toEqual([]);
    expect(result4).toEqual([]);
    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("should call request with the correct url and request configuration object", async () => {
    const testArea = {
      paths: [[{ lat: 1, lng: 2 }], [{ lat: 3, lng: 4 }]]
    };
    const testTypes = [1];
    const testSubTypes = [2];

    requestSpy.mockResolvedValue([]);

    await fetchPois(testArea);
    await fetchPois(testArea, testTypes);
    await fetchPois(testArea, [], testSubTypes);
    await fetchPois(testArea, testTypes, testSubTypes);

    expect(requestSpy).toHaveBeenCalledTimes(4);

    expect(requestSpy.mock.calls[0]).toMatchSnapshot();
    expect(requestSpy.mock.calls[1]).toMatchSnapshot();
    expect(requestSpy.mock.calls[2]).toMatchSnapshot();
    expect(requestSpy.mock.calls[3]).toMatchSnapshot();
  });

  it("should throw an error when request rejects", async () => {
    const testArea = {
      paths: [[{ lat: 1, lng: 2 }], [{ lat: 3, lng: 4 }]]
    };

    const expectedError = new Error("test-error");

    requestSpy.mockRejectedValue(expectedError);

    await expect(fetchPois(testArea)).rejects.toThrow(expectedError);
  });

  it("should throw an error if request returns an invalid response", async () => {
    const testArea = {
      paths: [[{ lat: 1, lng: 2 }], [{ lat: 3, lng: 4 }]]
    };

    requestSpy.mockResolvedValue({});

    await expect(fetchPois(testArea)).rejects.toThrow();
  });

  it("should return an empty array if request returns an empty response", async () => {
    const testArea = {
      paths: [[{ lat: 1, lng: 2 }], [{ lat: 3, lng: 4 }]]
    };

    const expectedResult = [];

    requestSpy.mockResolvedValue([]);

    const result = await fetchPois(testArea);

    expect(result).toEqual(expectedResult);
  });

  it("should return the correct value when request resolves with a valid response", async () => {
    const testArea = {
      paths: [[{ lat: 1, lng: 2 }], [{ lat: 3, lng: 4 }]]
    };

    const expectedResult = [{ test: "test" }];

    requestSpy.mockResolvedValue([[{ test: "test" }]]);

    const result = await fetchPois(testArea);

    expect(result).toEqual(expectedResult);
  });
});

describe("lookupPoi", () => {
  const validResponse = {
    name: "test",
    description: "test",
    street: "test street",
    postalcode: "1111 GH",
    city: "test city",
    website: "http://www.example.com",
    phone: "123456",
    geo_location: {
      coordinates: [1, 2]
    },
    typeId: 0
  };
  it("should return null when passed an invalid or empty name parameter", async () => {
    const result1 = await lookupPoi({});
    const result2 = await lookupPoi("");

    expect(result1).toEqual(null);
    expect(result2).toEqual(null);
    expect(requestSpy).toHaveBeenCalledTimes(0);
  });

  it("should call request with the correct url and request configuration object", async () => {
    const testPoiName = "test";

    requestSpy.mockResolvedValue([[validResponse]]);

    await lookupPoi(testPoiName);

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy.mock.calls[0]).toMatchSnapshot();
  });

  it("should throw an error when request rejects", async () => {
    const testPoiName = "test";

    const expectedError = new Error("test-error");

    requestSpy.mockRejectedValue(expectedError);

    await expect(lookupPoi(testPoiName)).rejects.toThrow(expectedError);
  });

  it("should throw an error when request returns an invalid response", async () => {
    const testPoiName = "test";

    requestSpy.mockResolvedValue({});

    await expect(lookupPoi(testPoiName)).rejects.toThrow();
  });

  it("should return null if request returns an empty response", async () => {
    const testPoiName = "test";

    const expectedResult = null;

    requestSpy.mockResolvedValue([[]]);

    const result = await lookupPoi(testPoiName);

    expect(result).toEqual(expectedResult);
  });

  it("should return the correct value when request resolves with a valid response", async () => {
    const testPoiName = "test";
    const expectedResult = {
      address: "test street, 1111 GH test city",
      description: "test",
      lat: 2,
      lng: 1,
      name: "test",
      phone: "123456",
      typeId: undefined,
      website: "http://www.example.com"
    };

    requestSpy.mockResolvedValue([
      [
        {
          name: "test",
          description: "test",
          street: "test street",
          postalcode: "1111 GH",
          city: "test city",
          website: "http://www.example.com",
          phone: "123456",
          geo_location: {
            coordinates: [1, 2]
          },
          typeId: 0
        }
      ]
    ]);

    const result = await lookupPoi(testPoiName);

    expect(result).toEqual(expectedResult);
  });
});
