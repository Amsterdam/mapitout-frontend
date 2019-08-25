import { mutations, getters, actions } from "./pois";
import * as poiApi from "../../api/poi";

describe("pois store module", () => {
  describe("getters", () => {
    describe("getPoiIconByPoiTypeId", () => {
      const type = { id: 0, icon: "icon" };
      const state = { types: [type] };

      it("should return the icon of the type stored in the state by type id", () => {
        const result = getters.getPoiIconByPoiTypeId(state)(type.id);

        expect(result).toEqual(type.icon);
      });
    });
  });

  describe("mutations", () => {
    describe("update", () => {
      it("should update the state pois with the passed value", () => {
        const state = { pois: [] };
        const pois = { name: "test-name", coordinates: {} };

        mutations.update(state, pois);

        expect(state.pois).toEqual(pois);
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn()
    };

    beforeEach(() => {
      context.rootGetters = {
        "ranges/unionArea": { id: "0", paths: [] },
        "filters/selectedTypes": [],
        "filters/selectedSubTypes": []
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("update", () => {
      const fetchPoisSpy = jest.spyOn(poiApi, "fetchPois").mockImplementation();

      it("should not call the fetchPois api when rootstate has an undefined unionArea and it should commit an update action with an empty array", async () => {
        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": undefined,
            "filters/selectedTypes": [],
            "filters/selectedSubTypes": []
          }
        });

        expect(fetchPoisSpy).toHaveBeenCalledTimes(0);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", []);
      });

      it("should not call the fetchPois api when rootstate has no selected types or subtype and it should commit an update action with an empty array", async () => {
        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": [],
            "filters/selectedSubTypes": []
          }
        });

        expect(fetchPoisSpy).toHaveBeenCalledTimes(0);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", []);
      });

      it("should call the fetchPois api when rootstate has a union area defined and selected types and it should commit an update action with an empty array", async () => {
        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": ["test"],
            "filters/selectedSubTypes": []
          }
        });

        expect(fetchPoisSpy).toHaveBeenCalledTimes(1);
      });

      it("should call the fetchPois api when rootstate has a union area defined and selected sub-types and it should commit an update action with an empty array", async () => {
        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": [],
            "filters/selectedSubTypes": ["test"]
          }
        });

        expect(fetchPoisSpy).toHaveBeenCalledTimes(1);
      });

      it("should call the fetchPois api when rootstate has a union area defined and selected types and sub-types and it should commit an update action with an empty array", async () => {
        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": ["test"],
            "filters/selectedSubTypes": ["test"]
          }
        });

        expect(fetchPoisSpy).toHaveBeenCalledTimes(1);
      });

      it("should dispatch an error and commit an update mutation with an empty array when the fetchPois api throws", async () => {
        const expectedError = new Error("test");

        fetchPoisSpy.mockRejectedValue(expectedError);

        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": ["test"],
            "filters/selectedSubTypes": []
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", []);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith(
          "errors/network",
          expectedError,
          { root: true }
        );
      });

      it("should commit an update mutation with the value return from the fetchPois api when the fetchPois api resolves", async () => {
        const expectedResult = [{ test: "test", icon: "test" }];

        fetchPoisSpy.mockResolvedValue(expectedResult);

        await actions.update({
          ...context,
          rootGetters: {
            "ranges/unionArea": { id: "0", paths: [] },
            "filters/selectedTypes": ["test"],
            "filters/selectedSubTypes": []
          },
          getters: {
            getPoiIconByPoiTypeId: jest.fn().mockReturnValue("test")
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", expectedResult);
      });
    });

    describe("lookup", () => {
      const lookupPoiSpy = jest.spyOn(poiApi, "lookupPoi").mockImplementation();

      it("should return null when passed an invalid parameter", async () => {
        const result1 = await actions.lookup(context, {});
        const result2 = await actions.lookup(context, "");

        expect(result1).toBe(null);
        expect(result2).toBe(null);

        expect(lookupPoiSpy).toHaveBeenCalledTimes(0);
      });

      it("should return null and dispatch an error when the lookupPoi api rejects ", async () => {
        const expectedError = new Error("test");

        lookupPoiSpy.mockRejectedValue(expectedError);

        const result = await actions.lookup(context, "test");

        expect(result).toBe(null);

        expect(lookupPoiSpy).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith(
          "errors/network",
          expectedError,
          { root: true }
        );
      });

      it("should return the lookupPoi api result when it resolves", async () => {
        const expectedValue = { test: "test" };

        lookupPoiSpy.mockResolvedValue(expectedValue);

        const result = await actions.lookup(context, "test");

        expect(result).toBe(expectedValue);

        expect(lookupPoiSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
