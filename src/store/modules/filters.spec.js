import { getters, mutations, actions } from "./filters";

import fixtureFilters from "../../__fixtures__/filters";
import fixtureFiltersWithSelectedTypes from "../../__fixtures__/filtersWithSelectedTypes";
import fixtureFiltersWithSelectedSubTypes from "../../__fixtures__/filtersWithSelectedSubTypes";

describe("filters store module", () => {
  describe("getters", () => {
    describe("selectedTypes", () => {
      it("should return the selected type value array when filters has selected types", () => {
        const result = getters.selectedTypes({
          filters: fixtureFiltersWithSelectedTypes
        });

        expect(result).toMatchSnapshot();
      });

      it("should return an empty array when filters has no selected types", () => {
        const filtersWithNoSelectedTypes = fixtureFilters;

        const result = getters.selectedTypes({
          filters: filtersWithNoSelectedTypes
        });

        expect(result).toMatchObject([]);
      });
    });

    describe("selectedSubTypes", () => {
      it("should return the selected sub-type value array when filters has selected sub-types", () => {
        const filtersWithSubSelectedTypes = fixtureFiltersWithSelectedSubTypes;

        const result = getters.selectedSubTypes({
          filters: filtersWithSubSelectedTypes
        });

        expect(result).toMatchSnapshot();
      });

      it("should return an empty array when filters has no selected sub-types", () => {
        const filtersWithNoSelectedSubTypes = fixtureFilters;

        const result = getters.selectedSubTypes({
          filters: filtersWithNoSelectedSubTypes
        });

        expect(result).toMatchObject([]);
      });
    });

    describe("hasChildren", () => {
      it("should return true for a filter that has children", () => {
        const result = getters.hasChildren({ filters: fixtureFilters })(2);

        expect(result).toBe(true);
      });

      it("should return false for a filter that has no children", () => {
        const result = getters.hasChildren({ filters: fixtureFilters })(3);

        expect(result).toBe(false);
      });
    });
  });

  describe("mutations", () => {
    describe("update", () => {
      it("should update the state filters with the passed value", () => {
        const state = {
          filters: fixtureFilters
        };

        mutations.update(state, fixtureFiltersWithSelectedTypes);

        expect(state.filters).toMatchObject(fixtureFiltersWithSelectedTypes);
      });
    });

    describe("setRootFilter", () => {
      it("should set the state root filter to the value passed", () => {
        const state = {
          rootFilter: null
        };

        mutations.setRootFilter(state, fixtureFilters[1]);

        expect(state.rootFilter).toMatchObject(fixtureFilters[1]);
      });
    });
  });

  describe("actions", () => {
    const context = {
      commit: jest.fn(),
      dispatch: jest.fn(),
      state: {
        filters: fixtureFilters
      }
    };

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("update", () => {
      it("should commit an update mutation with the passed value", () => {
        actions.update(context, fixtureFiltersWithSelectedTypes);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith(
          "update",
          fixtureFiltersWithSelectedTypes
        );
      });

      it("should not commit an update mutation when the passed value is identical to the state value", () => {
        actions.update(context, fixtureFilters);

        expect(context.commit).toHaveBeenCalledTimes(0);
      });
    });

    describe("toggle", () => {
      it("should dispatch an update action with the updated filters", () => {
        actions.toggle(context, fixtureFilters[1]);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("update");
        expect(context.dispatch.mock.calls[0][1]).toMatchSnapshot();
      });
    });
  });
});
