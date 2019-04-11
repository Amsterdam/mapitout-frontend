import Vue from "vue";
import Router from "vue-router";
import qs from "qs";

import store from "./store";

import RangesPanel from "./components/RangesPanel";
import DetailsPanel from "./components/DetailsPanel";

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

router.onReady(async () => {
  const url = new URL(window.location);

  const ranges = Object.values(qs.parse(url.searchParams.get("ranges"))).map((range, index) => ({
    ...range,
    id: `range-${index}`,
    travelTime: parseInt(range.travelTime),
    originLat: parseFloat(range.originLat),
    originLng: parseFloat(range.originLng)
  }));

  const selectedFilters = Object.values(qs.parse(url.searchParams.get("filters"))).map(filterId =>
    parseInt(filterId)
  );

  const filters = store.state.filters.filters.map(filter => ({
    ...filter,
    selected: selectedFilters.includes(filter.id)
  }));

  store.replaceState({
    ...store.state,
    ranges: {
      ...store.state.ranges,
      ranges
    },
    filters: {
      ...store.state.filters,
      filters
    }
  });
});

export default router;
