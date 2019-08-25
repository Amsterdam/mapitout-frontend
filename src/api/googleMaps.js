import styles from "../style/google-maps";

export const createMap = (el, { center, boundaries }) => {
  const { maps } = google;

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

export const createPolygon = (configuration) => {
  const { maps } = google;

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

export const createMarker = (configuration) => {
  const { maps } = google;

  const { title, icon, lat, lng } = configuration;

  return new maps.Marker({
    position: {
      lat,
      lng
    },
    title,
    icon: {
      url: icon,
      scaledSize: new maps.Size(24, 24)
    }
  });
};
