import { shallowMount, createLocalVue } from "@vue/test-utils";

import Ranges from "@/components/Ranges.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Ranges", () => {
  let $store;

  beforeEach(() => {
    $store = new Vuex.Store({
      modules: {
        ranges: {
          namespaced: true,
          state: {
            ranges: [
              {
                id: "0",
                originType: "home",
                originId: undefined,
                originAddress: "",
                originCoordinates: undefined,
                transportType: "public_transport",
                travelTime: 45
              }
            ]
          },
          actions: {
            add: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
          }
        }
      }
    });
  });

  it("should create", () => {
    const wrapper = shallowMount(Ranges, {
      localVue,
      mocks: {
        $store
      }
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
