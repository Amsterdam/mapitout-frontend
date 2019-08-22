import Vue from "vue";
import browserDetect from "vue-browser-detect-plugin";

import "./registerServiceWorker";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(browserDetect);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
