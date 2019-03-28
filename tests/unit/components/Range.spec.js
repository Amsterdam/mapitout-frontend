import { shallowMount, createLocalVue } from "@vue/test-utils";

import Range from "@/components/Range.vue";

const localVue = createLocalVue();

describe("Range", () => {
  it("should create", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit a click event whenever clicked", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: { isActive: false }
    });

    wrapper.trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
  });

  // todo this test does not work ofr unknown reasons. It seems that calling setData with a object property does not trigger the watch in tests
  xit("should emit an input event whenever the origin property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue,
      propsData: {
        value: {
          originType: "home",
          originId: "initial",
          originAddress: "initial",
          originCoordinates: null
        }
      }
    });

    wrapper.setData({
      origin: {
        type: "work",
        addressId: "different",
        address: "different",
        coordinates: { lat: 1, lng: 2 }
      }
    });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the travelTime property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    wrapper.setData({ travelTime: 10 });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should emit an input event whenever the transportType property changes", () => {
    const wrapper = shallowMount(Range, {
      localVue
    });

    wrapper.setData({ transportType: "driving" });

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
