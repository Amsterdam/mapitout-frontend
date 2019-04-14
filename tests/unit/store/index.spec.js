import store, { mutations, actions } from "../../../src/store";
import flushPromises from "flush-promises";

describe("root store", () => {
  const dispatchSpy = jest.spyOn(store, "dispatch").mockImplementation();
  const state = {
    error: "",
    route: {
      query: {}
    },
    filters: {
      filters: ["not empty"]
    },
    ranges: {
      ranges: []
    },
    areas: {
      areas: []
    }
  };

  beforeEach(async () => {
    store.replaceState({ ...state });

    await flushPromises();

    jest.resetAllMocks();
  });

  it("should watch for mutations in the ranges module, ranges state and dispatch an area/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      ranges: {
        ranges: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("areas/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      ranges: {
        ranges: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the areas module, areas state and dispatch a locations/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      areas: {
        areas: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("locations/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      areas: {
        areas: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should watch for mutations in the filters module, filters state and dispatch an locations/fetch action only on change", async () => {
    store.replaceState({
      ...state,
      filters: {
        filters: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("locations/fetch");

    dispatchSpy.mockReset();

    store.replaceState({
      ...state,
      filters: {
        filters: [{ id: 1 }]
      }
    });

    await flushPromises();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  describe("mutations", () => {
    describe("error", () => {
      it("should update the state error string", () => {
        const state = { error: "" };
        const errorMessage = "Error bad";

        mutations.error(state, errorMessage);

        expect(state.error).toEqual(errorMessage);
      });
    });
  });

  describe("actions", () => {
    let context;

    beforeEach(() => {
      context = { commit: jest.fn() };
    });

    describe("reportError", () => {
      it("should commit the newly reported error to the state", () => {
        const errorMessage = "test error message";

        actions.reportError(context, new Error(errorMessage));

        expect(context.commit).toHaveBeenCalledWith("error", errorMessage);
      });
    });
  });
});
