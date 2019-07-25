import Vue from "vue";
import Vuex from "vuex";
import { isEqual, omit } from "lodash-es";

import errors from "./modules/errors";
import pois from "./modules/pois";
import ranges from "./modules/ranges";
import filters from "./modules/filters";
import addresses from "./modules/addresses";
import transports from "./modules/transports";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    addresses,
    pois,
    ranges,
    filters,
    transports,
    errors
  }
});

store.watch(
  state => state.ranges.params,
  (newRangeParams, oldRangeParams) => {
    /**
     * Only trigger an areas update action if relevant params have changed.
     * Range parameters that do not affect area values are:
     * - originTypeId
     */
    const [newValue, oldValue] = [newRangeParams, oldRangeParams].map(
      rangesParams =>
        rangesParams
          .filter(rangeParams => rangeParams.originId.length)
          .map(rangeParams => omit(rangeParams, ["originTypeId"]))
    );

    if (!isEqual(newValue, oldValue)) {
      store.dispatch("ranges/updateAreas", newRangeParams);
    }
  }
);

store.watch(
  state => state.ranges.areas,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      store.dispatch("pois/update");
    }
  }
);

store.watch(
  state => state.filters.filters,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      store.dispatch("pois/update");
    }
  }
);

export default store;
