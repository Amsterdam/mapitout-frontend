<template>
  <div
    :class="['location-type', { disabled: isDisabled, open: isListVisible }]"
    v-overlay-container="{ togglePropName: 'isListVisible' }"
  >
    <button tabindex="0" class="trigger" @click="onTriggerClick">
      <component class="icon-type" :is="selected.iconComponent" />
      <caret-down class="icon-dropdown" />
    </button>
    <transition name="fade">
      <ul class="dropdown" v-if="isListVisible">
        <li class="item" v-for="option in options" :key="option.id">
          <button
            tabindex="0"
            class="option"
            @click="onListItemClick(option.id)"
          >
            <component class="icon" :is="option.iconComponent" />
            <span>{{ option.label }}</span>
          </button>
        </li>
      </ul>
    </transition>
    <label>
      <select
        class="native"
        tabindex="0"
        v-model="value"
        :disabled="isDisabled"
        @change="onSelectChange"
      >
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
<style scoped lang="scss" src="./address-type.scss"></style>
<script>
import "../../directives/overlayContainer";

import IconHome from "@/assets/icons/IconHome.svg?inline";
import IconTransport from "@/assets/icons/IconBus.svg?inline";
import IconHealth from "@/assets/icons/IconHealth.svg?inline";
import IconWork from "@/assets/icons/IconWork.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import IconWellness from "@/assets/icons/IconWellness.svg?inline";
import CaretDown from "@/assets/CaretDown.svg?inline";

export default {
  name: "component-address-type",
  components: {
    IconHome,
    IconTransport,
    IconHealth,
    IconWork,
    IconEducation,
    IconWellness,
    CaretDown
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isListVisible: false
    };
  },
  computed: {
    selected: function() {
      return this.options.find(option => option.id === this.value);
    }
  },
  methods: {
    onTriggerClick() {
      if (!this.isDisabled) {
        this.isListVisible = !this.isListVisible;
      }
    },

    onListItemClick(id) {
      this.$emit("input", id);

      this.isListVisible = false;
    },

    onSelectChange(event) {
      const id = parseInt(event.target.value);

      this.$emit("input", id);
    }
  }
};
</script>
