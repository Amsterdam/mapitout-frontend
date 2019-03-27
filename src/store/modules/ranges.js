export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public_transport",
  travelTime: 45
};

let id = 0;

export const getters = {
  rangesWithOrigin: state => state.ranges.filter(range => range.originId)
};

export const mutations = {
  addRange(state) {
    state.ranges.push({
      id: id++,
      ...DEFAULT_RANGE
    });
  },

  removeRange(state, index) {
    state.ranges.splice(index, 1);
  },

  updateRange(state, updatedRange) {
    state.ranges = state.ranges.map(range => {
      if (range.id === updatedRange.id) {
        return { ...updatedRange };
      }
      return { ...range };
    });
  }
};

export const actions = {
  addRange({ commit }) {
    commit("addRange");
  },

  removeRange({ commit }, index) {
    commit("removeRange", index);
  },

  updateRange({ commit }, range) {
    commit("updateRange", range);
  }
};

export default {
  namespaced: true,
  state: {
    ranges: []
  },
  mutations,
  actions,
  getters
};
