export const mutations = {
  addRange(state, range) {
    state.ranges.push(range);
  },

  removeRange(state, index) {
    state.ranges.splice(index, 1);
  },

  updateRange(state, { index, range }) {
    state.ranges[index] = range;
  }
};

export const actions = {
  addRange({ commit }) {
    commit("addRange", {
      type: "home",
      origin: null,
      transportType: "public",
      travelTime: 45
    });
  },

  removeRange({ commit }, index) {
    commit("removeRange", index);
  },

  updateRange({ commit }, payload) {
    commit("updateRange", payload);
  }
};

export default {
  namespaced: true,
  state: {
    ranges: [
      {
        type: "home",
        origin: null,
        transportType: "public",
        travelTime: 45
      }
    ]
  },
  mutations,
  actions
};
