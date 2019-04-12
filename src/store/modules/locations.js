import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconBus.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

import { http } from "../../utils";

import { isArray } from "lodash-es";

export const mutations = {
  saveResolved(state, resolved) {
    if (state.resolved.filter(resolved => resolved.id === resolved.id).length === 0) {
      state.resolved.push(resolved);
    }
  },

  updatePois(state, pois) {
    state.pois = pois;
  },

  view(state, details) {
    state.details = details;
  }
};

export const getters = {
  getResolvedById: state => id => state.resolved.find(resolved => resolved.id === id),

  getOriginIconByOriginTypeId: state => id => {
    const originType = state.originTypes.find(originType => originType.id === id);

    return originType ? originType.icon : undefined;
  },

  getOriginHighlightColorByOriginTypeId: state => id => {
    const originType = state.originTypes.find(originType => originType.id === id);

    return originType ? originType.highlightColor : "#000000";
  },

  getPoiIconByPoiTypeId: state => id => {
    const poiType = state.poiTypes.find(poiType => poiType.id === id);

    return poiType ? poiType.icon : undefined;
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
  },

  async fetch({ dispatch, commit }, { filters, areas }) {
    let pois = [];

    if (filters.length > 0 && areas.length > 0) {
      const url = new URL(process.env.VUE_APP_ENDPOINT_POI_SEARCH);

      const request = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          poi_by_type: filters.map(filter => filter.value),
          poi_in_polygon: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: areas
                .find(area => area.rangeId === "union")
                .paths.map(polygon => polygon.map(point => [point.lng, point.lat])),
              crs: {
                type: "name",
                properties: {
                  name: "EPSG:4326"
                }
              }
            }
          }
        })
      };

      try {
        const result = await http(url, request);

        if (isArray(result)) {
          pois = result.map(locationData => locationData[0]);
        }
      } catch (error) {
        dispatch("reportError", error, { root: true });
      }
    }

    commit("updatePois", pois);
  },

  async lookup({ dispatch, commit, getters }, locationName) {
    const url = new URL(process.env.VUE_APP_ENDPOINT_POI_SEARCH);

    const request = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        poi_by_name: locationName
      })
    };

    let details = null;

    try {
      const result = await http(url, request);

      if (isArray(result)) {
        details = {
          name: result[0][0].name,
          description: result[0][0].description,
          address: `${result[0][0].street}, ${result[0][0].postalcode} ${result[0][0].city}`,
          website: result[0][0].website,
          phone: result[0][0].phone,
          lng: result[0][0].geo_location.coordinates[0],
          lat: result[0][0].geo_location.coordinates[1],
          icon: getters.getPoiIconByPoiTypeId(result[0][0].poi_type_id)
        };
      }
    } catch (error) {
      dispatch("reportError", error, { root: true });
    }

    commit("view", details);
  }
};

export default {
  namespaced: true,
  state: {
    originTypes: [
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
    poiTypes: [
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
