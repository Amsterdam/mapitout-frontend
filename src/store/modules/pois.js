import IconTransport from "@/assets/icons/IconBus.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";

import { fetchPois, lookupPoi } from "../../api/poi";

export const getters = {
  getPoiIconByPoiTypeId: state => id =>
    state.types.find(poiType => poiType.id === id).icon
};

export const mutations = {
  update(state, pois) {
    state.pois = pois;
  }
};

export const actions = {
  async update({ dispatch, commit, getters, rootGetters }) {
    const unionArea = rootGetters["ranges/unionArea"];
    const selectedTypes = rootGetters["filters/selectedTypes"];
    const selectedSubTypes = rootGetters["filters/selectedSubTypes"];

    if (
      typeof unionArea === "undefined" ||
      (selectedTypes.length === 0 && selectedSubTypes.length === 0)
    ) {
      commit("update", []);

      return;
    }

    try {
      const pois = await fetchPois(unionArea, selectedTypes, selectedSubTypes);

      commit(
        "update",
        pois.map(poi => ({
          ...poi,
          icon: getters.getPoiIconByPoiTypeId(poi.poi_type_id)
        }))
      );
    } catch (error) {
      dispatch("errors/network", error, { root: true });

      commit("update", []);
    }
  },

  async lookup({ dispatch }, locationName = "") {
    if (typeof locationName !== "string" || locationName.length === 0) {
      return null;
    }

    try {
      return await lookupPoi(locationName);
    } catch (error) {
      dispatch("errors/network", error, { root: true });

      return null;
    }
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      {
        icon: IconTransport,
        id: 1
      },
      {
        icon: IconEducation,
        id: 2
      }
    ],
    details: null,
    resolved: [],
    pois: []
  },
  getters,
  mutations,
  actions
};
