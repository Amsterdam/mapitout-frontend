<template>
  <div :class="['location', { disabled: isDisabled }]">
    <location-type class="type" v-model="typeId" :isDisabled="isDisabled" :options="types" />
    <location-address
      class="address"
      v-model="address"
      :isDisabled="isDisabled"
      :search="lookupAddress"
      :resolve="resolveAddressId"
      placeholder="Choose an address"
    />
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.location {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.address {
  flex-grow: 1;
  margin-left: 16px;
}
</style>
<script>
import LocationType from "./LocationType";
import LocationAddress from "./LocationAddress";

export default {
  components: {
    LocationType,
    LocationAddress
  },
  props: {
    value: {
      type: Object,
      default: function() {
        return {
          typeId: 0,
          addressId: undefined,
          address: undefined,
          addressLat: null,
          addressLng: null
        };
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      required: true
    },
    lookupAddress: {
      type: Function,
      required: true
    },
    resolveAddressId: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      typeId: this.value.typeId,
      address: {
        id: this.value.addressId,
        address: this.value.address,
        lat: this.value.addressLat,
        lng: this.value.addressLng
      }
    };
  },
  watch: {
    typeId: function(typeId) {
      this.$emit("input", { ...this.value, typeId });
    },

    address: function(address) {
      this.$emit("input", {
        ...this.value,
        addressId: address.id,
        address: address.address,
        addressLat: address.lat,
        addressLng: address.lng
      });
    }
  }
};
</script>
