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
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home
    },
    {
      path: "/profitCount",
      component: ProfitCount
    },
    {
      path: "/deviceList",
      component: DeviceList
    },
    {
      path: "/deviceRelease",
      component: DeviceRelease
    },
    {
      path: "/placeList",
      component: PlaceList
    },
    {
      path: "/adPlan",
      component: AdPlan
    },
    {
      path: "/outPaperRecord",
      component: OutPaperRecord
    }
  ]
});
