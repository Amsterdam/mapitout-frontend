<template>
  <div class="ranges">
    <header>
      Ranges
    </header>
    <ul>
      <li v-for="(range, index) in ranges" :key="index">
        <range-input
          :isActive="index === activeRangeIndex"
          :value="ranges[index]"
          @focus="onRangeFocus(index)"
          @input="onRangeInput(index, $event)"
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
import { isEqual, omit } from "lodash";

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
  watch: {
    ranges: function(newValue, oldValue) {
      console.log(newValue[0].transportType, oldValue[0].transportType);
      if (
        isEqual(
          newValue.map(range => omit(range, ["originType"])),
          oldValue.map(range => omit(range, ["originType"]))
        )
      ) {
        this.fetchAreas();
      }
    }
  },
  methods: {
    ...mapActions("ranges", ["addRange", "removeRange", "updateRange", "fetchAreas"]),

    onRangeFocus(index) {
      this.activeRangeIndex = index;
    },

    onRangeInput(index, value) {
      this.updateRange({ index, range: value });
    },

    onClickAddRange() {
      this.addRange();
      this.activeRangeIndex = this.ranges.length - 1;
    }
  }
};
</script>
