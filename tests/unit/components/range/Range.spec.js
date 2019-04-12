import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import Range from "@/components/range/Range.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Range", () => {
  const store = new Vuex.Store({
    modules: {
      origins: {
        namespaced: true,
        state: {
          types: [{ id: 0, value: "wellness", label: "Well" }]
        }
      }
    }
  });
  const range = {
    id: "range-0",
    originType: "home",
    originId: "",
    originAddress: "",
    originLat: null,
    originLng: null,
    transportType: "public_transport",
    travelTime: 45,
    highlightColor: "#ff0000"
  };
  it("should create", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      stubs: ["location-input"],
      propsData: {
        value: range
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the origin property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });

    const origin = {
      typeId: 0,
      address: "different",
      addressId: "different",
      addressLat: 1,
      addressLng: 2
    };

    wrapper.vm.origin = origin;

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        originAddress: origin.address,
        originLat: origin.addressLat,
        originLng: origin.addressLng
      }
    ]);
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });
    const travelTime = 10;

    wrapper.setData({ travelTime });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        travelTime: travelTime,
        departureTime: wrapper.vm.getDepartureTime(new Date()).toISOString()
      }
    ]);
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      store,
      propsData: {
        value: range
      }
    });
    const transportType = "driving";

    wrapper.setData({ transportType });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        transportType: transportType
      }
    ]);
  });

  describe("getDepartureTime", () => {
    it("should return the current day 9AM GMT+1 if the current day is a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        store,
        propsData: {
          value: range
        }
      });

      const date = new Date(2019, 3, 1, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-01T09:00:00.000Z");
    });

    it("should return the next Monday9AM GMT+1 if the current day is not a Monday", () => {
      const wrapper = shallowMount(Range, {
        localVue,
        store,
        propsData: {
          value: range
        }
      });

      const date = new Date(2019, 3, 5, 13, 1, 0, 0);

      const departureTime = wrapper.vm.getDepartureTime(date);

      expect(departureTime.toISOString()).toBe("2019-04-08T09:00:00.000Z");
    });
  });
});
