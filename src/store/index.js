import Vue from "vue";
import Vuex from "vuex";
import qs from "qs";
import { isEqual, omit } from "lodash-es";

import locations from "./modules/locations";
import ranges from "./modules/ranges";
import areas from "./modules/areas";
import filters from "./modules/filters";
import router from "../router";
import origins from "./modules/origins";
import transports from "./modules/transports";

Vue.use(Vuex);

export const mutations = {
  error(state, payload) {
    state.error = payload;
  }
};

export const actions = {
  reportError({ commit }, error) {
    commit("error", error.message);
  }
};

const store = new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    origins,
    locations,
    ranges,
    areas,
    filters,
    transports
  },
  mutations,
  actions
});

store.watch(
  state => state.areas.areas,
  (areas, oldValue) => {
    const filters = store.state.filters.filters.filter(filter => filter.selected);

    if (!isEqual(areas, oldValue) && filters.length > 0) {
      store.dispatch("locations/fetch", { filters, areas });
    }
  }
);

store.watch(
  state => state.filters.filters,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      store.dispatch("locations/fetch", {
        filters: newValue.filter(filter => filter.selected),
        unionArea: store.state.areas.areas.find(area => area.id === "union")
      });
    }
  }
);

store.watch(
  state => state.filters.filters,
  filters => {
    const selectedFilterIds = filters.filter(filter => filter.selected).map(filter => filter.id);

    router.push({
      query: {
        ...router.currentRoute.query,
        filters: selectedFilterIds.length > 0 ? qs.stringify(selectedFilterIds) : undefined
      }
    });
  }
);

store.watch(
  state => state.ranges.ranges,
  (newRanges, oldRanges) => {
    const [newValue, oldValue] = [newRanges, oldRanges].map(ranges =>
      ranges.map(range => omit(range, ["originTypeId"]))
    );

    if (!isEqual(newValue, oldValue)) {
      store.dispatch("areas/fetch", newRanges);
    }
  }
);

export default store;
