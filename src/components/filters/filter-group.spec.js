import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mergeDeepLeft } from "ramda";

import ComponentFilterGroup from "./filter-group";

import fixtureFilters from "../../__fixtures__/filters";

const localVue = createLocalVue();

const iconComponent = "test";
const fixtureFilterGroup = {
  name: "test",
  iconComponent,
  children: [fixtureFilters[2], fixtureFilters[3]]
};

const createWrapper = (options = {}) =>
  shallowMount(
    ComponentFilterGroup,
    mergeDeepLeft(options, {
      localVue,
      stubs: ["component-filter", iconComponent],
      propsData: {
        group: fixtureFilterGroup
      }
    })
  );

describe("ComponentFilterGroup", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should toggle expand when clicking the toggle expand button", () => {
    const wrapper = createWrapper();

    wrapper.find(".toggle-expand").trigger("click");

    expect(wrapper.contains(".group")).toBe(true);

    wrapper.find(".toggle-expand").trigger("click");

    expect(wrapper.contains(".group")).toBe(false);
  });
});
