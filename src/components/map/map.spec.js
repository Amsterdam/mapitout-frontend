import { shallowMount, createLocalVue } from "@vue/test-utils";
import flushPromises from "flush-promises";
import Vuex from "vuex";

import ComponentMap from "./map";

jest.mock("google-maps-api-loader", () => jest.fn());

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ComponentMap", () => {
  const activateRangeSpy = jest.fn();
  const genericErrorSpy = jest.fn();
  const getPoiIconByPoiTypeIdSpy = jest.fn();
  const getOriginIconByOriginTypeIdSpy = jest.fn();
  const getOriginHighlightColorByOriginTypeIdSpy = jest.fn();
  const store = new Vuex.Store({
    modules: {
      pois: {
        namespaced: true,
        getters: {
          getPoiIconByPoiTypeId: getPoiIconByPoiTypeIdSpy
        },
        state: {
          pois: []
        }
      },
      origins: {
        namespaced: true,
        getters: {
          getOriginIconByOriginTypeId: getOriginIconByOriginTypeIdSpy,
          getOriginHighlightColorByOriginTypeId: getOriginHighlightColorByOriginTypeIdSpy
        }
      },
      ranges: {
        namespaced: true,
        state: {
          activeId: undefined,
          ranges: []
        },
        actions: {
          activate: activateRangeSpy
        }
      },
      areas: {
        namespaced: true,
        state: {
          areas: [],
          mapBoundaries: {}
        }
      },
      errors: {
        namespaced: true,
        actions: {
          generic: genericErrorSpy
        }
      }
    }
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", async () => {
    const GoogleMapsApiLoader = require("google-maps-api-loader");

    const wrapper = shallowMount(ComponentMap, {
      localVue,
      store
    });

    await flushPromises();

    expect(wrapper.isVueInstance()).toBeTruthy();

    expect(GoogleMapsApiLoader).toHaveBeenCalledWith({
      apiKey: process.env.VUE_APP_GOOGLE_API_KEY
    });
  });

  xit("should redirect to the error page on a failed Google Maps API load", async () => {
    const GoogleMapsApiLoader = require("google-maps-api-loader");

    GoogleMapsApiLoader.mockRejectedValue(new Error("Boom"));

    shallowMount(ComponentMap, {
      localVue,
      store
    });

    await flushPromises();

    expect(genericErrorSpy).toHaveBeenCalled();
  });

  xit("should create a Google Maps instance on successful API load ", async () => {
    const Map = jest.fn();
    const GoogleMapsApiLoader = require("google-maps-api-loader");
    GoogleMapsApiLoader.mockResolvedValue({
      maps: {
        Map
      }
    });

    shallowMount(ComponentMap, {
      localVue,
      store
    });

    await flushPromises();

    expect(Map).toHaveBeenCalled();
  });

  xit("should draw the map and origins on init if any are defined in state", async () => {
    const Map = jest.fn();
    const GoogleMapsApiLoader = require("google-maps-api-loader");
    GoogleMapsApiLoader.mockResolvedValue({
      maps: {
        Map
      }
    });

    const wrapper = shallowMount(ComponentMap, {
      localVue,
      store
    });

    const drawOriginsSpy = jest.spyOn(wrapper.vm, "drawOriginMarkers");
    const drawCoverageSpy = jest.spyOn(wrapper.vm, "drawCoverage");

    await flushPromises();

    expect(drawOriginsSpy).toHaveBeenCalled();
    expect(drawCoverageSpy).toHaveBeenCalled();
  });
});
