<template>
  <aside v-expandable>
    <ranges />
  </aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

aside {
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out,
    height 0.2s ease-in-out;
  overflow: hidden;

  @media (min-width: $breakpoint-tablet-portrait) {
    width: 340px;
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &.expanding {
    transition: unset;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &.expanded {
    height: 100%;
    border-top-left-radius: 0;
    border-top-right-radius: 0;

    @media (min-width: $breakpoint-tablet-portrait) {
      height: unset;
    }
  }
}

.ranges::v-deep {
  height: 74px;

  .expanded & {
    height: auto;
  }
  .expanding & {
    height: auto;
  }
  @media (min-width: $breakpoint-tablet-portrait) {
    height: auto;
  }
  ul {
    .active {
      .range {
        .travel-time {
          order: 1;

          @media (min-width: $breakpoint-tablet-portrait) {
            order: 4 !important;
          }
          .expanded &,
          .expanding & {
            order: 4;
          }
        }
      }
    }
  }
}

.handle-drag {
  position: relative;
  height: 10px;
  padding: 10px 0;
  margin: -10px 0;
  cursor: pointer;

  &::before {
    content: " ";
    position: absolute;
    z-index: 1;
    top: 10px;
    left: 0;
    display: block;
    height: 10px;
    width: 100%;
    background: $greyscale-0;
  }

  &::after {
    content: " ";
    position: relative;
    z-index: 2;
    margin: 3px auto;
    display: block;
    width: 24px;
    height: 4px;
    border-radius: 2px;
    background-color: $greyscale-1;
  }

  @media (min-width: $breakpoint-tablet-portrait) {
    display: none;
  }
}
</style>
<script>
import "../directives/expandable";
import Ranges from "./Ranges";

export default {
  components: {
    Ranges
  }
};
</script>
