<template>
  <div class="filter" @click="$emit('click')">
    <span class="name">{{ filterName }}</span>
    <button class="toggle" :class="{ selected: isSelected }" @click="onClickToggle"></button>
  </div>
</template>
<style lang="scss" scoped>
@import "../../style/variables.scss";

.filter {
  display: flex;
  align-items: center;
}

.name {
  flex-grow: 1;
}

.toggle {
  position: relative;
  height: 28px;
  width: 50px;
  border: 0 none;
  background-color: $greyscale-2;
  outline: none;
  cursor: pointer;
  border-radius: 14px;
  transition: background-color 0.1s ease-in-out;

  &::after {
    content: " ";
    display: block;
    background-color: white;
    width: 22px;
    height: 22px;
    border-radius: 11px;
    position: absolute;
    left: 3px;
    top: 3px;
    transition: transform 0.1s ease-in-out;
  }

  &.selected {
    background-color: $greyscale-1;

    &::after {
      transform: translateX(22px);
    }
  }
}
</style>
<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      filterName: this.value.name,
      filterValue: this.value.value,
      filterCategory: this.value.category,
      isSelected: this.value.selected
    };
  },

  methods: {
    onClickToggle(event) {
      event.stopPropagation();

      this.$emit("input", {
        ...this.value,
        selected: !this.isSelected
      });
    }
  }
};
</script>
