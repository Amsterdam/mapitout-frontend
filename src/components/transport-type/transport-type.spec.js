import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mergeDeepLeft } from "ramda";

import ComponentTransportType from "./transport-type";

import fixtureTransportTypes from "../../__fixtures__/transportTypes";

const localVue = createLocalVue();

const createWrapper = options =>
  shallowMount(
    ComponentTransportType,
    mergeDeepLeft(options, {
      localVue,
      propsData: {
        options: fixtureTransportTypes
      }
    })
  );

describe("ComponentTransportType", () => {
  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value when clicking an option", () => {
    const wrapper = createWrapper();

    wrapper
      .findAll(".option")
      .at(0)
      .trigger("click");

    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toMatchSnapshot();
  });

  it("should not change its value when clicking the selected option", () => {
    const wrapper = createWrapper({
      propsData: {
        value: fixtureTransportTypes[0].value
      }
    });

    wrapper
      .findAll(".option")
      .at(0)
      .trigger("click");

    expect(wrapper.emitted().input).toBeFalsy();
  });
});
