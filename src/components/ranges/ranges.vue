<template>
  <div class="panel-ranges">
    <div class="body">
      <ul class="ranges">
        <li
          v-for="rangeParams in rangesParams"
          :key="rangeParams.id"
          :class="['item', { active: rangeParams.id === selectedRangeId }]"
        >
          <component-range-edit
            v-if="rangeParams.id === selectedRangeId"
            :class="{ defined: !!rangeParams.originId }"
            :rangeParams="rangeParams"
          />
          <component-range-summary
            v-if="rangeParams.id !== selectedRangeId"
            :rangeParams="rangeParams"
          />
        </li>
      </ul>
      <div class="footer" v-if="rangesParams.length < 3">
        <button class="add" @click="onClickAdd">
          New Range
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss" src="./ranges.scss"></style>
<script>
import { mapActions, mapState } from "vuex";

import ComponentRangeEdit from "./range-edit.vue";
import ComponentRangeSummary from "./range-summary.vue";

export default {
  components: {
    ComponentRangeEdit,
    ComponentRangeSummary
  },

  computed: {
    ...mapState("ranges", {
      rangesParams: state => state.params,
      selectedRangeId: state => state.selectedId
    })
  },

  methods: {
    ...mapActions("ranges", {
      addRangeParams: "addParams"
    }),

    onClickAdd() {
      this.addRangeParams();
    }
  }
};
</script>
