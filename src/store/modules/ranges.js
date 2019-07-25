import { isEqual } from "lodash-es";
import { fetchAreas } from "../../api/travelTime";

const defaultRangeParams = {
  origin: "",
  originId: "",
  originLat: 0,
  originLng: 0,
  originTypeId: 0,
  travelTime: 45,
  transportTypeValue: "cycling"
};

export const getters = {
  unionArea: state => state.areas.find(area => area.id === "union")
};

export const mutations = {
  selectId(state, id) {
    state.selectedId = id;
  },

  updateParams(state, params) {
    state.params = params;
  },

  updateAreas(state, areas) {
    state.areas = areas;
  }
};

export const actions = {
  addParams({ dispatch, state }, params = {}) {
    let id = 0;

    while (state.params.find(params => params.id === String(id))) {
      id++;
    }

    const newParams = {
      ...defaultRangeParams,
      ...params,
      id: String(id)
    };

    dispatch("updateAllParams", state.params.concat([{ ...newParams }]));

    return newParams;
  },

  removeParams({ dispatch, state }, id) {
    if (state.params.find(params => params.id === id)) {
      dispatch(
        "updateAllParams",
        state.params.filter(params => params.id !== id)
      );
    }
  },

  updateParams({ dispatch, state }, params) {
    dispatch(
      "updateAllParams",
      state.params.map(rangeParams =>
        rangeParams.id === params.id ? params : rangeParams
      )
    );
  },

  updateAllParams({ commit, state }, paramsList) {
    if (!isEqual(paramsList, state.params)) {
      commit("updateParams", paramsList);
    }
  },

  async updateAreas({ dispatch, commit }, rangesParams) {
    const rangeParamsWithDefinedOriginId = rangesParams.filter(
      rangeParams => rangeParams.originId
    );

    if (rangeParamsWithDefinedOriginId.length > 0) {
      try {
        const areas = await fetchAreas(rangeParamsWithDefinedOriginId);

        commit("updateAreas", areas);
      } catch (error) {
        commit("updateAreas", []);

        dispatch("errors/network", error, { root: true });
      }
    } else {
      commit("updateAreas", []);
    }
  },

  selectId({ commit, state }, id) {
    if (
      state.params.find(params => params.id === id) &&
      state.selectedId !== id
    ) {
      commit("selectId", id);
    }
  }
};

export default {
  namespaced: true,
  state: {
    selectedId: "0",
    areas: [],
    params: [
      {
        ...defaultRangeParams,
        id: "0"
      }
    ]
  },
  getters,
  mutations,
  actions
};
