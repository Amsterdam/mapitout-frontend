import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import ComponentFilter from "./filter";

import fixtureFilters from "../../__fixtures__/filters";

const localVue = createLocalVue();
localVue.use(Vuex);

const toggleSpy = jest.fn();
const hasChildrenSpy = jest.fn();
const setRootFilterSpy = jest.fn();

const createWrapper = () =>
  shallowMount(ComponentFilter, {
    localVue,
    propsData: {
      filter: fixtureFilters[0]
    },
    store: new Vuex.Store({
      modules: {
        filters: {
          namespaced: true,
          getters: {
            hasChildren: () => hasChildrenSpy
          },
          actions: {
            toggle: toggleSpy
          },
          mutations: {
            setRootFilter: setRootFilterSpy
          },
          state: {
            filters: fixtureFilters
          }
        }
      }
    })
  });

describe("ComponentFilter", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create", () => {
    const wrapper = createWrapper();

    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it("should set the root filter in the store when clicking the name, if it has children", () => {
    hasChildrenSpy.mockReturnValue(true);

    const wrapper = createWrapper();

    wrapper.find("button.name").trigger("click");

    expect(setRootFilterSpy).toHaveBeenCalledTimes(1);
    expect(setRootFilterSpy.mock.calls[0][1]).toMatchObject(fixtureFilters[0]);
  });

  it("should only display the name, if it doesn't have any children", () => {
    hasChildrenSpy.mockReturnValue(false);

    const wrapper = createWrapper();

    expect(wrapper.contains("span.name")).toBe(true);
  });

  it("should toggle the selected value in the store when clicking the toggle", () => {
    const wrapper = createWrapper();

    wrapper.find(".toggle").trigger("click");

    expect(toggleSpy).toHaveBeenCalledTimes(1);
    expect(toggleSpy.mock.calls[0][1]).toMatchSnapshot();
  });
});
