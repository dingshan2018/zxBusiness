import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import ProfitCount from "./views/ProfitCount.vue";
import DeviceList from "./views/DeviceList.vue";
import DeviceRelease from "./views/DeviceRelease.vue";
import PlaceList from "./views/PlaceList.vue";
import OutPaperRecord from "./views/OutPaperRecord.vue";
import AdPlan from "./views/AdPlan.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/Login",
      component: Login
    },
    {
      path: "/Home",
      component: Home
    },
    {
      path: "/ProfitCount",
      component: ProfitCount
    },
    {
      path: "/DeviceList",
      component: DeviceList
    },
    {
      path: "/DeviceRelease",
      component: DeviceRelease
    },
    {
      path: "/PlaceList",
      component: PlaceList
    },
    {
      path: "/AdPlan",
      component: AdPlan
    },
    {
      path: "/OutPaperRecord",
      component: OutPaperRecord
    }
  ]
});
