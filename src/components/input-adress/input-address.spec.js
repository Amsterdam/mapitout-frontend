import { shallowMount, createLocalVue } from "@vue/test-utils";
import { mergeDeepLeft } from "ramda";
import * as sinon from "sinon";
import flushPromises from "flush-promises";

import InputAddress from "./input-address.vue";
import fixtureSuggestions from "../../__fixtures__/addressSuggestions";
import fixtureResolved from "../../__fixtures__/addressResolved";

const localVue = createLocalVue();

const searchSpy = jest.fn();
const resolveSpy = jest.fn();

const createWrapper = (options = {}) =>
  shallowMount(
    InputAddress,
    mergeDeepLeft(options, {
      localVue,
      propsData: {
        search: searchSpy,
        resolve: resolveSpy
      }
    })
  );

describe("InputAddress", () => {
  let timers;

  beforeAll(() => {
    timers = sinon.useFakeTimers();
  });

  afterAll(() => {
    timers.restore();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe("when caching suggestions", () => {
    it("should display the suggestions list when focusing the input", () => {
      const wrapper = createWrapper();

      wrapper.setData({
        suggestions: fixtureSuggestions
      });

      wrapper.find("input").trigger("focus");

      expect(wrapper.find(".dropdown").isVisible()).toBe(true);
      expect(wrapper.vm.cursorIndex).toBe(0);
    });

    it("should hide the suggestions list when blurring the input", () => {
      const wrapper = createWrapper();

      wrapper.setData({
        areSuggestionsVisible: true,
        suggestions: fixtureSuggestions
      });

      wrapper.find("input").trigger("blur");

      expect(wrapper.contains(".dropdown")).toBe(false);
    });
  });

  it("should display the suggestions when typing in a query that returns results", async () => {
    const wrapper = createWrapper();

    searchSpy.mockResolvedValue(fixtureSuggestions);

    const input = wrapper.find("input");

    input.setValue("test-1");
    input.setValue("test-12");
    input.setValue("test-123");

    timers.runAll();

    await flushPromises();

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledWith("test-123");

    expect(wrapper.find(".dropdown").isVisible()).toBe(true);
    expect(wrapper.vm.cursorIndex).toBe(0);
  });

  it("should hide the suggestions when typing in a query that returns no results", async () => {
    const wrapper = createWrapper();

    wrapper.setData({
      suggestions: fixtureSuggestions
    });

    searchSpy.mockResolvedValue([]);

    const input = wrapper.find("input");

    input.setValue("test-1");

    timers.runAll();

    await flushPromises();

    expect(wrapper.contains(".dropdown")).toBe(false);
  });

  it("should hide the suggestions list when inputting less than 3 characters", async () => {
    const wrapper = createWrapper();

    wrapper.setData({
      suggestions: fixtureSuggestions
    });

    const input = wrapper.find("input");

    input.setValue("tt");

    timers.runAll();

    await flushPromises();

    expect(searchSpy).toHaveBeenCalledTimes(0);
    expect(wrapper.contains(".dropdown")).toBe(false);
  });

  describe("when clicking on a suggestion", () => {
    it("should select the clicked suggestion and hide the suggestions", () => {
      const wrapper = createWrapper();

      wrapper.setData({
        areSuggestionsVisible: true,
        suggestions: fixtureSuggestions
      });

      const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

      wrapper
        .findAll(".option")
        .at(0)
        .trigger("click");

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy).toHaveBeenCalledWith(fixtureSuggestions[0].id);
      expect(wrapper.contains(".dropdown")).toBe(false);
    });
  });

  describe("when pressing enter", () => {
    it("should hide the suggestions and select the highlighted item, if suggestions are visible", () => {
      const wrapper = createWrapper();

      const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

      wrapper.setData({
        cursorIndex: 1,
        areSuggestionsVisible: true,
        suggestions: fixtureSuggestions
      });

      wrapper.find("input").trigger("keydown", {
        key: "Enter"
      });

      expect(wrapper.contains(".dropdown")).toBe(false);
      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy).toHaveBeenCalledWith(fixtureSuggestions[1].id);
    });

    it("should select an empty value if the current value address is different to the input value", () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureSuggestions[0]
        }
      });

      const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

      wrapper.setData({
        query: `${fixtureSuggestions[0]} different`,
        areSuggestionsVisible: false
      });

      wrapper.find("input").trigger("keydown", {
        key: "Enter"
      });

      expect(selectSpy).toHaveBeenCalledTimes(1);
      expect(selectSpy).toHaveBeenCalledWith();
    });

    it("should not select if the current value address is equal to the input value", () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureSuggestions[0]
        }
      });

      const selectSpy = jest.spyOn(wrapper.vm, "select").mockImplementation();

      wrapper.setData({
        query: fixtureSuggestions[0].address,
        areSuggestionsVisible: false
      });

      wrapper.find("input").trigger("keydown", {
        key: "Enter"
      });

      expect(selectSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("when selecting a suggestion id", () => {
    it("should not emit an input event when the selected suggestions id is equal to the value id", async () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureSuggestions[0]
        }
      });

      await wrapper.vm.select(fixtureSuggestions[0].id);

      expect(wrapper.emitted().input).toBeFalsy();
    });

    it("should emit an input event when the selected suggestion id is blank", async () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureSuggestions[0]
        }
      });

      await wrapper.vm.select();

      expect(wrapper.emitted().input.length).toBe(1);
      expect(wrapper.emitted().input[0]).toMatchSnapshot();
    });

    it("should emit an input event and set input value when resolving a suggestion", async () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureSuggestions[1]
        }
      });

      resolveSpy.mockResolvedValue(fixtureResolved);

      await wrapper.vm.select("test");

      expect(wrapper.emitted().input.length).toBe(1);
      expect(wrapper.emitted().input[0]).toMatchSnapshot();
      expect(wrapper.vm.query).toBe(fixtureResolved.address);
    });

    it("should emit an input event when failing to resolve a suggestion", async () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureResolved
        }
      });

      resolveSpy.mockResolvedValue({
        id: "",
        address: "",
        lat: 0,
        lng: 0
      });

      await wrapper.vm.select("test");

      expect(wrapper.emitted().input.length).toBe(1);
      expect(wrapper.emitted().input[0]).toMatchSnapshot();
    });

    it("should not emit an input event when the resolved value is equal to the set value", async () => {
      const wrapper = createWrapper({
        propsData: {
          value: fixtureResolved
        }
      });

      resolveSpy.mockResolvedValue(fixtureResolved);

      await wrapper.vm.select("test");

      expect(wrapper.emitted().input).toBeFalsy();
    });
  });
});
