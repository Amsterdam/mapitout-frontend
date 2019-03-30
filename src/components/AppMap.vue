<template>
  <section ref="map"></section>
</template>
<script>
import GoogleMapsApiLoader from "google-maps-api-loader";

import { getDeviceGeoLocation } from "../utils";
import styles from "../style/google-maps";
import { mapGetters, mapState } from "vuex";
import { isEqual, pick } from "lodash";

export const BOUNDARIES_NETHERLANDS = { north: 53.53, south: 50.74, west: 3.35, east: 7.25 };
export const MAP_MASK = [
  // { lat: BOUNDARIES_NETHERLANDS.north + 5, lng: BOUNDARIES_NETHERLANDS.west - 5 },
  // { lat: BOUNDARIES_NETHERLANDS.south - 5, lng: BOUNDARIES_NETHERLANDS.west - 5 },
  // { lat: BOUNDARIES_NETHERLANDS.south - 5, lng: BOUNDARIES_NETHERLANDS.east + 5 },
  // { lat: BOUNDARIES_NETHERLANDS.north + 5, lng: BOUNDARIES_NETHERLANDS.east + 5 }
  { lat: BOUNDARIES_NETHERLANDS.north + 5, lng: BOUNDARIES_NETHERLANDS.west - 5 },
  { lat: BOUNDARIES_NETHERLANDS.north + 5, lng: BOUNDARIES_NETHERLANDS.east + 5 },
  { lat: BOUNDARIES_NETHERLANDS.south - 5, lng: BOUNDARIES_NETHERLANDS.east + 5 },
  { lat: BOUNDARIES_NETHERLANDS.south - 5, lng: BOUNDARIES_NETHERLANDS.west - 5 }
];

export default {
  data() {
    return {
      google: null,
      map: null,
      unionPolygon: null,
      originMarkers: [],
      intersectionPaths: []
    };
  },
  computed: {
    ...mapState("areas", {
      areas: state => state.areas
    }),
    ...mapGetters("locations", ["getTypeByValue"]),
    ...mapGetters("ranges", ["rangesWithOrigin"])
  },
  watch: {
    areas: function() {
      this.drawCoverage();
    },

    rangesWithOrigin: function(newValue, oldValue) {
      if (
        !isEqual(
          newValue.map(range => ({ ...pick(range, ["originId", "originType"]) })),
          oldValue.map(range => ({ ...pick(range, ["originId", "originType"]) }))
        )
      ) {
        this.drawOrigins();
      }
    }
  },
  async mounted() {
    try {
      this.google = await GoogleMapsApiLoader({ apiKey: process.env.VUE_APP_GOOGLE_API_KEY });
    } catch (error) {
      this.$router.push({ name: "error", params: { error } });
      return;
    }

    const center = await getDeviceGeoLocation();

    this.map = new this.google.maps.Map(this.$refs.map, {
      disableDefaultUI: true,
      zoom: 9,
      minZoom: 9,
      center,
      restriction: {
        latLngBounds: BOUNDARIES_NETHERLANDS
      },
      styles
    });
  },

  methods: {
    drawOrigins() {
      this.originMarkers.forEach(marker => {
        marker.setMap(null);
      });

      this.originMarkers = this.rangesWithOrigin.map(range => {
        return new this.google.maps.Marker({
          position: range.originCoordinates,
          title: range.originAddress,
          // icon: `../assets/${this.getTypeByValue(range.originType).icon}.svg?external`,
          map: this.map
        });
      });
    },

    drawCoverage() {
      if (this.unionPolygon) {
        this.unionPolygon = this.unionPolygon.setMap(null);
        this.unionPolygon = null;
      }

      this.intersectionPaths = this.intersectionPaths.reduce((acc, path) => {
        path.setMap(null);
      }, []);

      debugger;

      const unionAreas = this.areas.find(area => area.rangeId === "union");

      if (unionAreas && unionAreas.paths.length > 1) {
        this.unionPolygon = new this.google.maps.Polygon({
          paths: [MAP_MASK, ...unionAreas.paths],
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#4d4d4d",
          fillOpacity: 0.4,
          map: this.map
        });
      }

      if (this.areas.length > 3) {
        const intersectionAreas = this.areas.find(area => area.rangeId === "intersection");

        if (intersectionAreas && intersectionAreas.paths.length > 0) {
          this.intersectionPaths = intersectionAreas.paths.map(
            intersectionPath =>
              new this.google.maps.Polyline({
                path: intersectionPath,
                strokeColor: "#000000",
                strokeOpacity: 1,
                fillOpacity: 0,
                strokeWeight: 0,
                icons: [
                  {
                    icon: {
                      path: this.google.maps.SymbolPath.CIRCLE,
                      fillOpacity: 1,
                      scale: 1
                    },
                    offset: "0",
                    repeat: "10px"
                  }
                ],
                map: this.map
              })
          );
        }
      }
    }
  }
};
</script>
