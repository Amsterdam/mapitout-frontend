import { mutations, actions, getters } from "@/store/modules/ranges";
import * as travelTimeApi from "../../api/travelTime";

describe("ranges store module", () => {
  describe("getters", () => {
    describe("unionArea", () => {
      const unionArea = { id: "union", areas: [{ id: 0 }] };

      it("should return the area with the id union from state", () => {
        const result = getters.unionArea({
          areas: [unionArea]
        });

        expect(result).toEqual(unionArea);
      });

      it("should return undefined for no union area found", () => {
        const result = getters.unionArea({
          areas: []
        });

        expect(result).toBeUndefined();
      });
    });
  });

  describe("mutations", () => {
    describe("selectId", () => {
      it("should update the value of the state selectedId", () => {
        const state = {
          selectedId: "0"
        };

        mutations.selectId(state, "1");

        expect(state.selectedId).toBe("1");
      });
    });

    describe("updateParams", () => {
      it("should update the value of the state params", () => {
        const state = {
          params: []
        };
        const params = [{ id: 0 }];

        mutations.updateParams(state, params);

        expect(state.params).toEqual(params);
      });
    });

    describe("updateAreas", () => {
      it("should update the value of the state areas", () => {
        const state = {
          areas: []
        };
        const areas = [{ id: 0 }];

        mutations.updateAreas(state, areas);

        expect(state.areas).toEqual(areas);
      });
    });
  });

  describe("actions", () => {
    const context = {
      commit: jest.fn(),
      dispatch: jest.fn(),
      state: {
        selectedId: "",
        params: [],
        areas: []
      }
    };

    const params1 = {
      departureTime: "test",
      id: "0",
      origin: "",
      originId: "",
      originLat: 0,
      originLng: 0,
      originTypeId: 0,
      transportTypeValue: "cycling",
      travelTime: 45
    };
    const params2 = {
      departureTime: "test",
      id: "1",
      origin: "",
      originId: "",
      originLat: 0,
      originLng: 0,
      originTypeId: 0,
      transportTypeValue: "cycling",
      travelTime: 45
    };

    beforeEach(() => {
      context.state = {
        selectedId: "",
        params: [],
        areas: []
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("addParams", () => {
      it("should return the newly added rangeParams when dispatched", () => {
        const result = actions.addParams(context);

        expect(result).toEqual({
          id: "0",
          origin: "",
          originId: "",
          originLat: 0,
          originLng: 0,
          originTypeId: 0,
          transportTypeValue: "cycling",
          travelTime: 45
        });
      });

      it("should dispatch an updateAllParams action with the new params when passed no parameters", () => {
        actions.addParams(context);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("updateAllParams", [
          {
            id: "0",
            origin: "",
            originId: "",
            originLat: 0,
            originLng: 0,
            originTypeId: 0,
            transportTypeValue: "cycling",
            travelTime: 45
          }
        ]);
      });

      it("should dispatch an updateAllParams action with the new params when passed some parameters", () => {
        actions.addParams(context, {
          travelTime: 60,
          transportTypeValue: "driving"
        });

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("updateAllParams", [
          {
            id: "0",
            origin: "",
            originId: "",
            originLat: 0,
            originLng: 0,
            originTypeId: 0,
            transportTypeValue: "driving",
            travelTime: 60
          }
        ]);
      });

      it("should dispatch an updateAllParams action with the new params containing the new range with a correct id", () => {
        actions.addParams({
          ...context,
          state: {
            params: [{ id: "0" }]
          }
        });

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("updateAllParams", [
          { id: "0" },
          {
            id: "1",
            origin: "",
            originId: "",
            originLat: 0,
            originLng: 0,
            originTypeId: 0,
            transportTypeValue: "cycling",
            travelTime: 45
          }
        ]);
      });
    });

    describe("removeParams", () => {
      beforeEach(() => {
        context.state = {
          selectedId: "",
          params: [params1, params2]
        };
      });

      it("should dispatch an updateAllParams action with the updated params", () => {
        actions.removeParams(context, params1.id);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("updateAllParams", [
          params2
        ]);
      });

      it("should only dispatch an updateAllParams action if the passed id exists", () => {
        actions.removeParams(context, "test-id");

        expect(context.dispatch).toHaveBeenCalledTimes(0);
      });
    });

    describe("updateParams", () => {
      const params1 = actions.addParams(context);
      const params2 = actions.addParams(context);

      jest.resetAllMocks();

      beforeEach(() => {
        context.state = {
          selectedId: "",
          params: [params1, params2]
        };
      });

      it("should dispatch an updateAllParams mutation with the updated params", () => {
        const updatedParams = { ...params1, travelTime: 60 };

        actions.updateParams(context, updatedParams);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0]).toMatchSnapshot();
      });
    });

    describe("updateAllParams", () => {
      const params1 = actions.addParams(context);
      const params2 = actions.addParams(context);

      jest.resetAllMocks();

      beforeEach(() => {
        context.state = {
          selectedId: "",
          params: [params1, params2]
        };
      });

      it("should commit an updateParams mutation with the updated params", () => {
        const updatedParams = [
          {
            ...params1,
            travelTime: 60
          },
          params2
        ];
        actions.updateAllParams(context, updatedParams);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith(
          "updateParams",
          updatedParams
        );
      });

      it("should only commit an updateParams mutation if the passed params have changed", () => {
        const updatedParams = [params1, params2];
        actions.updateAllParams(context, updatedParams);

        expect(context.commit).toHaveBeenCalledTimes(0);
      });
    });

    describe("updateAreas", () => {
      const fetchAreasSpy = jest
        .spyOn(travelTimeApi, "fetchAreas")
        .mockImplementation();

      it("should call the fetchAreas api when called with at least one rangeParams with a defined originId", async () => {
        const expectedValue = [{ test: "test" }];
        const rangesParams = [params1, { ...params2, originId: "test" }];

        fetchAreasSpy.mockResolvedValue(expectedValue);

        await actions.updateAreas(context, rangesParams);

        expect(fetchAreasSpy).toHaveBeenCalledTimes(1);
        expect(fetchAreasSpy).toHaveBeenCalledWith([rangesParams[1]]);
      });

      it("should dispatch an error and commit updateAreas with an empty array when the fetchAreas throws an error", async () => {
        const expectedValue = [];
        const expectedError = new Error("test-error");
        const rangesParams = [params1, { ...params2, originId: "test" }];

        fetchAreasSpy.mockRejectedValue(expectedError);

        await actions.updateAreas(context, rangesParams);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith(
          "updateAreas",
          expectedValue
        );
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith(
          "errors/network",
          expectedError,
          { root: true }
        );
      });

      it("should commit updateAreas with the returned fetchAreas result", async () => {
        const expectedValue = [{ test: "test" }];
        const rangesParams = [params1, { ...params2, originId: "test" }];

        fetchAreasSpy.mockResolvedValue(expectedValue);

        await actions.updateAreas(context, rangesParams);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith(
          "updateAreas",
          expectedValue
        );
      });

      it("should commit updateAreas with an empty array when called with no rangeParams with defined originIds", async () => {
        const expectedValue = [];
        const rangesParams = [params1, params2];

        await actions.updateAreas(context, rangesParams);

        expect(fetchAreasSpy).toHaveBeenCalledTimes(0);
        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith(
          "updateAreas",
          expectedValue
        );
      });
    });

    describe("selectId", () => {
      beforeEach(() => {
        context.state = {
          selectedId: "",
          params: [params1, params2]
        };
      });

      it("should commit a selectId mutation with the new selectedId", () => {
        actions.selectId(context, params1.id);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("selectId", params1.id);
      });

      it("should not commit a selectId mutation when re-selecting an id", () => {
        context.state.selectedId = params1.id;
        actions.selectId(context, params1.id);

        expect(context.commit).toHaveBeenCalledTimes(0);
      });

      it("should not commit a selectId mutation when the selected id is not found", () => {
        actions.selectId(context, "bogus id");

        expect(context.commit).toHaveBeenCalledTimes(0);
      });
    });
  });
});
