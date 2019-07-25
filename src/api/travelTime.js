import { request } from "./util/http";
import { omit } from "lodash-es";
import { ENDPOINT_RANGES } from "../env";
import { getDepartureTime } from "./util/getDepartureTime";

export const cache = {
  areas: {}
};

export const fetchAreas = async (rangesParams = []) => {
  if (rangesParams instanceof Array === false || rangesParams.length === 0) {
    return [];
  }
  const cacheKey = rangesParams
    .map(rangeParams => omit(rangeParams, ["id", "origin"]))
    .map(rangeParams =>
      Object.values(rangeParams)
        .sort()
        .join("-")
    )
    .join(";");

  if (typeof cache.areas[cacheKey] !== "undefined") {
    return cache.areas[cacheKey];
  }

  const requestBody = {
    departure_searches: rangesParams.map(rangeParams => {
      return {
        id: rangeParams.id,
        coords: {
          lat: rangeParams.originLat,
          lng: rangeParams.originLng
        },
        departure_time: getDepartureTime(),
        travel_time: rangeParams.travelTime * 60,
        transportation: {
          type: rangeParams.transportTypeValue
        }
      };
    }),
    unions: [
      {
        id: "union",
        search_ids: rangesParams.map(rangeParams => rangeParams.id)
      }
    ]
  };

  const url = new URL(ENDPOINT_RANGES);

  const response = await request(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(requestBody)
  });

  const result = response.results.map(timeMap => {
    return {
      id: timeMap.search_id,
      paths: timeMap.shapes.reduce((acc, shape) => {
        let paths = [shape.shell];

        if (shape.holes.length > 0) {
          paths = paths.concat(shape.holes);
        }

        return acc.concat(paths);
      }, [])
    };
  });

  cache.areas[cacheKey] = result;

  return result;
};
