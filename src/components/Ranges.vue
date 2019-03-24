<template>
  <div class="ranges">
    <ul>
      <li v-for="(range, index) in ranges" :key="index">
        <range-input
          :isActive="index === activeRangeIndex"
          v-model="ranges[index]"
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
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: rgba($greyscale-1, 0.4);

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
  methods: {
    ...mapActions("ranges", ["addRange", "removeRange", "updateRange"]),

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
