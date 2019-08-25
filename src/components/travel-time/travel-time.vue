<template>
  <div :class="['slider', { disabled: isDisabled }]">
    <icon-time class="icon" v-if="!isDisabled" />
    <div class="rail-labels-value">
      <div class="current-value">
        <span class="label" v-if="!isDisabled">Travel time: </span>
        <span class="value">{{ value }}m</span>
      </div>
      <div v-if="!isDisabled" ref="rail" class="rail" @click="onRailClick">
        <div
          ref="handle"
          @click.stop
          class="handle"
          :style="{ left: `calc(${handleOffsetX}% - 6px)` }"
        ></div>
      </div>
      <div v-if="!isDisabled" class="labels">
        <span class="min">{{ minValue }}</span>
        <span class="max">{{ maxValue }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss" src="./travel-time.scss"></style>
<script>
import Hammer from "hammerjs";
import IconTime from "@/assets/icons/IconTime.svg?inline";

export default {
  props: {
    minValue: {
      type: Number,
      default: 5
    },
    maxValue: {
      type: Number,
      default: 90
    },
    value: {
      type: Number,
      default: 45
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    range: function() {
      return this.maxValue - this.minValue;
    },
    handleOffsetX: function() {
      return ((this.value - this.minValue) * 100) / this.range;
    }
  },
  data() {
    return {
      initialOffset: undefined,
      minOffset: undefined,
      maxOffset: undefined
    };
  },
  components: {
    IconTime
  },
  mounted() {
    this.initHammer();
  },
  updated() {
    this.initHammer();
  },
  methods: {
    initHammer() {
      if (this.$refs.handle) {
        if (!this.handleHammerInstance) {
          const handleHammerInstance = Hammer(this.$refs.handle);

          handleHammerInstance
            .get("pan")
            .set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 1 });

          handleHammerInstance.on("panstart", this.onHandlePanStart);

          handleHammerInstance.on("pan", this.onHandlePan);

          handleHammerInstance.on("panend", this.onHandlePanEnd);

          this.handleHammerInstance = handleHammerInstance;
        }
      } else {
        this.handleHammerInstance = null;
      }
    },
    onHandlePanStart() {
      const handleEl = this.$refs.handle;
      const railEl = this.$refs.rail;

      this.initialOffset = handleEl.offsetLeft;
      this.minOffset = -handleEl.offsetWidth / 2;
      this.maxOffset = railEl.offsetWidth - handleEl.offsetWidth / 2;
    },

    onHandlePan(event) {
      const handleEl = this.$refs.handle;
      let newOffset = this.initialOffset + event.deltaX;

      if (newOffset <= this.minOffset) {
        newOffset = this.minOffset;
      }

      if (this.maxOffset <= newOffset) {
        newOffset = this.maxOffset;
      }

      handleEl.style.left = `${newOffset}px`;
    },

    onHandlePanEnd() {
      const handleEl = this.$refs.handle;
      const railEl = this.$refs.rail;

      const newValue =
        this.minValue +
        Math.floor(
          (this.range * (handleEl.offsetLeft + handleEl.offsetWidth / 2)) /
            railEl.offsetWidth
        );

      this.$emit("input", newValue);
    },

    onRailClick(event) {
      const railEl = this.$refs.rail;
      const width = railEl.offsetWidth;
      const offset = event.offsetX;

      const value = this.minValue + Math.round(this.range * (offset / width));

      this.$emit("input", value);
    }
  }
};
</script>
