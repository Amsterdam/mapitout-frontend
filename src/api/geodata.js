import { request } from "./util/http";
import { ENDPOINT_ADDRESS_SEARCH, ENDPOINT_GEOLOCATION } from "../env";

export const cache = {
  geoLocation: {}
};

export const searchAddresses = async (query = "") => {
  if (typeof query !== "string" || query.length === 0) {
    return [];
  }

  const url = new URL(ENDPOINT_ADDRESS_SEARCH);

  url.searchParams.append("q", query);

  const { response } = await request(url.toString(), {
    method: "GET"
  });

  return response.docs.map(suggestion => ({
    id: suggestion.id,
    address: suggestion.weergavenaam
  }));
};

export const geoLocateAddress = async (addressId = "") => {
  if (typeof addressId !== "string" || addressId.length === 0) {
    return null;
  }

  if (typeof cache.geoLocation[addressId] !== "undefined") {
    return cache.geoLocation[addressId];
  }

  const url = new URL(ENDPOINT_GEOLOCATION);

  url.searchParams.append("id", addressId);

  const { response } = await request(url.toString(), {
    method: "GET"
  });

  if (response.docs.length > 0) {
    const coordinates = response.docs[0].centroide_ll
      .replace("POINT(", "")
      .replace(")", "")
      .split(" ")
      .map(coord => parseFloat(coord));

    const geoLocation = {
      id: addressId,
      lng: coordinates[0],
      lat: coordinates[1],
      address: response.docs[0].weergavenaam
    };

    // eslint-disable-next-line require-atomic-updates
    cache.geoLocation[addressId] = geoLocation;

    return geoLocation;
  }

  return null;
};
