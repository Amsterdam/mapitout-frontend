export const mutations = {
  add(state, range) {
    state.ranges.push(range);
  },

  update(state, updatedRange) {
    state.ranges = state.ranges.map(range => {
      if (range.id === updatedRange.id) {
        return updatedRange;
      }

      return range;
    });
  },

  remove(state, id) {
    if (state.ranges.length > 1) {
      state.ranges = state.ranges.filter(range => range.id !== id);
    }
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

  update({ commit }, range) {
    commit("update", range);
  },

  remove({ commit }, id) {
    commit("remove", id);
  },

  activate({ commit }, id) {
    commit("activate", id);
  },

  async replace({ dispatch, commit }, unresolvedRanges) {
    const resolvedOrigins = await Promise.all(
      unresolvedRanges.map(range =>
        dispatch("origins/resolveAddressId", range.originId, { root: true })
      )
    );

    const ranges = unresolvedRanges.map(range => {
      const origin = resolvedOrigins.find(origin => origin.id === range.originId);

      if (origin) {
        return {
          ...range,
          originLat: origin.lat,
          originLng: origin.lng,
          originAddress: origin.address
        };
      }

      return null;
    });

    commit("replace", ranges.filter(range => range));
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
