import Vue from "vue";
import Router from "vue-router";

import store from "./store";

import RangesPanel from "./components/RangesPanel";
import DetailsPanel from "./components/DetailsPanel";
import qs from "qs";
import { isEqual } from "lodash-es";

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
      component: RangesPanel
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

router.beforeEach(async (to, from, next) => {
  const ranges = Object.values(qs.parse(to.query.r)).map(range => ({
    id: parseInt(range.id),
    originTypeId: parseInt(range.otId),
    originId: range.oId,
    origin: range.o,
    transportTypeId: parseInt(range.ttId),
    travelTime: parseInt(range.tt),
    departureTime: new Date(parseInt(range.t)).toISOString()
  }));

  // if (ranges[0] && store.state.ranges.ranges[0]) {
  //   console.log(ranges[0].transportTypeId, store.state.ranges.ranges[0].transportTypeId);
  // }

  if (!isEqual(ranges, store.state.ranges.ranges)) {
    await store.dispatch("ranges/replace", ranges);
  }

  next();
});

export default router;
