<template>
  <div class="filter">
    <component :is="filter.iconComponent" class="icon" />
    <button class="name" v-if="hasChildren(filter.id)" @click="onClickName">
      {{ filter.name }}
    </button>
    <span class="name" v-else>{{ filter.name }}</span>
    <button
      class="toggle"
      :class="{ selected: filter.selected }"
      @click="onClickToggle"
    ></button>
  </div>
</template>
<style lang="scss" scoped src="./filter.scss"></style>
<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

import IconBus from "@/assets/icons/IconBus.svg?inline";
import IconTrain from "@/assets/icons/IconTrain.svg?inline";
import IconTram from "@/assets/icons/IconTram.svg?inline";
import IconSubway from "@/assets/icons/IconSubway.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";

export default {
  components: {
    IconBus,
    IconTrain,
    IconTram,
    IconSubway,
    IconEducation
  },

  props: {
    filter: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters("filters", ["hasChildren"])
  },

  methods: {
    ...mapActions("filters", {
      toggleFilter: "toggle"
    }),
    ...mapMutations("filters", ["setRootFilter"]),

    onClickToggle() {
      this.toggleFilter(this.filter);
    },

    onClickName() {
      this.setRootFilter(this.filter);
    }
  }
};
</script>
