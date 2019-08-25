<template>
  <div class="range-summary" @click="onClickComponent(rangeParams.id)">
    <div class="values">
      <component
        class="location-type"
        :is="getOriginIconComponentByOriginTypeId(rangeParams.originTypeId)"
      />
      <div class="location-address">
        {{ rangeParams.origin || "Adress..." }}
      </div>
      <component
        class="transport-method"
        :is="
          getTransportTypeIconComponentByValue(rangeParams.transportTypeValue)
        "
      />
      <span class="travel-time">{{ rangeParams.travelTime }}m</span>
    </div>
    <button class="delete" @click.stop="onClickRemove">
      <icon-delete class="icon" />
    </button>
  </div>
</template>
<style lang="scss" src="./range-summary.scss"></style>
<script>
import { mapGetters, mapActions } from "vuex";

import IconDelete from "@/assets/icons/IconDelete.svg?inline";
import IconHome from "@/assets/icons/IconHome.svg?inline";
import IconTransport from "@/assets/icons/IconBus.svg?inline";
import IconHealth from "@/assets/icons/IconHealth.svg?inline";
import IconWork from "@/assets/icons/IconWork.svg?inline";
import IconEducation from "@/assets/icons/IconEducation.svg?inline";
import IconWellness from "@/assets/icons/IconWellness.svg?inline";
import IconTransportBicycle from "@/assets/icons/IconTransportBicycle.svg?inline";
import IconTransportBicycleBus from "@/assets/icons/IconTransportBicycleBus.svg?inline";
import IconTransportBus from "@/assets/icons/IconTransportBus.svg?inline";
import IconTransportCar from "@/assets/icons/IconTransportCar.svg?inline";
import IconTransportPedestrian from "@/assets/icons/IconTransportPedestrian.svg?inline";

export default {
  components: {
    IconHome,
    IconTransport,
    IconHealth,
    IconWork,
    IconEducation,
    IconWellness,
    IconDelete,
    IconTransportBicycle,
    IconTransportBicycleBus,
    IconTransportBus,
    IconTransportCar,
    IconTransportPedestrian
  },
  props: {
    rangeParams: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters("addresses", {
      getOriginIconComponentByOriginTypeId: "getAddressIconComponentByTypeId"
    }),
    ...mapGetters("transports", ["getTransportTypeIconComponentByValue"])
  },
  methods: {
    ...mapActions("ranges", {
      removeRangeParams: "removeParams",
      selectRange: "selectId"
    }),

    onClickComponent(id) {
      this.selectRange(id);
    },

    onClickRemove() {
      this.removeRangeParams(this.rangeParams.id);
    }
  }
};
</script>
