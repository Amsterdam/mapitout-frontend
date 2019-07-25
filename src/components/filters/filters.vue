<template>
  <div class="panel-filters">
    <div class="header">
      <div class="title">
        <button class="back" v-if="rootFilter !== null" @click="onClickBack">
          <icon-arrow-left class="icon" />
        </button>
        <icon-filters class="icon icon-filters" />
        <span>{{ rootFilter === null ? "Filters" : rootFilter.name }}</span>
      </div>
    </div>
    <div class="body">
      <ul class="items">
        <li class="item" v-for="item in filtersForRoot" :key="item.name">
          <component-filter-group v-if="item.isGroup" :group="item" />
          <component-filter v-if="item.isFilter" :filter="item" />
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped src="./filters.scss"></style>
<script>
import { mapActions, mapState, mapMutations } from "vuex";

import IconFilters from "@/assets/icons/IconFilters.svg?inline";
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";

import ComponentFilter from "./filter.vue";
import ComponentFilterGroup from "./filter-group.vue";

export default {
  components: {
    ComponentFilter,
    ComponentFilterGroup,
    IconFilters,
    IconArrowLeft
  },

  props: {
    value: Boolean
  },

  computed: {
    ...mapState("filters", {
      rawFilters: "filters",
      rootFilter: "rootFilter"
    }),

    filtersForRoot: function() {
      const parentId = this.rootFilter === null ? 0 : this.rootFilter.id;

      const childFilters = this.rawFilters.filter(
        filter => filter.parentId === parentId
      );

      const filters = childFilters
        .filter(filter => typeof filter.group === "undefined")
        .map(filter => ({ ...filter, isFilter: true }));

      const groups = childFilters
        .filter(filter => typeof filter.group !== "undefined")
        .reduce((acc, filter) => {
          if (typeof acc[filter.group] === "undefined") {
            acc[filter.group] = {
              name: filter.group,
              iconComponent: filter.iconComponent,
              isGroup: true,
              children: [filter]
            };
          } else {
            acc[filter.group].children.push(filter);
          }
          return acc;
        }, {});

      return filters
        .concat(Object.values(groups))
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  },

  methods: {
    ...mapActions("filters", {
      updateFilters: "update"
    }),

    ...mapMutations("filters", ["setRootFilter"]),

    onClickBack() {
      this.setRootFilter(null);
    }
  }
};
</script>
