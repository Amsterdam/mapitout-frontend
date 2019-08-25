<template>
  <div class="filter-group" :class="{ collapsed: !expanded }">
    <button class="toggle-expand" @click="onClickExpand">
      <component :is="group.iconComponent" class="icon" />
      <span class="name">{{ group.name }}</span>
      <caret-down class="icon-toggle" />
    </button>
    <ul class="group" v-if="expanded">
      <li class="item" v-for="filter in group.children" :key="filter.value">
        <component-filter :filter="filter" />
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss" src="./filter-group.scss"></style>
<script>
import IconBus from "@/assets/icons/IconBus.svg?inline";
import IconTrain from "@/assets/icons/IconTrain.svg?inline";
import IconTram from "@/assets/icons/IconTram.svg?inline";
import IconSubway from "@/assets/icons/IconSubway.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import CaretDown from "@/assets/CaretDown.svg?inline";

import ComponentFilter from "./filter.vue";

export default {
  components: {
    IconBus,
    IconTrain,
    IconTram,
    IconSubway,
    IconEducation,
    CaretDown,
    ComponentFilter
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      expanded: false
    };
  },

  methods: {
    onClickExpand() {
      this.expanded = !this.expanded;
    }
  }
};
</script>
