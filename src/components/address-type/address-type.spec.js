import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mergeDeepLeft } from "ramda";

import ComponentAddressType from "./address-type.vue";
import fixtureAddressTypes from "../../__fixtures__/addressTypes";

const localVue = createLocalVue();

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentAddressType,
    mergeDeepLeft(options, {
      localVue,
      propsData: {
        options: fixtureAddressTypes
      }
    })
  );

describe("ComponentAddressType", () => {
  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should toggle displaying the options list when clicking the trigger", () => {
    const wrapper = createWrapper();
    const trigger = wrapper.find(".trigger");

    trigger.trigger("click");
    expect(wrapper.find(".dropdown").isVisible()).toBe(true);

    trigger.trigger("click");
    expect(wrapper.contains(".dropdown")).toBe(false);
  });

  it("should not toggle displaying the options list when disabled and clicking the trigger", () => {
    const wrapper = createWrapper({
      propsData: {
        isDisabled: true
      }
    });
    const trigger = wrapper.find(".trigger");

    trigger.trigger("click");
    expect(wrapper.contains(".dropdown")).toBe(false);
  });

  it("should emit an input event and hide the list when clicking on an dropdown option", () => {
    const wrapper = createWrapper();

    wrapper.setData({ isListVisible: true });

    wrapper
      .findAll(".dropdown .option")
      .at(1)
      .trigger("click");

    expect(wrapper.contains(".dropdown")).toBe(false);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toMatchSnapshot();
  });

  it("should emit an input event when selecting an option from the native select element", () => {
    const wrapper = createWrapper();

    wrapper.findAll("select").trigger("change");

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toMatchSnapshot();
  });
});
