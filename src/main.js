import Vue from "vue";
import { sync } from "vuex-router-sync";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { isEqual } from "lodash-es";

Vue.config.productionTip = false;

sync(store, router);

store.watch(
  state => state.filters.filters,
  filters => {
    const selectedFilterIds = filters.filter(filter => filter.selected).map(filter => filter.id);

    router.push({
      query: {
        ...router.currentRoute.query,
        filters: selectedFilterIds.length > 0 ? selectedFilterIds.join(",") : undefined
      }
    });
  }
);

store.watch(
  state => state.ranges.ranges,
  ranges => {
    const definedRanges = ranges.filter(range => range.originLat && range.originLng);

    router.push({
      query: {
        ...router.currentRoute.query,
        range: definedRanges.length > 0 ? definedRanges.map(range => range.id) : undefined
      }
    });
  }
);

router.beforeEach((to, from, next) => {
  if (!isEqual(to.query, from.query)) {
    try {
      const queryFilterIds = to.query.filters.split(",").map(filterId => parseInt(filterId));
      const storeFilterIds = store.state.filters.filters
        .filter(filter => filter.selected)
        .map(filter => filter.id);

      if (!isEqual(queryFilterIds, storeFilterIds)) {
        store.commit(
          "filters/update",
          store.state.filters.filters.map(filter => {
            return { ...filter, selected: queryFilterIds.includes(filter.id) };
          })
        );
      }

      const ranges = to.query.range;

      console.log(ranges);
    } catch (e) {
      console.log(e);
    }

    return next();
  }

  return next(false);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
