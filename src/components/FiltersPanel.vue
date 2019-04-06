<template>
  <div class="panel panel-filters">
    <div class="header">
      <div class="title">
        <icon-buildings class="icon" />
        <span>Living Essentials</span>
      </div>
      <button class="close" @click="onClickClose">
        <icon-delete class="icon" />
      </button>
    </div>
    <div class="body">
      Filters
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
</style>
<script>
import IconBuildings from "@/assets/icons/IconBuildings.svg?inline";
import IconDelete from "@/assets/icons/IconDelete.svg?inline";

export default {
  components: {
    IconBuildings,
    IconDelete
  },

  props: {
    value: Boolean
  },

  methods: {
    onClickClose() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
