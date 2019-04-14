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
      path: "/details/:poi",
      name: "details",
      component: DetailsPanel
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

  const filters = Object.values(qs.parse(to.query.f)).map(selectedFilterId =>
    parseInt(selectedFilterId)
  );

  if (!isEqual(ranges, store.state.ranges.ranges.filter(range => range.originId))) {
    await store.dispatch("ranges/replace", ranges);
  }

  if (
    !isEqual(
      filters,
      store.state.filters.filters.filter(filter => filter.selected).map(filter => filter.id)
    )
  ) {
    await store.dispatch("filters/select", filters);
  }

  next();
});

export default router;
