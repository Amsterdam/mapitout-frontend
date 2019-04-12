import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconBus.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

import { http } from "../../utils";

export const getters = {
  getResolvedById: state => id => state.resolved.find(resolved => resolved.id === id),

  getOriginIconByOriginTypeId: state => id => {
    const originType = state.originTypes.find(originType => originType.id === id);

    return originType ? originType.icon : undefined;
  },

  getOriginHighlightColorByOriginTypeId: state => id => {
    const originType = state.originTypes.find(originType => originType.id === id);

    return originType ? originType.highlightColor : "#000000";
  }
};

export const mutations = {
  saveResolved(state, resolved) {
    if (state.resolved.filter(resolved => resolved.id === resolved.id).length === 0) {
      state.resolved.push(resolved);
    }
  }
};

export const actions = {
  async lookupAddress({ dispatch }, query) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_ADDRESS_SEARCH);

    url.searchParams.append("q", query);

    const request = {
      method: "GET"
    };

    let suggestions = [];

    try {
      const result = await http(url, request);

      suggestions = result.response.docs.map(suggestion => ({
        id: suggestion.id,
        label: suggestion.weergavenaam
      }));
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    return suggestions;
  },

  async resolveAddressId({ state, getters, commit, dispatch }, id) {
    let resolved = getters.getResolvedById(state, id);

    if (resolved) {
      return resolved;
    }

    const url = new URL(process.env.VUE_APP_ENDPOINT_GEOLOCATION);

    url.searchParams.append("id", id);

    const request = {
      method: "GET"
    };

    resolved = null;

    try {
      const result = await http(url, request);
      const coordinates = result.response.docs[0].centroide_ll
        .replace("POINT(", "")
        .replace(")", "")
        .split(" ")
        .map(coord => parseFloat(coord));

      if (result.response.docs[0]) {
        resolved = {
          id,
          lng: coordinates[0],
          lat: coordinates[1],
          address: result.response.docs[0].weergavenaam
        };

        commit("saveResolved", resolved);
      }
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    return resolved;
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      { id: 0, value: "home", label: "Home", icon: IconHome, highlightColor: "#ff0000" },
      {
        id: 1,
        value: "transport",
        label: "Station",
        icon: IconTransport,
        highlightColor: "#fd6500"
      },
      { id: 2, value: "health", label: "Health", icon: IconHealth, highlightColor: "#87c010" },
      { id: 3, value: "work", label: "Work", icon: IconWork, highlightColor: "#ff0000" },
      {
        id: 4,
        value: "education",
        label: "School",
        icon: IconEducation,
        highlightColor: "#0c65d5"
      },
      { id: 5, value: "wellness", label: "Gym", icon: IconWellness, highlightColor: "#942190" }
    ],
    resolved: []
  },
  getters,
  mutations,
  actions
};