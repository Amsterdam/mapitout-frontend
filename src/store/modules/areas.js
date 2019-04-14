import { http } from "../../utils";

export const getters = {
  getAreasFromCache: state => key =>
    state.cache.find(cachedAreaObject => cachedAreaObject.key === key),

  unionArea: state => state.areas.find(area => area.id === "union")
};

export const mutations = {
  replace(state, areas) {
    state.areas = areas;
  },

  save(state, { key, areas }) {
    if (!state.cache.find(areaObject => areaObject.key === key)) {
      state.cache.push({ key, areas });
    }
  }
};

export const actions = {
  async fetch({ dispatch, commit, getters, rootState, rootGetters }) {
    const rangesWithDefinedOrigins = rootState.ranges.ranges.filter(range => range.originId);
    let areas = [];

    if (rangesWithDefinedOrigins.length > 0) {
      const origins = await Promise.all(
        rangesWithDefinedOrigins.map(range =>
          dispatch("origins/resolve", range.originId, { root: true })
        )
      );
      const requestBody = {
        departure_searches: rangesWithDefinedOrigins.map(range => {
          const origin = origins.find(origin => origin.id === range.originId);

          return {
            id: String(range.id),
            coords: {
              lat: origin.lat,
              lng: origin.lng
            },
            departure_time: range.departureTime,
            travel_time: range.travelTime * 60,
            transportation: {
              type: rootGetters["transports/getTransportValueById"](range.transportTypeId)
            }
          };
        }),
        unions: [
          {
            id: "union",
            search_ids: rangesWithDefinedOrigins.map(range => `${range.id}`)
          }
        ]
      };

      if (rangesWithDefinedOrigins.length > 1) {
        requestBody.intersections = [
          {
            id: "intersection",
            search_ids: rangesWithDefinedOrigins.map(range => `${range.id}`)
          }
        ];
      }

      const body = JSON.stringify(requestBody);

      const cachedAreasObject = getters.getAreasFromCache(body);

      if (cachedAreasObject) {
        areas = cachedAreasObject.areas;
      } else {
        try {
          const result = await http(process.env.VUE_APP_ENDPOINT_AREAS, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-type": "application/json; charset=utf-8"
            },
            body
          });

          areas = result.results.map(timeMap => {
            return {
              id: timeMap.search_id,
              rangeId: parseInt(timeMap.search_id),
              paths: timeMap.shapes.reduce((acc, shape) => {
                let paths = [shape.shell];

                if (shape.holes.length > 0) {
                  paths = paths.concat(shape.holes);
                }

                return acc.concat(paths);
              }, [])
            };
          });

          commit("save", { key: body, areas });
        } catch (error) {
          dispatch("reportError", error, { root: true });
        }
      }
    }

    commit("replace", areas);
  }
};

export default {
  namespaced: true,
  state: {
    mapBoundaries: { north: 53.53, south: 50.74, west: 3.35, east: 7.25 },
    areas: [],
    cache: []
  },
  getters,
  mutations,
  actions
};
