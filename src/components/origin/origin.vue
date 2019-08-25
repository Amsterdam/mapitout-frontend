<template>
  <div :class="['location', { disabled: isDisabled }]">
    <component-address-type
      class="type"
      v-model="typeId"
      :isDisabled="isDisabled"
      :options="types"
    />
    <component-input-address
      class="address"
      v-model="address"
      :isDisabled="isDisabled"
      :search="searchAddress"
      :resolve="geolocateAddress"
      placeholder="Choose an address"
    />
  </div>
</template>
<style scoped lang="scss" src="./origin.scss"></style>
<script>
import ComponentAddressType from "../address-type/address-type.vue";
import ComponentInputAddress from "../input-adress/input-address.vue";

export default {
  components: {
    ComponentAddressType,
    ComponentInputAddress
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      required: true
    },
    searchAddress: {
      type: Function,
      required: true
    },
    geolocateAddress: {
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
