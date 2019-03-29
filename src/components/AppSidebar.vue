<template>
  <aside v-expandable>
    <nav class="tabs">
      <ul>
        <li>
          <router-link :to="{ name: 'ranges' }" exact>
            <icon-area class="icon"></icon-area>
            <span>Range</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <router-view />
  </aside>
</template>
<style scoped lang="scss">
@import "../style/variables";

aside {
  background: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: border-top-left-radius 0.2s ease-in-out, border-top-right-radius 0.2s ease-in-out,
    height 0.2s ease-in-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 74px;

  @media (min-width: $breakpoint-tablet-portrait) {
    width: 340px;
    overflow: visible;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    height: auto;
  }

  &.expanding {
    transition: unset;
    height: auto;
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

.tabs {
  background-color: $greyscale-0;

  ul {
    list-style: none;
    padding: 0 32px;
    height: 50px;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    li {
      flex-basis: 50%;
      margin: 0 12px;
      height: 36px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-decoration: none;
        background-color: transparent;

        .icon {
          color: white;
          width: 16px;
          height: 16px;
        }

        span {
          color: white;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 12px;
          margin-left: 12px;
        }

        &:hover {
          cursor: pointer;

          .icon {
            color: $greyscale-2;
          }

          span {
            color: $greyscale-2;
          }
        }

        &.router-link-active {
          background-color: $greyscale-2;
          cursor: default;

          .icon {
            color: $greyscale-0;
          }

          span {
            color: $greyscale-0;
          }

          &:hover {
            cursor: default;

            .icon {
              color: $greyscale-0;
            }

            span {
              color: $greyscale-0;
            }
          }
        }
      }
    }
  }
}

.ranges::v-deep {
  box-shadow: 0 2px 8px 0 lighten($greyscale-1, 50);

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
  height: 12px;
  padding: 12px 0;
  margin: -12px 0;
  cursor: pointer;

  &::before {
    content: " ";
    position: absolute;
    z-index: 1;
    top: 12px;
    left: 0;
    display: block;
    height: 12px;
    width: 100%;
    background: $greyscale-0;
  }

  &::after {
    content: " ";
    position: relative;
    z-index: 2;
    margin: 4px auto auto auto;
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
import IconArea from "../assets/icons/IconArea.svg";

export default {
  components: {
    IconArea
  }
};
</script>
