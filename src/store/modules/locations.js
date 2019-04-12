import IconTransport from "@/assets/icons/IconBus.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";

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
  getPoiIconByPoiTypeId: state => id => {
    const poiType = state.poiTypes.find(poiType => poiType.id === id);

    return poiType ? poiType.icon : undefined;
  }
};

export const actions = {
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
