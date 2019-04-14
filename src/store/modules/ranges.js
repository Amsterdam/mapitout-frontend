export const mutations = {
  add(state, range) {
    state.ranges.push(range);
  },

  activate(state, id) {
    state.activeId = id;
  },

  replace(state, ranges) {
    state.ranges = ranges;
  }
};

export const actions = {
  add({ commit, state }, range) {
    let id = 0;

    while (state.ranges.find(range => range.id === id)) {
      id++;
    }

    commit("add", { id, ...range });

    return id;
  },

  activate({ commit }, id) {
    commit("activate", id);
  },

  async replace({ commit }, ranges) {
    commit("replace", ranges);
  }
};

export default {
  namespaced: true,
  state: {
    activeId: "",
    ranges: []
  },
  mutations,
  actions
};
