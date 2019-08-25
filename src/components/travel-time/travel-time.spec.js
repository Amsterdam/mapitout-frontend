import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mergeDeepLeft } from "ramda";

import ComponentTravelTime from "./travel-time";

const localVue = createLocalVue();

const createWrapper = options =>
  shallowMount(
    ComponentTravelTime,
    mergeDeepLeft(options, {
      localVue
    })
  );

describe("ComponentTravelTime", () => {
  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should change its value whenever clicking on the rail", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    wrapper.find(".rail").trigger("click", { offsetX: 100 });

    expect(wrapper.emitted("input")).toBeTruthy();
  });

  it("should correctly update its data object whenever the panstart event is triggered", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    wrapper.vm.onHandlePanStart();

    expect(wrapper.vm.initialOffset).toBeDefined();
    expect(wrapper.vm.minOffset).toBeDefined();
    expect(wrapper.vm.maxOffset).toBeDefined();
  });

  it("should update the handle style if the newOffset is within bounds", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = 80;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe(
      `${deltaX + initialOffset}px`
    );
  });

  it("should should not allow sliding beyond the maxValue", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = 180;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe("150px");
  });

  it("should should not allow sliding beyond the minValue", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    const initialOffset = 50;
    const deltaX = -180;

    wrapper.setData({ minOffset: -6, maxOffset: 150, initialOffset });

    wrapper.vm.onHandlePan({ deltaX });

    expect(wrapper.find(".handle").element.style.left).toBe("-6px");
  });

  it("should update its value on pan end", () => {
    const wrapper = createWrapper({
      attachToDocument: true
    });

    wrapper.vm.onHandlePanEnd();

    expect(wrapper.emitted("input")).toBeTruthy();
  });
});
