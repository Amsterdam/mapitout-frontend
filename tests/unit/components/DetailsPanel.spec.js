import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Router from "vue-router";

import DetailsPanel from "@/components/DetailsPanel.vue";
import flushPromises from "flush-promises";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Router);

describe("DetailsPanel", () => {
  const lookupSpy = jest.fn();
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
  const router = new Router({
    mode: "history",
    base: "localhost",
    routes: [
      {
        path: "/",
        name: "home",
        component: { template: "<div></div>" }
      },
      {
        path: "/details/:poi",
        name: "details",
        component: DetailsPanel
      }
    ]
  });

  it("should create", async () => {
    const wrapper = shallowMount(DetailsPanel, {
      localVue,
      store,
      router
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should navigate back when clicking the back button", () => {
    const wrapper = shallowMount(DetailsPanel, {
      localVue,
      store,
      router
    });
    const backSpy = jest.spyOn(router, "back");

    wrapper.find(".back").trigger("click");

    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  // todo figure out how to test this
  xdescribe("beforeRouteEnter", () => {
    it("should call poi/lookup with the route poi param", async () => {
      mount(
        {
          template: "<div><router-view /></div>"
        },
        {
          localVue,
          store,
          router
        }
      );

      router.push({ name: "details", params: { poi: "test" } });

      await flushPromises();

      expect(lookupSpy).toHaveBeenCalledTimes(1);
      expect(lookupSpy).toHaveBeenCalledWith("test");
    });
  });

  // todo figure out how to test this
  xdescribe("beforeRouteUpdate", () => {
    it("should call poi/lookup on change of the route poi param", async () => {
      mount(
        {
          template: "<div><router-view /></div>"
        },
        {
          localVue,
          store,
          router
        }
      );

      router.push({ name: "details", params: { poi: "test" } });
      await flushPromises();
      lookupSpy.mockReset();

      router.push({ name: "details", params: { poi: "test2" } });
      await flushPromises();
      expect(lookupSpy).toHaveBeenCalledTimes(1);
      expect(lookupSpy).toHaveBeenCalledWith("test2");
    });

    it("should not call poi/lookup on change of the route poi param", async () => {
      mount(
        {
          template: "<div><router-view /></div>"
        },
        {
          localVue,
          store,
          router
        }
      );

      router.push({ name: "details", params: { poi: "test" } });
      await flushPromises();
      lookupSpy.mockReset();

      router.push({ name: "details", params: { poi: "test" } });
      await flushPromises();
      expect(lookupSpy).not.toHaveBeenCalled();
    });
  });
});
