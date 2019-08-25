import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { mergeDeepLeft } from "ramda";

import ComponentRanges from "./ranges.vue";

import fixtureRanges from "../../__fixtures__/ranges";

const localVue = createLocalVue();
localVue.use(Vuex);

const addRangeParamsSpy = jest.fn();

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentRanges,
    mergeDeepLeft(options, {
      localVue,
      stubs: ["component-range-item", "component-range-summary"],
      store: new Vuex.Store({
        modules: {
          ranges: {
            namespaced: true,
            actions: {
              addParams: addRangeParamsSpy
            },
            state: {
              params: fixtureRanges,
              selectedId: "0"
            }
          }
        }
      })
    })
  );

describe("ComponentRanges", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should add a range and update the store selected range when clicking on the add button", async () => {
    const wrapper = createWrapper();

    wrapper.find(".add").trigger("click");

    addRangeParamsSpy.mockReturnValue("2");

    expect(addRangeParamsSpy).toHaveBeenCalledTimes(1);
  });
});
