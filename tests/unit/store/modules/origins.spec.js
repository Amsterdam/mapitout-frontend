import { mutations, getters, actions } from "../../../../src/store/modules/origins";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("origins store module", () => {
  describe("mutations", () => {
    describe("saveResolved", () => {
      it("should add the resolved address to state", () => {
        const state = { resolved: [] };
        const resolved = { id: "test-id", coordinates: {} };

        mutations.saveResolved(state, resolved);

        expect(state.resolved.length).toBe(1);
        expect(state.resolved.includes(resolved)).toBeTruthy();
      });

      it("should skip adding and already resolved address to state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const resolved2 = { id: "test-id", coordinates: {} };
        const state = { resolved: [resolved] };

        mutations.saveResolved(state, resolved2);

        expect(state.resolved.length).toBe(1);
        expect(state.resolved.includes(resolved)).toBeTruthy();
      });
    });
  });

  describe("getters", () => {
    describe("getResolvedById", () => {
      it("should retrieve the correct resolved address if it's saved into the state", () => {
        const resolved = { id: "test-id", value: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state)(resolved.id);

        expect(result).toEqual(resolved);
      });

      it("should return null if the requested id was not saved into the state", () => {
        const resolved = { id: "test-id", coordinates: {} };
        const state = { resolved: [resolved] };

        const result = getters.getResolvedById(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getOriginIconByOriginTypeId", () => {
      const originType = { id: 0, value: "test-value", icon: "icon" };
      const state = { originTypes: [originType] };

      it("should return the icon of the origin type stored in the state by passed type id", () => {
        const result = getters.getOriginIconByOriginTypeId(state)(originType.id);

        expect(result).toEqual(originType.icon);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginIconByOriginTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });

    describe("getOriginHighlightColorByOriginTypeId", () => {
      const originType = { id: 0, value: "test-value", highlightColor: "color" };
      const state = { originTypes: [originType] };

      it("should return the highlight color of the origin type stored in the state by passed type id", () => {
        const result = getters.getOriginHighlightColorByOriginTypeId(state)(originType.id);

        expect(result).toEqual(originType.highlightColor);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getOriginHighlightColorByOriginTypeId(state)("other-id");

        expect(result).toBe("#000000");
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getPoiIconByPoiTypeId: jest.fn(),
        getResolvedById: jest.fn()
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("lookupAddress", () => {
      it("should call http with the correct url and request object", () => {
        const query = "testQuery";
        const expectedRequestObject = { method: "GET" };
        actions.lookupAddress(context, query);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][0].searchParams.get("q")).toEqual(query);
        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should return a populated suggestion list provided a valid http call response ", async () => {
        const query = "test-query";

        http.mockResolvedValue({
          response: {
            docs: [
              { id: "test-id", weergavenaam: "test address" },
              { id: "test-id1", weergavenaam: "test address1" },
              { id: "test-id2", weergavenaam: "test address2" }
            ]
          }
        });

        const expectedResult = [
          { id: "test-id", label: "test address" },
          { id: "test-id1", label: "test address1" },
          { id: "test-id2", label: "test address2" }
        ];

        const result = await actions.lookupAddress(context, query);

        expect(result).toEqual(expectedResult);
      });

      it("should return an empty suggestion list and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        const result = await actions.lookupAddress(context, query);

        expect(result).toEqual([]);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("resolveAddressId", () => {
      it("should return the already resolved address if present in its state", async () => {
        const testId = "test-id";
        const resolved = { id: testId, address: "test value", addressLat: 1, addressLng: 2 };

        context.getters.getResolvedById.mockReturnValue(resolved);

        const result = await actions.resolveAddressId(context, testId);

        expect(result).toEqual(resolved);
      });

      it("should call http with the correct request object if no resolved value is found in state", () => {
        const testId = "test-id";
        const expectedRequestObject = { method: "GET" };

        actions.resolveAddressId(context, testId);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][0].searchParams.get("id")).toEqual(testId);
        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should return null and dispatch an error on a failed http call", async () => {
        const testId = "test-id";
        const expectedResult = null;

        http.mockRejectedValue(new Error());

        const result = await actions.resolveAddressId(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });

      it("should return a resolved value and commit it to the state on a successful http call", async () => {
        const testId = "test-id";
        const address = "test-address";
        const expectedResult = {
          id: testId,
          address: address,
          lat: 51.31204224,
          lng: 3.94129736
        };

        http.mockResolvedValue({
          response: {
            docs: [
              {
                weergavenaam: address,
                centroide_ll: `POINT(${expectedResult.lng} ${expectedResult.lat})`
              }
            ]
          }
        });

        const result = await actions.resolveAddressId(context, testId);

        expect(result).toEqual(expectedResult);
        expect(context.commit).toBeCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("saveResolved", expectedResult);
      });
    });
  });
});
