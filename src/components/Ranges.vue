<template>
  <div class="ranges">
    <header>
      Ranges
    </header>
    <ul>
      <li v-for="(range, index) in ranges" :key="range.id">
        <range-input
          :isActive="index === activeRangeIndex"
          :value="range"
          @input="onRangeInput"
          @focus="onRangeFocus(index)"
        />
      </li>
    </ul>
    <button class="add-range" @click="onClickAddRange">
      New Range
    </button>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables";

.ranges {
  header {
    background-color: $greyscale-0;
    color: white;
    padding: 16px 24px;
    text-transform: uppercase;
    display: none;

    @media (min-width: $breakpoint-tablet-portrait) {
      display: block;
    }
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: rgba($greyscale-1, 0.4);
    border-bottom: 2px solid rgba($greyscale-1, 0.2);

    li {
      margin: 2px 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.add-range {
  display: block;
  margin: 72px auto 24px auto;
  border: 1px solid $greyscale-1;
  background-color: white;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
<script>
import RangeInput from "./input/RangeInput";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      activeRangeIndex: 0
    };
  },
  components: {
    RangeInput
  },
  computed: {
    ...mapState("ranges", {
      ranges: state => state.ranges
    })
  },
  mounted() {
    if (this.ranges.length === 0) {
      this.addRange();
    }
  },
  methods: {
    ...mapActions("ranges", ["addRange", "removeRange", "updateRange"]),

    onRangeFocus(index) {
      this.activeRangeIndex = index;
    },

    onRangeInput(range) {
      this.updateRange(range);
    },

    onClickAddRange() {
      this.addRange();
      this.activeRangeIndex = this.ranges.length - 1;
    }
  }
};
</script>
