import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { mergeDeepLeft } from "ramda";

import ComponentFilters from "./filters";

import fixtureFilters from "../../__fixtures__/filters";

const localVue = createLocalVue();
localVue.use(Vuex);

const updateFiltersSpy = jest.fn();
const setRootFilterSpy = jest.fn();

const defaultStore = {
  modules: {
    filters: {
      namespaced: true,
      mutations: {
        setRootFilter: setRootFilterSpy
      },
      actions: {
        update: updateFiltersSpy
      },
      state: {
        rootFilter: null,
        filters: fixtureFilters
      }
    }
  }
};

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentFilters,
    mergeDeepLeft(options, {
      localVue,
      stubs: ["icon-filters", "component-filter", "component-filter-group"]
    })
  );

describe("ComponentFilters", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper({
      store: new Vuex.Store(defaultStore)
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should correctly process the raw filters", () => {
    const wrapper1 = createWrapper({
      store: new Vuex.Store(defaultStore)
    });

    expect(wrapper1.vm.filtersForRoot).toMatchSnapshot();

    const wrapper2 = createWrapper({
      store: new Vuex.Store(
        mergeDeepLeft(
          {
            modules: {
              filters: {
                state: {
                  rootFilter: fixtureFilters[1]
                }
              }
            }
          },
          defaultStore
        )
      )
    });

    expect(wrapper2.vm.filtersForRoot).toMatchSnapshot();
  });

  it("should not render the back button when rootFilter is set to null", () => {
    const wrapper = createWrapper({
      store: new Vuex.Store(defaultStore)
    });

    expect(wrapper.contains(".back")).toBe(false);
  });

  it("should render the root filters when clicking back", () => {
    const store = mergeDeepLeft(
      {
        modules: {
          filters: {
            state: {
              rootFilter: fixtureFilters[0]
            }
          }
        }
      },
      defaultStore
    );
    const wrapper = createWrapper({
      store: new Vuex.Store(store)
    });
    wrapper.find(".back").trigger("click");

    expect(setRootFilterSpy).toHaveBeenCalledTimes(1);
    expect(setRootFilterSpy.mock.calls[0][1]).toBe(null);
  });
});
