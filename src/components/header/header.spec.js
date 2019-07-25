import { shallowMount, createLocalVue } from "@vue/test-utils";

import ComponentHeader from "./header.vue";

const localVue = createLocalVue();

const createWrapper = () =>
  shallowMount(ComponentHeader, {
    stubs: ["router-link", "icon-filters"],
    localVue
  });

describe("ComponentHeader", () => {
  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should emit an input event whenever clicking the filters toggle", () => {
    const wrapper = createWrapper();

    wrapper.find(".filters-toggle").trigger("click");

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
