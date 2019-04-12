import { shallowMount, createLocalVue } from "@vue/test-utils";

import EnhancedSelect from "@/components/input/EnhancedSelect.vue";

const localVue = createLocalVue();

describe("EnhancedSelect", () => {
  const options = [
    { id: 0, value: "value 1", label: "label 1" },
    { id: 1, value: "value 2", label: "label 2" }
  ];

  it("should create", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should display the list upon clicking the trigger", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options
      }
    });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeTruthy();
  });

  it("should skip displaying the list upon clicking the trigger when the component is disabled", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options,
        isDisabled: true
      }
    });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
  });

  it("should hide the list upon clicking the trigger a second time", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options
      }
    });

    wrapper.setData({ isListVisible: true });

    wrapper.find("button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
  });

  it("should hide the list and emit an input event whenever clicking on an enhanced list element button", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options
      }
    });

    wrapper.setData({ isListVisible: true });

    wrapper.find("ul li button").trigger("click");

    expect(wrapper.vm.isListVisible).toBeFalsy();
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([0]);
  });

  it("should emit and input event whenever selecting an option from the native select element", () => {
    const wrapper = shallowMount(EnhancedSelect, {
      localVue,
      propsData: {
        options
      }
    });

    wrapper.findAll("select").trigger("change");

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([0]);
  });
});
