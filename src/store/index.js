import Vue from "vue";
import Vuex from "vuex";

import address from "./modules/address";
import ranges from "./modules/ranges";
import areas from "./modules/areas";

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

export default new Vuex.Store({
  state: {
    error: ""
  },
  modules: {
    address,
    ranges,
    areas
  },
  mutations,
  actions
});
