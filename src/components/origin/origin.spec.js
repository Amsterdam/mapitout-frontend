import { shallowMount, createLocalVue } from "@vue/test-utils";

import ComponentOrigin from "./origin.vue";
import { mergeDeepLeft } from "ramda";

const localVue = createLocalVue();

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentOrigin,
    mergeDeepLeft(options, {
      localVue,
      stubs: ["component-address-type", "component-input-address"],
      propsData: {
        value: {
          typeId: 0,
          addressId: "test",
          address: "test",
          addressLat: 0,
          addressLng: 0
        },
        types: [],
        searchAddress: jest.fn(),
        geolocateAddress: jest.fn()
      }
    })
  );

describe("ComponentOrigin", () => {
  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event when the address type changes its value", () => {
    const wrapper = createWrapper();

    wrapper.setData({
      typeId: 2
    });

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toMatchSnapshot();
  });

  it("should emit and input event when the address changes its value", () => {
    const wrapper = createWrapper();

    wrapper.vm.$data.address = {
      id: "different",
      address: "different",
      lat: 5,
      lng: 4
    };

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toMatchSnapshot();
  });
});
