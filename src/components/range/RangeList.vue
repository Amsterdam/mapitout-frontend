<template>
  <div class="range-list">
    <ul class="list">
      <li
        class="item"
        v-for="range in ranges"
        :key="range.id"
        :class="{ active: range.id === activeRangeId }"
        @click="onRangeClick(range.id)"
      >
        <range :isDisabled="range.id !== activeRangeId" :value="range" @input="onInputRange" />
        <div class="controls">
          <button
            class="delete"
            v-if="range.id !== activeRangeId"
            @click="onClickRangeDelete(range.id, $event)"
          >
            <icon-delete class="icon" />
          </button>
        </div>
      </li>
    </ul>
    <button class="add" @click="onClickAddRange" v-if="ranges.length < 3">
      New Range
    </button>
  </div>
</template>
<style scoped lang="scss">
@import "../../style/variables";

.range-list {
  overflow: scroll;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.item {
  border-color: rgba($greyscale-1, 0.4);
  border-style: solid;
  border-width: 2px 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  &:first-child {
    border-top-width: 0;
  }

  &:last-child {
    border-bottom-width: 0;
  }

  .range {
    flex-grow: 1;
  }

  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .delete {
    border: 0 none;
    background: transparent;
    outline: none;
    cursor: pointer;
    margin: 0 12px;
    padding: 0;

    .icon {
      display: block;
      width: 16px;
      height: 16px;
      color: lighten($greyscale-1, 25);
    }

    &:hover {
      .icon {
        color: $greyscale-1;
      }
    }
  }

  &.active {
    height: auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background: white;
  }

  &:not(.active) {
    .range {
      flex-grow: 1;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: white;
      cursor: pointer;
      overflow: hidden;
    }
  }
}

.add {
  display: block;
  margin: 72px auto 24px auto;
  border: 1px solid lighten($greyscale-1, 25);
  background-color: white;
  padding: 8px 16px;
  cursor: pointer;
  color: lighten($greyscale-1, 25);

  &:hover {
    color: $greyscale-1;
    border-color: $greyscale-1;
  }
}
</style>
<script>
import Range from "./Range";
import { mapActions, mapState } from "vuex";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";

export default {
  components: {
    Range,
    IconDelete
  },
  computed: {
    ...mapState("ranges", {
      ranges: state => state.ranges,
      activeRangeId: state => state.activeId
    })
  },
  async mounted() {
    const ranges = this.ranges;
    let rangeId;

    if (ranges.length === 0) {
      rangeId = await this.addRange(Range.props.value.default());
    } else {
      rangeId = ranges[ranges.length - 1].id;
    }

    this.activateRange(rangeId);
  },
  methods: {
    ...mapActions("ranges", {
      addRange: "add",
      updateRange: "update",
      removeRange: "remove",
      activateRange: "activate"
    }),

    onClickRangeDelete(rangeId, event) {
      event.stopPropagation();

      this.removeRange(rangeId);
    },

    onRangeClick(rangeId) {
      if (this.activeRangeId !== rangeId) {
        this.activateRange(rangeId);
      }
    },

    async onClickAddRange() {
      const rangeId = await this.addRange(Range.props.value.default());

      this.activateRange(rangeId);
    },

    onInputRange(range) {
      this.updateRange(range);
    }
  }
};
</script>
