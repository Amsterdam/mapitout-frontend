<template>
  <div class="ranges">
    <header>
      Ranges
    </header>
    <ul>
      <li v-for="range in ranges" :key="range.id" :class="{ active: range.id === activeRangeId }">
        <div class="item">
          <range
            :isDisabled="range.id !== activeRangeId"
            :value="range"
            @input="onRangeInput"
            v-on:click="onRangeClick(range.id)"
          />
          <button
            class="delete"
            v-if="ranges.length > 1 && range.id !== activeRangeId"
            @click="onClickRangeDelete(range.id)"
          >
            <icon name="delete" />
          </button>
        </div>
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
    border-bottom: 2px solid rgba($greyscale-1, 0.2);

    li {
      background-color: rgba($greyscale-1, 0.4);
      padding: 2px 0;
      min-height: 76px;

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }

      .delete {
        align-self: center;
        border: 0 none;
        background: transparent;
        outline: none;
        cursor: pointer;
        margin: 0 12px;
        padding: 0;
        color: $greyscale-1;
      }

      &:not(.active) {
        .item {
          height: auto;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          background: white;

          .range {
            flex-grow: 1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 24px 0 24px 48px;
            background-color: white;
            cursor: pointer;
            overflow: hidden;
          }
        }
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
import Range from "./Range";
import { mapActions, mapState } from "vuex";
import Icon from "./Icon";

export default {
  data() {
    return {
      activeRangeId: undefined
    };
  },
  components: {
    Range,
    Icon
  },
  computed: {
    ...mapState("ranges", {
      ranges: state => state.ranges
    })
  },
  watch: {
    ranges: function(ranges) {
      if (!ranges.find(range => range.id === this.activeRangeId) && this.ranges.length > 0) {
        this.activeRangeId = this.ranges[0].id;
      }
    }
  },
  mounted() {
    if (this.ranges.length === 0) {
      this.addRange();
      this.activeRangeId = this.ranges[0].id;
    }
  },
  methods: {
    ...mapActions("ranges", ["add", "remove", "update"]),

    onClickRangeDelete(rangeId) {
      this.remove(rangeId);
    },

    onRangeClick(rangeId) {
      this.activeRangeId = rangeId;
    },

    onRangeInput(range) {
      this.update(range);
    },

    onClickAddRange() {
      this.add();
      this.activeRangeId = this.ranges[this.ranges.length - 1].id;
    }
  }
};
</script>
