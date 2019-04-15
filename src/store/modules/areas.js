import { http } from "../../utils";

export function buildAreasFetchRequestBody(ranges, origins) {
  const requestBody = {
    departure_searches: ranges.map(range => {
      const origin = origins.find(origin => origin.id === range.originId);

      if (!origin) {
        throw new Error("Invalid request parameters");
      }

      return {
        id: String(range.id),
        coords: {
          lat: origin.lat,
          lng: origin.lng
        },
        departure_time: range.departureTime,
        travel_time: range.travelTime * 60,
        transportation: {
          type: range.transportTypeValue
        }
      };
    }),
    unions: [
      {
        id: "union",
        search_ids: ranges.map(range => `${range.id}`)
      }
    ]
  };

  if (ranges.length > 1) {
    requestBody.intersections = [
      {
        id: "intersection",
        search_ids: ranges.map(range => `${range.id}`)
      }
    ];
  }

  return requestBody;
}

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
      const origins = await dispatch(
        "origins/resolveArray",
        rangesWithDefinedOrigins.map(range => range.originId)
      );

      const requestBody = buildAreasFetchRequestBody(
        rangesWithDefinedOrigins.map(range => ({
          ...range,
          transportTypeValue: rootGetters["transports/getTransportValueById"](range.transportTypeId)
        })),
        origins
      );

      const cacheKey = JSON.stringify(requestBody);
      const cachedAreasObject = getters.getAreasFromCache(cacheKey);

      if (cachedAreasObject) {
        areas = cachedAreasObject.areas;
      } else {
        const result = await http(process.env.VUE_APP_ENDPOINT_AREAS, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          body: JSON.stringify(requestBody)
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

        commit("save", { key: cacheKey, areas });
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
