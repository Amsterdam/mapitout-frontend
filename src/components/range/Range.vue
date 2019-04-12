<template>
  <div class="range" :class="{ disabled: isDisabled }">
    <div class="origin">
      <location
        class="input"
        v-model="origin"
        :isDisabled="isDisabled"
        :types="originTypes"
        :lookup-address="lookupAddress"
        :resolve-address-id="resolveAddressId"
      />
    </div>
    <div class="transport">
      <transport-type
        class="input"
        :isDisabled="isDisabled"
        v-model="transportTypeId"
        :options="transportTypes"
      />
    </div>
    <div class="time">
      <travel-time class="input" :isDisabled="isDisabled" v-model="travelTime" />
    </div>
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

  > * {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 80px;
    padding: 0 36px;

    .input {
      flex-grow: 1;
    }
  }

  &.disabled {
    padding: 0 36px;
  }
}

.origin {
  z-index: 2;
  background-color: $greyscale-2;
  order: 2;

  .disabled & {
    background-color: transparent;
    padding: 0;
  }
}

.transport {
  z-index: 1;
  background-color: $greyscale-2;
  order: 3;

  .disabled & {
    background-color: transparent;
    margin-left: 8px;
    padding: 0;
  }
}

.time {
  z-index: 1;
  background-color: darken($greyscale-2, 10);
  order: 4;

  .disabled & {
    background-color: transparent;
    margin-left: 4px;
    padding: 0;
  }
}
</style>
<script>
import Location from "../input/Location";
import TransportType from "../input/TransportType";
import TravelTime from "../input/TravelTime";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Location,
    TransportType,
    TravelTime
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        travelTime: 45,
        transportTypeId: 0,
        departureTime: new Date().toISOString(),
        originTypeId: 0,
        originId: "",
        originAddress: "",
        originLat: null,
        originLng: null
      })
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      travelTime: this.value.travelTime,
      transportTypeId: this.value.transportTypeId,
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
    ...mapState("origins", {
      originTypes: state => state.types
    }),
    ...mapState("transports", {
      transportTypes: state => state.types
    })
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

    transportTypeId: function(transportTypeId) {
      this.$emit("input", { ...this.value, transportTypeId });
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
    ...mapActions("origins", ["lookupAddress", "resolveAddressId"]),

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
