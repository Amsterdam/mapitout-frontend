import store from "./index";
import flushPromises from "flush-promises";

describe("root store", () => {
  const dispatchSpy = jest.spyOn(store, "dispatch").mockImplementation();
  const defaultState = { ...store.state };

  afterEach(async () => {
    store.replaceState(defaultState);

    await flushPromises();

    jest.resetAllMocks();
  });

  describe("should watch state ranges.params and", () => {
    const params1 = {
      departureTime: "test",
      id: "0",
      origin: "",
      originId: "test",
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

    it("should dispatch a ranges/updateAreas action only when relevant parameters change", async () => {
      store.commit("ranges/updateParams", [...defaultState.ranges.params]);

      await flushPromises();

      expect(dispatchSpy).not.toHaveBeenCalled();

      store.commit("ranges/updateParams", [params1, params2]);

      await flushPromises();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith("ranges/updateAreas", [
        params1,
        params2
      ]);
    });
  });

  describe("should watch state filters.filters and", () => {
    it("should dispatch a ranges/updateAreas action only when relevant parameters change", async () => {
      store.commit("filters/update", [...defaultState.filters.filters]);

      await flushPromises();

      expect(dispatchSpy).toHaveBeenCalledTimes(0);

      const updatedFilters = [...defaultState.filters.filters];

      updatedFilters[0] = { ...updatedFilters[0], selected: true };

      store.commit("filters/update", updatedFilters);

      await flushPromises();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith("pois/update");
    });
  });

  describe("should watch state ranges.areas and", () => {
    it("should dispatch a ranges/updateAreas action only when relevant parameters change", async () => {
      store.commit("ranges/updateAreas", [...defaultState.ranges.areas]);

      await flushPromises();

      expect(dispatchSpy).toHaveBeenCalledTimes(0);

      const updatedAreas = [
        { id: "0", paths: [] },
        { id: "1", paths: [] },
        { id: "union", paths: [] },
        { id: "intersection", paths: [] }
      ];

      store.commit("ranges/updateAreas", updatedAreas);

      await flushPromises();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith("pois/update");
    });
  });
});
