import Vue from "vue";
import Router from "vue-router";
import qs from "qs";

import store from "./store";

import RangesPanel from "./components/RangesPanel";
import DetailsPanel from "./components/DetailsPanel";
import { isEqual, pick } from "lodash-es";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: { path: "/ranges" }
    },
    {
      path: "/ranges",
      component: RangesPanel,
      beforeEnter: async (to, from, next) => {
        const queryRanges = Object.values(qs.parse(to.query.ranges)).map(range => ({
          id: parseInt(range.id),
          travelTime: parseInt(range.tt),
          originId: range.oId,
          originTypeId: parseInt(range.otId),
          transportTypeId: parseInt(range.ttId),
          departureTime: new Date(parseInt(range.t)).toISOString()
        }));

        const storeRanges = store.state.ranges.ranges.map(range =>
          pick(range, [
            "id",
            "travelTime",
            "originId",
            "originTypeId",
            "transportTypeId",
            "departureTime"
          ])
        );

        if (!isEqual(queryRanges, storeRanges)) {
          await store.dispatch("ranges/replace", queryRanges);
        } else {
          next();
        }
      }
    },
    {
      path: "/details",
      component: DetailsPanel,
      beforeEnter: async (to, from, next) => {
        await store.dispatch("locations/lookup", to.query.name);

        next();
      }
    }
  ]
});

export default router;
