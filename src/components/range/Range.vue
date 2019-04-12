<template>
  <div class="range" :class="{ disabled: isDisabled }">
    <location-input
      class="location"
      v-model="origin"
      :isDisabled="isDisabled"
      :types="originTypes"
      :lookup-address="lookupAddress"
      :resolve-address-id="resolveAddressId"
    />
    <transport-type class="transport-type" :isDisabled="isDisabled" v-model="transportType" />
    <travel-time class="travel-time" :isDisabled="isDisabled" v-model="travelTime" />
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: normal;
  padding: 0;
  cursor: default;
}

.location::v-deep {
  z-index: 2;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 2;

  .disabled & {
    background-color: transparent;
    padding: 0;
  }
}

.transport-type::v-deep {
  z-index: 1;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 3;

  .disabled & {
    background-color: transparent;
    margin-left: 8px;
    padding: 0;
  }
}

.travel-time::v-deep {
  z-index: 1;
  background-color: $greyscale-2;
  padding: 24px 48px;
  order: 4;

  .disabled & {
    background-color: transparent;
    margin-left: 4px;
    padding: 0;
  }
}
</style>
<script>
import LocationInput from "../input/LocationInput";
import TransportType from "../input/TransportType";
import TravelTime from "../input/TravelTime";
import { mapActions, mapState } from "vuex";

export default {
  props: {
    value: {
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
      travelTime: this.value.travelTime,
      transportType: this.value.transportType,
      departureTime: this.value.departureTime,
      origin: {
        typeId: this.value.originTypeId,
        addressId: this.value.originId,
        address: this.value.originAddress,
        addressLat: this.value.originLat,
        addressLng: this.value.originLng
      }
    };
  },
  computed: {
    ...mapState("locations", {
      originTypes: state => state.originTypes
    })
  },
  components: {
    LocationInput,
    TransportType,
    TravelTime
  },
  watch: {
    origin: function(origin) {
      this.$emit("input", {
        ...this.value,
        originTypeId: origin.typeId,
        originId: origin.addressId,
        originAddress: origin.address,
        originLat: origin.addressLat,
        originLng: origin.addressLng
      });
    },

    transportType: function(transportType) {
      this.$emit("input", { ...this.value, transportType });
    },

    travelTime: function(travelTime) {
      this.$emit("input", {
        ...this.value,
        travelTime,
        departureTime: this.getDepartureTime(new Date()).toISOString()
      });
    }
  },
  methods: {
    ...mapActions("locations", ["lookupAddress", "resolveAddressId"]),

    getDepartureTime(date) {
      const dayOfWeek = date.getUTCDay();

      if (dayOfWeek !== 1) {
        const dayOfMonth = date.getUTCDate();

        date.setUTCDate(dayOfMonth - dayOfWeek + 8);
      }

      date.setUTCHours(9, 0, 0, 0);

      return date;
    }
  }
};
</script>
