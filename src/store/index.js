import Vue from "vue";
import Vuex from "vuex";
import qs from "qs";
import { isEqual, omit, pick } from "lodash-es";

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
    if (!isEqual(newValue, oldValue) && store.state.areas.areas.length > 0) {
      store.dispatch("locations/fetch", {
        filters: newValue.filter(filter => filter.selected),
        areas: store.state.areas.areas
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
    const newDefinedOrigins = newRanges
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["originTypeId"]));

    const oldDefinedOrigins = oldRanges
      .filter(range => range.originLat && range.originLng)
      .map(range => omit(range, ["originTypeId"]));

    if (!isEqual(newDefinedOrigins, oldDefinedOrigins)) {
      store.dispatch("areas/fetch", newRanges.filter(range => range.originLat && range.originLng));
    }
  }
);

store.watch(
  state => state.ranges.ranges,
  (newRanges, oldRanges) => {
    const [definedRanges, oldDefinedRanges] = [newRanges, oldRanges].map(ranges =>
      ranges
        .filter(range => range.originId)
        .map(range =>
          pick(range, [
            "id",
            "originId",
            "originTypeId",
            "transportTypeId",
            "travelTime",
            "departureTime"
          ])
        )
    );

    const queryString =
      definedRanges.length > 0
        ? qs.stringify(
            definedRanges.map(definedRange => ({
              id: definedRange.id,
              oId: definedRange.originId,
              otId: definedRange.originTypeId,
              ttId: definedRange.transportTypeId,
              tt: definedRange.travelTime,
              t: new Date(definedRange.departureTime).getTime()
            }))
          )
        : undefined;

    if (
      !isEqual(definedRanges, oldDefinedRanges) &&
      queryString !== router.currentRoute.query.ranges
    ) {
      router.push({
        query: {
          ...router.currentRoute.query,
          ranges: queryString
        }
      });
    }
  }
);

export default store;
