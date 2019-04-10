import Vue from "vue";
import Router from "vue-router";
import RangesPanel from "./components/RangesPanel";
import DetailsPanel from "./components/DetailsPanel";
import store from "./store";

Vue.use(Router);

export default new Router({
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
