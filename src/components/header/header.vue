<template>
  <header>
    <router-link to="/" class="logo">
      <icon-logo class="icon"></icon-logo>
      <span class="text-map">map</span>
      <span class="text-it">it</span>
      <span class="text-out">out</span>
    </router-link>
    <button class="filters-toggle" @click="onClickFiltersToggle">
      <span>Living Essentials</span>
      <icon-filters class="icon" />
    </button>
    <a
      class="iamsterdam"
      href="https://www.iamsterdam.com/en/living/about-living-in-amsterdam/living-in-the-amsterdam-area"
      title="Living in the Amsterdam Area | I amsterdam"
    >
      <img
        src="../../assets/iamsterdam-tablet-landscape.png"
        alt="Living in the Amsterdam Area | I amsterdam"
        srcset="
          ../../assets/iamsterdam-mobile.png           105w,
          ../../assets/iamsterdam-tablet-landscape.png 179w
        "
        sizes="(min-width: 769px) 179px, 105px"
      />
    </a>
  </header>
</template>
<style scoped lang="scss" src="./header.scss"></style>
<script>
import IconLogo from "@/assets/logo.svg?inline";
import IconFilters from "@/assets/icons/IconFilters.svg?inline";

export default {
  components: {
    IconLogo,
    IconFilters
  },
  props: {
    value: Boolean
  },
  methods: {
    onClickFiltersToggle() {
      this.$emit("input", !this.value);
    }
  }
};
</script>
