import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { mergeDeepLeft } from "ramda";

import ComponentRangeEdit from "./range-edit.vue";

import fixtureRanges from "../../__fixtures__/ranges";

const localVue = createLocalVue();
localVue.use(Vuex);

const updateParamsSpy = jest.fn();

const store = {
  modules: {
    addresses: {
      namespaced: true,
      state: {
        types: []
      },
      actions: {
        search: jest.fn(),
        geoLocate: jest.fn()
      }
    },
    ranges: {
      namespaced: true,
      actions: {
        updateParams: updateParamsSpy
      }
    },
    transports: {
      namespaced: true,
      state: {
        types: []
      }
    }
  }
};

const createWrapper = options =>
  shallowMount(
    ComponentRangeEdit,
    mergeDeepLeft(options, {
      localVue,
      store: new Vuex.Store(store),
      propsData: {
        rangeParams: fixtureRanges[0]
      }
    })
  );

describe("ComponentRangeEdit", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should update the store params when the origin property changes", () => {
    const wrapper = createWrapper();

    wrapper.vm.$data.origin = {
      typeId: 0,
      address: "different",
      addressId: "different",
      addressLat: 0,
      addressLng: 0
    };

    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
    expect(updateParamsSpy.mock.calls[0][1]).toMatchSnapshot();
  });

  it("should update the store params when the travelTime property changes", () => {
    const wrapper = createWrapper();

    wrapper.setData({
      travelTime: 10
    });

    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
    expect(updateParamsSpy.mock.calls[0][1]).toMatchSnapshot();
  });

  it("should update the store params when the transportType property changes", () => {
    const wrapper = createWrapper();

    wrapper.setData({
      transportTypeValue: "driving"
    });

    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
    expect(updateParamsSpy.mock.calls[0][1]).toMatchSnapshot();
  });
});
