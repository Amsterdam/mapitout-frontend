export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public_transport",
  travelTime: 45
};

let id = 0;

export const mutations = {
  add(state) {
    state.ranges.push({
      id: id++,
      ...DEFAULT_RANGE
    });
  },

  remove(state, id) {
    if (state.ranges.length > 1) {
      state.ranges = state.ranges.filter(range => range.id !== id);
    }
  },

  update(state, updatedRange) {
    state.ranges = state.ranges.map(range => {
      if (range.id === updatedRange.id) {
        return { ...updatedRange };
      }
      return { ...range };
    });
  }
};

export const actions = {
  add({ commit }) {
    commit("add");
  },

  remove({ commit }, id) {
    commit("remove", id);
  },

  update({ commit }, range) {
    commit("update", range);
  }
};

export default {
  namespaced: true,
  state: {
    ranges: []
  },
  mutations,
  actions
};
