import { shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Vuex from "vuex";
import { mergeDeepLeft } from "ramda";

import ComponentMap from "./map";

import * as googleMapsModule from "../../api/googleMaps";

jest.mock("google-maps-api-loader", () => jest.fn());

const localVue = createLocalVue();
localVue.use(Vuex);

const getAddressIconByTypeIdSpy = jest.fn();
const getAddressHighlightColorByTypeIdSpy = jest.fn();
const genericErrorActionSpy = jest.fn();
const selectRangeIdSpy = jest.fn();

jest.spyOn(googleMapsModule, "createMap").mockImplementation();

const store = {
  modules: {
    addresses: {
      namespaced: true,
      getters: {
        getAddressIconByTypeId: getAddressIconByTypeIdSpy,
        getAddressHighlightColorByTypeId: getAddressHighlightColorByTypeIdSpy
      }
    },
    errors: {
      namespaced: true,
      actions: {
        generic: genericErrorActionSpy
      }
    },
    ranges: {
      namespaced: true,
      state: {
        areas: [],
        params: [],
        selectedId: null
      },
      actions: {
        selectId: selectRangeIdSpy
      }
    },
    pois: {
      namespaced: true,
      state: {
        pois: []
      }
    }
  }
};

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentMap,
    mergeDeepLeft(options, {
      localVue,
      store: new Vuex.Store(store)
    })
  );

describe("ComponentMap", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", async () => {
    const GoogleMapsApiLoader = require("google-maps-api-loader");

    const wrapper = createWrapper();

    await flushPromises();

    expect(wrapper.isVueInstance()).toBeTruthy();

    expect(GoogleMapsApiLoader).toHaveBeenCalledTimes(1);
  });
});
