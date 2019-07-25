import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import ComponentDetails from "./poi-details";
import flushPromises from "flush-promises";
import { mergeDeepLeft } from "ramda";

const localVue = createLocalVue();
localVue.use(Vuex);

const lookupSpy = jest.fn();
const backSpy = jest.fn();

const store = new Vuex.Store({
  modules: {
    pois: {
      namespaced: true,
      actions: {
        lookup: lookupSpy
      }
    }
  }
});

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentDetails,
    mergeDeepLeft(options, {
      localVue,
      store,
      mocks: {
        $router: {
          back: backSpy
        },
        $route: {
          params: {
            poi: "test"
          }
        }
      }
    })
  );

describe("ComponentDetails", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create", async () => {
    const wrapper = createWrapper();

    await flushPromises();

    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(lookupSpy).toHaveBeenCalledTimes(1);
    expect(lookupSpy.mock.calls[0][1]).toBe("test");
  });

  it("should navigate back when clicking the back button", async () => {
    const wrapper = createWrapper();

    await flushPromises();

    wrapper.find(".back").trigger("click");

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  describe("beforeRouteUpdate", () => {
    it("should call poi/lookup on change of the route poi param", async () => {
      const wrapper = createWrapper();

      await flushPromises();

      const nextSpy = jest.fn();
      const lookupSpy = jest.spyOn(wrapper.vm, "lookupPoi");

      await wrapper.vm.$options.beforeRouteUpdate.call(
        wrapper.vm,
        { params: { poi: "test2" } },
        { params: { poi: "test" } },
        nextSpy
      );

      expect(lookupSpy).toHaveBeenCalledTimes(1);
      expect(lookupSpy).toHaveBeenCalledWith("test2");
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it("should not call poi/lookup on change of the route poi param", async () => {
      const wrapper = createWrapper();

      await flushPromises();

      const nextSpy = jest.fn();
      const lookupSpy = jest.spyOn(wrapper.vm, "lookupPoi");

      await wrapper.vm.$options.beforeRouteUpdate.call(
        wrapper.vm,
        { params: { poi: "test2" } },
        { params: { poi: "test2" } },
        nextSpy
      );

      expect(lookupSpy).not.toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });
});
