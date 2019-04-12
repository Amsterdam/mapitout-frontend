import { shallowMount, createLocalVue } from "@vue/test-utils";

import Location from "@/components/input/Location.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Location", () => {
  const propsData = {
    types: [],
    lookupAddress: jest.fn(),
    resolveAddressId: jest.fn()
  };

  it("should create", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the typeId changes ", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });

    wrapper.setData({
      typeId: 1
    });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([{ ...wrapper.vm.value, typeId: 1 }]);
  });

  it("should emit and input event whenever the address changes ", () => {
    const wrapper = shallowMount(Location, {
      localVue,
      propsData
    });
    const address = {
      id: "different",
      address: "different",
      lat: 2,
      lng: 3
    };

    wrapper.vm.address = address;

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        addressId: address.id,
        address: address.address,
        addressLat: address.lat,
        addressLng: address.lng
      }
    ]);
  });
});
