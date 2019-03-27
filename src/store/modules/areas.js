import { getNextMonday9Am } from "../../utils";

// const DATASOURCE_AREAS = "https://acc2mapitout.iamsterdam.com/api/v4/time-map";
const DATASOURCE_AREAS = "https://api.traveltimeapp.com/v4/time-map";

export const mutations = {
  update(state, areas) {
    state.areas = areas;
  }
};

export const actions = {
  async fetch({ dispatch, commit }, ranges) {
    const url = new URL(DATASOURCE_AREAS);

    const request = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=utf-8",
        "X-Application-Id": "f1dbb480",
        "X-Api-Key": "77b855c7fc769f7c1fe49c207b0f1f97"
      },
      body: JSON.stringify({
        departure_searches: ranges.map(range => {
          return {
            id: range.originId,
            coords: {
              lat: range.originCoordinates.lat,
              lng: range.originCoordinates.lng
            },
            departure_time: getNextMonday9Am().toISOString(),
            travel_time: range.travelTime * 60,
            transportation: {
              type: range.transportType
            }
          };
        }),
        unions: [
          {
            id: "union",
            search_ids: ranges.map(range => range.originId)
          }
        ],
        intersections: [
          {
            id: "intersection",
            search_ids: ranges.map(range => range.originId)
          }
        ]
      })
    };

    let areas = [];

    try {
      const response = await fetch(url.toString(), request);

      if (response.ok) {
        const result = await response.json();

        areas = result.results;
      } else {
        dispatch("reportError", new Error("Invalid server response"), { root: true });
      }
    } catch (error) {
      dispatch("reportError", new Error("Unable to perform network call"), { root: true });
    }

    commit("update", areas);
  }
};

export default {
  namespaced: true,
  state: {
    // areas: require("../data/intersection.json").results
    // areas: require("../data/separate.json").results
    areas: []
  },
  mutations,
  actions
};
