import Vue from "vue";
import Router from "vue-router";

import { BASE_URL } from "./env";

import ComponentRanges from "./components/ranges/ranges.vue";
import ComponentPoiDetails from "./components/poi-details/poi-details.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      redirect: { path: "/ranges" }
    },
    {
      path: "/ranges",
      name: "ranges",
      component: ComponentRanges
    },
    {
      path: "/details/:poi",
      name: "details",
      component: ComponentPoiDetails
    }
  ]
});

export default router;
