export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public",
  travelTime: 45
};

let id = 0;

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
  },

  fetchAreasWithIntersection() {
    const departureTime = new Date();
    departureTime.setUTCDate(
      departureTime.getUTCDate() + ((1 + 7 - departureTime.getUTCDay()) % 7)
    );
    departureTime.setUTCHours(9, 0, 0, 0);

    console.log(departureTime);
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
