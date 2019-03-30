export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public_transport",
  travelTime: 45
};

export const getters = {
  rangesWithOrigin: state => state.ranges.filter(range => range.originId)
};

export const mutations = {
  add(state) {
    let index = 0;
    let id = `range-${index}`;

    while (state.ranges.find(range => range.id === id)) {
      id = `range-${index++}`;
    }
    state.ranges.push({
      id,
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
      return range;
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
  actions,
  getters
};
