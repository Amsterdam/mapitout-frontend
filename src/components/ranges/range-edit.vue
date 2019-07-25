<template>
  <ul :class="['range-edit', { 'range-defined': isDefined }]">
    <li class="item origin">
      <component-origin
        class="input"
        v-model="origin"
        :isDisabled="isDisabled"
        :types="originTypes"
        :search-address="searchAddress"
        :geolocate-address="geoLocateAddress"
      />
    </li>
    <li class="item transport-method">
      <component-transport-type
        class="input"
        :isDisabled="isDisabled"
        v-model="transportTypeValue"
        :options="transportTypes"
      />
    </li>
    <li class="item travel-time">
      <component-travel-time
        class="input"
        :isDisabled="isDisabled"
        v-model="travelTime"
      />
    </li>
  </ul>
</template>
<style scoped lang="scss" src="./range-edit.scss"></style>
<script>
import { mapActions, mapState } from "vuex";

import ComponentOrigin from "../origin/origin.vue";
import ComponentTransportType from "../transport-type/transport-type.vue";
import ComponentTravelTime from "../travel-time/travel-time.vue";

export default {
  components: {
    ComponentOrigin,
    ComponentTransportType,
    ComponentTravelTime
  },
  props: {
    rangeParams: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      transportTypeValue: this.rangeParams.transportTypeValue,
      travelTime: this.rangeParams.travelTime,
      origin: {
        typeId: this.rangeParams.originTypeId,
        addressId: this.rangeParams.originId,
        address: this.rangeParams.origin,
        addressLat: this.rangeParams.originLat,
        addressLng: this.rangeParams.originLng
      }
    };
  },
  computed: {
    ...mapState("addresses", {
      originTypes: state => state.types
    }),

    ...mapState("transports", {
      transportTypes: state => state.types
    }),

    isDefined: function() {
      return (
        typeof this.origin === "object" &&
        typeof this.origin.addressId === "string" &&
        this.origin.addressId.length > 0
      );
    }
  },
  watch: {
    transportTypeValue: function(transportTypeValue) {
      this.updateParams({
        ...this.rangeParams,
        transportTypeValue
      });
    },
    travelTime: function(travelTime) {
      this.updateParams({
        ...this.rangeParams,
        travelTime
      });
    },
    origin: function(origin) {
      this.updateParams({
        ...this.rangeParams,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        origin: origin.address,
        originLat: origin.addressLat,
        originLng: origin.addressLng
      });
    }
  },
  methods: {
    ...mapActions("addresses", {
      searchAddress: "search",
      geoLocateAddress: "geoLocate"
    }),

    ...mapActions("ranges", ["updateParams"])
  }
};
</script>
