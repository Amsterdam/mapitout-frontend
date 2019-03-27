<template>
  <div class="range" :class="{ active: isActive }" @click="onRootClick">
    <location-input class="location" :isDisabled="!isActive" v-model="origin" />
    <transport-type class="transport-type" :isDisabled="!isActive" v-model="transportType" />
    <travel-time class="travel-time" :isDisabled="!isActive" v-model="travelTime" />
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.range {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 48px;
  background-color: white;
  cursor: pointer;
  overflow: hidden;

  > * {
    padding: 0;
  }

  &.active {
    flex-direction: column;
    align-items: stretch;
    justify-content: normal;
    padding: 0;
    cursor: default;

    > * {
      padding: 24px 48px;
    }
  }
}

.location::v-deep {
  background-color: transparent;
  flex-basis: 60%;

  .active & {
    z-index: 2;
    background-color: $greyscale-2;
  }
}

.transport-type::v-deep {
  background-color: transparent;
  margin-left: auto;

  .active & {
    margin-left: 0;
    z-index: 1;
    background-color: $greyscale-2;
  }
}

.travel-time::v-deep {
  z-index: 1;
  background-color: white;
  margin-left: 4px;

  .active & {
    margin-left: 0;
    background-color: lighten($greyscale-1, 55);
  }
}
</style>
<script>
import LocationInput from "./input/LocationInput";
import TransportType from "./input/TransportType";
import TravelTime from "./input/TravelTime";

export default {
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          travelTime: 45,
          transportType: "public_transport",
          originType: "home",
          originId: undefined,
          originAddress: undefined,
          originCoordinates: null
        };
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      travelTime: this.value.travelTime,
      transportType: this.value.transportType,
      origin: {
        type: this.value.originType,
        addressId: this.value.originId,
        address: this.value.originAddress,
        coordinates: this.value.originCoordinates
      }
    };
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
        originType: origin.type,
        originId: origin.addressId,
        originAddress: origin.address,
        originCoordinates: origin.coordinates
      });
    },
    transportType: function(transportType) {
      this.$emit("input", { ...this.value, transportType });
    },
    travelTime: function(travelTime) {
      this.$emit("input", { ...this.value, travelTime });
    }
  },
  methods: {
    onRootClick() {
      if (!this.isActive) {
        this.$emit("focus");
      }
    }
  }
};
</script>
