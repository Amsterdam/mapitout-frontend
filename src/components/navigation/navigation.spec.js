import { shallowMount, createLocalVue } from "@vue/test-utils";

import ComponentNavigation from "./navigation.vue";

const localVue = createLocalVue();

describe("ComponentNavigation", () => {
  it("should create", () => {
    const wrapper = shallowMount(ComponentNavigation, {
      localVue,
      stubs: ["router-link"]
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
