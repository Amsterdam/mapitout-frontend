import { shallowMount, createLocalVue } from "@vue/test-utils";

import LocationInput from "@/components/input/LocationInput.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LocationInput", () => {
  const propsData = {
    types: [],
    lookupAddress: jest.fn(),
    resolveAddressId: jest.fn()
  };

  it("should create", () => {
    const wrapper = shallowMount(LocationInput, {
      localVue,
      propsData
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever the typeId changes ", () => {
    const wrapper = shallowMount(LocationInput, {
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
    const wrapper = shallowMount(LocationInput, {
      localVue,
      propsData
    });
    const address = {
      id: "different",
      label: "different",
      value: { lat: 2, lng: 3 }
    };

    wrapper.vm.address = address;

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([
      {
        ...wrapper.vm.value,
        addressId: address.id,
        address: address.label,
        addressLat: address.value.lat,
        addressLng: address.value.lng
      }
    ]);
  });

  describe("resolveSelection", () => {
    it("should return a resolved object whenever the resolver provides it one", async () => {
      const wrapper = shallowMount(LocationInput, {
        localVue,
        propsData
      });

      const resolved = {
        id: "different",
        address: "different",
        lat: 2,
        lng: 3
      };

      propsData.resolveAddressId.mockResolvedValue(resolved);

      const result = await wrapper.vm.resolveSelection();

      expect(result).toEqual({
        id: resolved.id,
        label: resolved.address,
        value: {
          lat: resolved.lat,
          lng: resolved.lng
        }
      });
    });

    it("should return an empty resolved object whenever the resolver fails to provide it one", async () => {
      const wrapper = shallowMount(LocationInput, {
        localVue,
        propsData
      });

      propsData.resolveAddressId.mockResolvedValue(null);

      const result = await wrapper.vm.resolveSelection();

      expect(result).toEqual({
        id: undefined,
        label: "",
        value: null
      });
    });
  });
});
