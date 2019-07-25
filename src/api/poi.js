import { request } from "./util/http";
import { ENDPOINT_POI_SEARCH } from "../env";
import { isArray } from "lodash-es";

const requestConfig = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json; charset=utf-8"
  }
};

export const fetchPois = async (
  area = { paths: [] },
  types = [],
  subTypes = []
) => {
  if (
    typeof area !== "object" ||
    !area.hasOwnProperty("paths") ||
    !isArray(area.paths) ||
    area.paths.length === 0
  ) {
    return [];
  }
  const requestBody = {
    poi_in_polygon: {
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: area.paths.map(polygon => [
          polygon.map(point => [point.lng, point.lat])
        ]),
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        }
      }
    }
  };

  if (types.length > 0) {
    requestBody.poi_by_type = types;
  }

  if (subTypes.length > 0) {
    requestBody.poi_by_property = subTypes;
  }

  const url = new URL(ENDPOINT_POI_SEARCH);

  const response = await request(url.toString(), {
    ...requestConfig,
    body: JSON.stringify(requestBody)
  });

  return response.map(locationData => locationData[0]);
};

export const lookupPoi = async (poiName = "") => {
  if (typeof poiName !== "string" || poiName.length === 0) {
    return null;
  }
  const url = new URL(ENDPOINT_POI_SEARCH);

  const response = await request(url.toString(), {
    ...requestConfig,
    body: JSON.stringify({
      poi_by_name: poiName
    })
  });

  if (response[0][0]) {
    return {
      name: response[0][0].name,
      description: response[0][0].description,
      address: `${response[0][0].street}, ${response[0][0].postalcode} ${
        response[0][0].city
      }`,
      website: response[0][0].website,
      phone: response[0][0].phone,
      lng: response[0][0].geo_location.coordinates[0],
      lat: response[0][0].geo_location.coordinates[1],
      typeId: response[0][0].poi_type_id
    };
  }

  return null;
};
