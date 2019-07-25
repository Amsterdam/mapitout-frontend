<template>
  <div :class="['transport-type', { disabled: isDisabled }]">
    <ul class="list">
      <li
        v-for="option in options"
        :key="option.value"
        :class="['item', { selected: option.value === value }]"
      >
        <button
          :class="[
            'option',
            option.value,
            { selected: option.value === value }
          ]"
          tabindex="0"
          :title="options.label"
          @click="onListItemClick(option.value)"
        >
          <component
            :is="option.iconComponent"
            :class="['icon', option.iconComponent]"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss" src="./transport-type.scss"></style>
<script>
import IconTransportBicycle from "@/assets/icons/IconTransportBicycle.svg?inline";
import IconTransportBicycleBus from "@/assets/icons/IconTransportBicycleBus.svg?inline";
import IconTransportBus from "@/assets/icons/IconTransportBus.svg?inline";
import IconTransportCar from "@/assets/icons/IconTransportCar.svg?inline";
import IconTransportPedestrian from "@/assets/icons/IconTransportPedestrian.svg?inline";

export default {
  props: {
    value: {
      type: String,
      default: "cycling"
    },
    options: {
      type: Array,
      required: true
    },
    isDisabled: Boolean
  },
  components: {
    IconTransportBicycle,
    IconTransportBicycleBus,
    IconTransportBus,
    IconTransportCar,
    IconTransportPedestrian
  },
  methods: {
    onListItemClick(value) {
      this.select(value);
    },

    select(value) {
      if (value !== this.value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>
