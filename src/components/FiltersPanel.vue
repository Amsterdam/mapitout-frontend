<template>
  <div class="panel panel-filters">
    <div class="header">
      <div class="title">
        <icon-arrow-left class="icon" v-if="viewing" @click="onClickBack" />
        <icon-buildings class="icon" v-if="!viewing" />
        <span>{{ viewing ? viewing.name : "Living Essentials" }}</span>
      </div>
      <button class="close" @click="onClickClose">
        <icon-delete class="icon" />
      </button>
    </div>
    <div class="body">
      <div v-if="groups.length === 1">
        <ul class="filter-list">
          <li class="item" v-for="filter in groups[0][1]" :key="filter.value">
            <filter-item
              :value="filter"
              @click="onFilterItemClick(filter)"
              @input="onFilterToggle"
            />
          </li>
        </ul>
      </div>
      <div v-else>
        <ul class="group-list">
          <li class="group" v-for="group in groups" :key="group[0]">
            <button class="group-toggle" @click="visibleGroup = group[0]">{{ group[0] }}</button>
            <ul class="filter-list" v-if="visibleGroup === group[0]">
              <li class="item" v-for="filter in group[1]" :key="filter.value">
                <filter-item
                  :value="filter"
                  @click="onFilterItemClick(filter)"
                  @input="onFilterToggle"
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../style/variables.scss";

.close {
  border: 0 none;
  outline: none;
  background-color: transparent;

  .icon {
    color: $greyscale-2;
    width: 16px;
    height: 16px;
  }
  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}

.body {
  padding: 24px;
}

.filter-list,
.group-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
<script>
import IconBuildings from "@/assets/icons/IconBuildings.svg?inline";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";
import { mapActions, mapGetters } from "vuex";
import FilterItem from "./filter/FilterItem";

export default {
  components: {
    IconBuildings,
    IconDelete,
    IconArrowLeft,
    FilterItem
  },

  props: {
    value: Boolean
  },

  computed: {
    ...mapGetters("filters", ["getGroupsByParent"])
  },

  data() {
    return {
      visibleGroup: "",
      viewing: null,
      groups: []
    };
  },

  mounted() {
    this.groups = this.getGroupsByParent(this.viewing);
  },

  watch: {
    viewing: function(filter) {
      this.groups = this.getGroupsByParent(filter);
    }
  },

  methods: {
    ...mapActions("filters", ["toggle"]),

    onClickClose() {
      this.$emit("input", !this.value);
    },

    onClickBack() {
      this.viewing = null;
    },

    onFilterItemClick(filter) {
      if (filter.children) {
        this.viewing = filter;
      }
    },

    onFilterToggle(filter) {
      this.toggle(filter);
    }
  }
};
</script>
