import { shallowMount, createLocalVue } from "@vue/test-utils";

import TransportType from "@/components/input/TransportType.vue";

const localVue = createLocalVue();

describe("TransportType", () => {
  it("should create", () => {
    const wrapper = shallowMount(TransportType, {
      localVue,
      propsData: {
        options: []
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value upon clicking an option", () => {
    const wrapper = shallowMount(TransportType, {
      localVue,
      propsData: {
        options: [{ id: 0, value: "walking", label: "Walking", icon: "icon-transport-pedestrian" }]
      },
      data() {
        return {
          isListVisible: true,
          attachToDocument: true
        };
      }
    });

    wrapper
      .findAll("button.option")
      .at(0)
      .trigger("click");

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
