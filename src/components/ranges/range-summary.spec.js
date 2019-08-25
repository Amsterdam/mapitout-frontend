import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { mergeDeepLeft } from "ramda";

import ComponentRangeSummary from "./range-summary";

import fixtureRanges from "../../__fixtures__/ranges";

const localVue = createLocalVue();
localVue.use(Vuex);

const removeParamsSpy = jest.fn();
const selectIdSpy = jest.fn();

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentRangeSummary,
    mergeDeepLeft(options, {
      localVue,
      stubs: ["icon-home", "icon-transport-bicycle"],
      propsData: {
        rangeParams: fixtureRanges[0]
      },
      store: new Vuex.Store({
        modules: {
          addresses: {
            namespaced: true,
            getters: {
              getAddressIconComponentByTypeId: () =>
                jest.fn().mockReturnValue("icon-home")
            }
          },
          transports: {
            namespaced: true,
            getters: {
              getTransportTypeIconComponentByValue: () =>
                jest.fn().mockReturnValue("icon-transport-bicycle")
            }
          },
          ranges: {
            namespaced: true,
            actions: {
              removeParams: removeParamsSpy,
              selectId: selectIdSpy
            }
          }
        }
      })
    })
  );

describe("ComponentRangeSummary", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should remove the range from the store when clicking the delete button", async () => {
    const wrapper = createWrapper();

    wrapper.find(".delete").trigger("click");

    expect(removeParamsSpy).toHaveBeenCalledTimes(1);
    expect(removeParamsSpy.mock.calls[0][1]).toMatchSnapshot();
  });

  it("should update the store selected range id when clicking a range summary ", async () => {
    const wrapper = createWrapper();

    wrapper.trigger("click");

    expect(selectIdSpy).toHaveBeenCalledTimes(1);
    expect(selectIdSpy.mock.calls[0][1]).toMatchSnapshot();
  });
});
