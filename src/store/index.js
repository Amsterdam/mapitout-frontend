import Vue from "vue";
import Vuex from "vuex";
import { isEqual, omit } from "lodash-es";

import locations from "./modules/locations";
import ranges from "./modules/ranges";
import areas from "./modules/areas";
import filters from "./modules/filters";
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
  (newAreas, oldAreas) => {
    if (!isEqual(newAreas, oldAreas)) {
      store.dispatch("locations/fetch");
    }
  }
);

store.watch(
  state => state.filters.filters,
  (newFilters, oldFilters) => {
    if (!isEqual(newFilters, oldFilters)) {
      store.dispatch("locations/fetch");
    }
  }
);

store.watch(
  state => state.ranges.ranges,
  (newRanges, oldRanges) => {
    const [newValue, oldValue] = [newRanges, oldRanges].map(ranges =>
      ranges.map(range => omit(range, ["originTypeId"]))
    );

    if (!isEqual(newValue, oldValue)) {
      store.dispatch("areas/fetch");
    }
  }
);

export default store;
