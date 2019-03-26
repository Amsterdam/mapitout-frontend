export const DEFAULT_RANGE = {
  originType: "home",
  originId: undefined,
  originAddress: "",
  originCoordinates: undefined,
  transportType: "public",
  travelTime: 45,
  area: undefined
};

export const getters = {
  unresolvedRanges: state =>
    state.ranges
      .filter(range => range.originId && !range.area)
      .map(({ originId, travelTime, transportType }) => ({ originId, travelTime, transportType }))
};

export const mutations = {
  addRange(state, range) {
    state.ranges.push(range);
  },

  removeRange(state, index) {
    state.ranges.splice(index, 1);
  },

  updateRange(state, { index, range }) {
    const oldValue = state.ranges[index];
    console.log(range.transportType, oldValue.transportType);
    if (
      oldValue.originId !== range.originId ||
      oldValue.travelTime !== range.travelTime ||
      oldValue.transportType !== range.transportType
    ) {
      state.ranges[index] = { ...DEFAULT_RANGE, ...range };
    } else {
      state.ranges[index] = { ...oldValue, ...range };
    }
  }
};

export const actions = {
  addRange({ commit }) {
    commit("addRange", { ...DEFAULT_RANGE });
  },

  removeRange({ commit }, index) {
    commit("removeRange", index);
  },

  updateRange({ commit }, payload) {
    commit("updateRange", payload);
  },

  fetchAreas() {
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
    ranges: [{ ...DEFAULT_RANGE }]
  },
  mutations,
  actions,
  getters
};
