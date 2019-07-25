<template>
  <nav class="nav">
    <ul class="tabs">
      <li class="tab">
        <router-link :to="{ path: '/ranges' }" class="link">
          <icon-area class="icon"></icon-area>
          <span>Range</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<style scoped lang="scss" src="./navigation.scss"></style>
<script>
import IconArea from "@/assets/icons/IconArea.svg?inline";

export default {
  components: {
    IconArea
  }
};
</script>
