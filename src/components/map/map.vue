<template>
  <section class="map">
    <div class="canvas" ref="map"></div>
    <component-legal class="legal" />
  </section>
</template>
<style lang="scss" src="./map.scss"></style>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { isEqual } from "lodash-es";
import ComponentLegal from "../legal/legal";

import {
  createMap,
  createMarker,
  createPolygon,
  getGoogleMapsApi
} from "../../api/googleMaps";

export default {
  components: {
    ComponentLegal
  },
  props: {
    mapBoundaries: {
      type: Object,
      default: () => ({ north: 53.53, south: 50.74, west: 3.35, east: 7.25 })
    },
    mapCenter: {
      type: Object,
      default: () => ({ lat: 52.13, lng: 5.3 })
    }
  },

  data() {
    return {
      googleMapsApi: null,
      map: null,
      polygons: [],
      pois: []
    };
  },

  async mounted() {
    const googleMapsApi = await getGoogleMapsApi();

    this.map = createMap(
      this.$refs.map,
      {
        center: this.mapCenter,
        boundaries: this.mapBoundaries
      },
      googleMapsApi
    );
  },

  watch: {
    rangesAreas: function(areas, oldValue) {
      if (!isEqual(areas, oldValue)) {
        this.redrawAreas(areas);
      }
    },

    rangesParams: function(rangesParams, oldValue) {
      if (!isEqual(rangesParams, oldValue)) {
        this.redrawAreas(this.rangesAreas);
      }
    },

    selectedRangeId: function(selectedId, oldValue) {
      if (selectedId !== oldValue) {
        this.polygons
          .filter(({ id }) => id !== "union")
          .forEach(({ id, polygon }) => {
            let fillOpacity = 0.2;

            if (id === selectedId) {
              fillOpacity = 0.1;
            }

            polygon.setOptions({ fillOpacity });
          });
      }
    },

    locations: function(locations, oldValue) {
      if (!isEqual(locations, oldValue)) {
        this.redrawPois(locations);
      }
    }
  },

  computed: {
    ...mapState("ranges", {
      selectedRangeId: "selectedId",
      rangesParams: "params",
      rangesAreas: "areas"
    }),

    ...mapState("pois", {
      locations: "pois"
    }),

    ...mapGetters("addresses", [
      "getAddressIconByTypeId",
      "getAddressHighlightColorByTypeId"
    ])
  },

  methods: {
    ...mapActions("errors", {
      error: "generic"
    }),
    ...mapActions("ranges", {
      selectRangeById: "selectId"
    }),

    clearAreas() {
      this.polygons.forEach(({ polygon, marker }) => {
        polygon.setMap(null);

        if (typeof marker !== "undefined") {
          marker.setMap(null);
        }
      });

      this.polygons = [];
    },

    clearPois() {
      this.pois.forEach(({ marker }) => {
        marker.setMap(null);
      });

      this.pois = [];
    },

    async redrawAreas(areas) {
      this.clearAreas();

      if (areas.length > 2) {
        await this.drawUnion(areas.find(({ id }) => id === "union"));
      }

      await this.drawAreas(areas.filter(({ id }) => id !== "union"));
    },

    async redrawPois(pois) {
      this.clearPois();

      const googleMapsApi = await getGoogleMapsApi();

      this.pois = pois.map(poi => {
        const marker = createMarker(
          {
            title: poi.name,
            lat: poi.geo_location.coordinates[1],
            lng: poi.geo_location.coordinates[0],
            icon: poi.icon,
            map: this.map
          },
          googleMapsApi
        );

        marker.addListener("click", () => {
          this.$router.push({
            name: "details",
            params: {
              poi: poi.name
            }
          });
        });

        return {
          data: poi,
          marker
        };
      });
    },

    async drawUnion(configuration) {
      const googleMapsApi = await getGoogleMapsApi();

      const unionPolygon = createPolygon(
        {
          paths: configuration.paths,
          map: this.map
        },
        googleMapsApi
      );

      this.polygons.push({ id: "union", polygon: unionPolygon });
    },

    async drawAreas(areas) {
      const googleMapsApi = await getGoogleMapsApi();

      areas
        .map(area => {
          const rangeParams = this.rangesParams.find(
            params => params.id === area.id
          );

          return {
            ...area,
            origin: rangeParams.origin,
            originLat: rangeParams.originLat,
            originLng: rangeParams.originLng,
            icon: this.getAddressIconByTypeId(rangeParams.originTypeId),
            color: this.getAddressHighlightColorByTypeId(
              rangeParams.originTypeId
            )
          };
        })
        .forEach(configuration => {
          const polygon = createPolygon(
            {
              paths: configuration.paths,
              fillColor: configuration.color,
              fillOpacity: 0.2,
              strokeWeight: areas.length > 2 ? 0.5 : 1,
              map: this.map
            },
            googleMapsApi
          );

          polygon.addListener("mouseout", () => {
            if (configuration.id !== this.selectedId) {
              polygon.setOptions({
                fillOpacity: 0.2
              });
            }
          });

          polygon.addListener("click", () => {
            this.selectRangeById(configuration.id);
          });

          const marker = createMarker(
            {
              title: configuration.origin,
              lat: configuration.originLat,
              lng: configuration.originLng,
              icon: configuration.icon,
              map: this.map
            },
            googleMapsApi
          );

          marker.addListener("click", () => {
            this.selectRangeById(configuration.id);
          });

          this.polygons.push({ id: configuration.id, polygon, marker });
        });
    }
  }
};
</script>
