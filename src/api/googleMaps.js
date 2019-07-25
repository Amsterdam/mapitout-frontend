import { once } from "lodash-es";
import GoogleMapsApiLoader from "google-maps-api-loader";

import { GOOGLE_MAPS_API_KEY } from "../env";
import styles from "../style/google-maps";

export const getGoogleMapsApi = once(async () => {
  try {
    return await GoogleMapsApiLoader({
      apiKey: GOOGLE_MAPS_API_KEY
    });
  } catch (error) {
    throw new Error(`Error initializing the Google Maps API: ${error.message}`);
  }
});

export const createMap = (el, { center, boundaries }, googleMapsApi) => {
  const { maps } = googleMapsApi;

  return new maps.Map(el, {
    disableDefaultUI: true,
    zoom: 9,
    minZoom: 9,
    center: center,
    restriction: {
      latLngBounds: boundaries
    },
    styles
  });
};

export const createPolygon = (configuration, googleMapsApi) => {
  const { maps } = googleMapsApi;

  const {
    paths,
    strokeWeight = 1,
    fillColor = "#000000",
    fillOpacity = 0,
    map
  } = configuration;

  return new maps.Polygon({
    paths,
    strokeColor: "#000000",
    strokeOpacity: 1,
    strokeWeight,
    fillColor,
    fillOpacity,
    map
  });
};

export const createMarker = (configuration, googleMapsApi) => {
  const { maps } = googleMapsApi;

  const { title, icon, lat, lng, map } = configuration;

  return new maps.Marker({
    position: {
      lat,
      lng
    },
    title,
    map,
    icon: {
      url: icon,
      scaledSize: new maps.Size(24, 24)
    }
  });
};
