<template>
  <div
    ref="rootEl"
    class="enhanced-select"
    :class="{ disabled: isDisabled }"
    v-overlay-container="{ togglePropName: 'isListVisible' }"
  >
    <button class="trigger" :class="selectedClass" @click="onTriggerClick">
      {{ value }}
    </button>
    <transition name="fade">
      <ul class="dropdown" v-if="isListVisible">
        <li class="item" v-for="option in options" :key="option.id">
          <button class="option" :class="option.value" @click="onListItemClick(option.id)">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </transition>
    <select
      :disabled="isDisabled"
      class="native"
      v-model="selected"
      @change="onSelectChange"
      :class="selectedClass"
    >
      <option v-for="option in options" :key="option.id" :value="option.id">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
<style lang="scss">
@import "../../style/variables";

.enhanced-select {
  position: relative;
  overflow: visible;
  height: 28px;
}
.trigger {
  display: none;
  outline: none;
  cursor: pointer;

  @media (min-width: $breakpoint-tablet-portrait) {
    display: initial;
  }

  .disabled & {
    cursor: default;
  }
}
.native {
  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}
.dropdown {
  display: none;

  @media (min-width: $breakpoint-tablet-portrait) {
    list-style: none outside;
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    padding: 0;
    margin: 4px 0 0 0;
    background: white;
    border-radius: 3px;
    box-shadow: 0 2px 4px 0 $greyscale-1;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity 0.2s ease-in-out, margin-top 0.2s ease-in-out;
    }

    &.fade-enter,
    &.fade-leave-to {
      margin-top: 8px;
      opacity: 0;
    }
  }
}

.item {
  margin: 4px 8px;
}

.option {
  border: 0 none;
  cursor: pointer;
  text-align: center;
  color: $greyscale-1;
  outline: none;
}
</style>
<script>
import "../../directives/overlayContainer";

export default {
  props: {
    value: {
      type: Number,
      default: -1
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selected: this.value,
      isListVisible: false
    };
  },
  computed: {
    selectedClass: function() {
      const option = this.options.find(option => option.id === this.selected);

      if (option) {
        return `selected-${option.value}`;
      }

      return `selected-none`;
    }
  },
  watch: {
    selected: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit("input", newValue);
      }
    }
  },
  methods: {
    onTriggerClick() {
      if (!this.isDisabled) {
        this.isListVisible = !this.isListVisible;
      }
    },

    onListItemClick(value) {
      this.selected = value;
      this.isListVisible = false;
    },

    onSelectChange(event) {
      this.selected = parseInt(event.target.value);
    }
  }
};
</script>
