<template>
  <div id="app">
    <component-header class="app-header" v-model="filtersExpanded" />
    <main>
      <component-map class="app-map" />
      <aside
        v-expandable="{
          expandedPropName: 'sidebarExpanded',
          expandingPropName: 'sidebarExpanding'
        }"
        ref="sidebar"
        :class="[
          'expandable',
          'sidebar',
          { expanded: sidebarExpanded, expanding: sidebarExpanding }
        ]"
      >
        <div class="main">
          <component-navigation class="nav" v-if="$route.name !== 'details'" />
          <router-view :class="{ collapsed: !sidebarExpanded }" />
        </div>
        <component-filters />
      </aside>
      <aside
        v-expandable="{
          expandedPropName: 'filtersExpanded',
          expandingPropName: 'filtersExpanding'
        }"
        ref="filtersMobile"
        :class="[
          'expandable',
          'filters-mobile',
          { expanded: filtersExpanded, expanding: filtersExpanding }
        ]"
      >
        <component-filters />
      </aside>
    </main>
  </div>
</template>
<style>
@import "~normalize.css";
</style>
<style lang="scss">
@import "style/typography.scss";
</style>
<style scoped lang="scss" src="./App.scss"></style>
<script>
import "./directives/expandable";
import ComponentHeader from "./components/header/header.vue";
import ComponentMap from "./components/map/map.vue";
import ComponentNavigation from "./components/navigation/navigation.vue";
import ComponentFilters from "./components/filters/filters.vue";

export default {
  components: {
    ComponentHeader,
    ComponentMap,
    ComponentNavigation,
    ComponentFilters
  },

  data() {
    return {
      filtersExpanded: false,
      filtersExpanding: false,
      sidebarExpanded: false,
      sidebarExpanding: false
    };
  }
};
</script>
