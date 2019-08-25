import { request } from "./http";

describe("request", () => {
  afterEach(() => {
    jest.resetAllMocks();
    fetch.resetMocks();
  });

  it("should call fetch with the passed in url and request configuration object", async () => {
    const url = "https://www.example.com";

    const requestConfig = {
      method: "GET"
    };

    fetch.mockResponse(JSON.stringify({}));

    await request(url, requestConfig);

    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0]).toEqual([url, requestConfig]);
  });

  it("should return the response json on a successful call", async () => {
    const url = "https://www.example.com";

    const requestConfig = {
      method: "GET"
    };

    const expectedResponse = { test: 1 };

    fetch.mockResponse(JSON.stringify(expectedResponse));

    const response = await request(url, requestConfig);

    expect(response).toEqual(expectedResponse);
  });

  it("should throw an error on a failed fetch call", async () => {
    const url = "https://www.example.com";

    const requestConfig = {
      method: "GET"
    };

    const expectedError = new Error("test-http");

    fetch.mockReject(expectedError);

    await expect(request(url, requestConfig)).rejects.toThrow(expectedError);
  });

  it("should throw an error on a successful fetch call with an invalid payload", async () => {
    const url = "https://www.example.com";

    const requestConfig = {
      method: "GET"
    };

    fetch.mockResponse("test");

    await expect(request(url, requestConfig)).rejects.toThrow(
      "Invalid server response"
    );
  });
});
