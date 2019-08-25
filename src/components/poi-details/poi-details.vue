<template>
  <div class="panel-details">
    <div class="header">
      <button class="back" @click="onClickBack">
        <icon-arrow-left class="icon" />
      </button>
      <div class="title" v-if="details">
        {{ details.name }}
      </div>
    </div>
    <div class="body">
      <p class="description" v-if="!details">
        Unable to retrieve location details
      </p>
      <dl class="details" v-if="details">
        <dd>
          <span>{{ details.description }}</span>
        </dd>
        <dd>
          <icon-poi class="icon icon-poi" />
          <span>{{ details.address }}</span>
        </dd>
        <dd v-if="details.website">
          <icon-website class="icon icon-website" />
          <a :href="details.website" :title="details.name" target="_blank">{{
            details.website
          }}</a>
        </dd>
        <dd v-if="details.phone">
          <icon-phone class="icon icon-phone" />
          <a :href="details.phone" :title="`Call ${details.name}`">{{
            details.phone
          }}</a>
        </dd>
      </dl>
    </div>
  </div>
</template>
<style scoped lang="scss" src="./poi-details.scss"></style>
<script>
import IconArrowLeft from "@/assets/icons/IconArrowLeft.svg?inline";
import IconPoi from "@/assets/icons/IconPoi.svg?inline";
import IconWebsite from "@/assets/icons/IconWebsite.svg?inline";
import IconPhone from "@/assets/icons/IconPhone.svg?inline";
import { mapActions } from "vuex";

export default {
  components: {
    IconArrowLeft,
    IconPhone,
    IconWebsite,
    IconPoi
  },

  data() {
    return {
      details: null
    };
  },

  async beforeRouteUpdate(to, from, next) {
    if (to.params.poi !== from.params.poi) {
      await this.setDetails(to.params.poi);
    }

    next();
  },

  async created() {
    await this.setDetails(this.$route.params.poi);
  },

  methods: {
    ...mapActions("pois", {
      lookupPoi: "lookup"
    }),

    onClickBack() {
      this.$router.back();
    },

    async setDetails(poiName) {
      this.details = await this.lookupPoi(poiName);
    }
  }
};
</script>
