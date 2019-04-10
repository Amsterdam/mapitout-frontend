<template>
  <div class="panel panel-details">
    <div class="header">
      <div class="title">
        <button class="close" @click="onClickBack">
          <icon-arrow-left class="icon" />
        </button>
        <span>{{ details.name }}</span>
      </div>
    </div>
    <div class="body">
      <p v-if="details.description" class="description">{{ details.description }}</p>
      <dl class="details" v-if="details.address || details.phone || details.website">
        <dd>
          <icon-poi class="icon icon-poi" />
          <span>{{ details.address }}</span>
        </dd>
        <dd v-if="details.website">
          <icon-website class="icon icon-website" />
          <a :href="details.website" :title="details.name" target="_blank">{{ details.website }}</a>
        </dd>
        <dd v-if="details.phone">
          <icon-phone class="icon icon-phone" />
          <a :href="details.phone" :title="`Call ${details.name}`">{{ details.phone }}</a>
        </dd>
      </dl>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../style/variables.scss";

.body {
  background-color: $greyscale-2;
  margin: 24px 16px;
  padding: 16px 24px 24px 24px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.footer {
  padding: 24px;
}

.icon-poi,
.icon-website,
.icon-phone {
  color: $greyscale-1;
}

.icon-poi {
  width: 16px;
}

.icon-phone {
  width: 16px;
}

.icon-website {
  width: 16px;
}

.description {
  margin: 0;
}

.details {
  align-self: stretch;
  dd {
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 1;

    .icon {
      margin-right: 16px;
    }

    a,
    span {
      color: $greyscale-1;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
<script>
import IconArrowLeft from "../assets/icons/IconArrowLeft.svg?inline";
import IconPoi from "../assets/icons/IconPoi.svg?inline";
import IconWebsite from "../assets/icons/IconWebsite.svg?inline";
import IconPhone from "../assets/icons/IconPhone.svg?inline";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    IconArrowLeft,
    IconPhone,
    IconWebsite,
    IconPoi
  },

  computed: {
    ...mapState("locations", {
      details: "viewing"
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.lookupPoi(to.query.name);

    next();
  },

  methods: {
    ...mapActions("locations", {
      lookupPoi: "lookup"
    }),

    onClickBack() {
      this.$router.back();
    }
  }
};
</script>
