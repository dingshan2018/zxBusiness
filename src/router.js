import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import ProfitCount from "./views/ProfitCount.vue";
import ReplaceBoard from "./views/ReplaceBoard.vue";
import DeviceList from "./views/DeviceList.vue";
import DeviceRelease from "./views/DeviceRelease.vue";
import PlaceList from "./views/PlaceList.vue";
import OutPaperRecord from "./views/OutPaperRecord.vue";
import AdPlan from "./views/AdPlan.vue";
import Error from "./views/Error.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/Home",
      name: "Home",
      components: {
        mainKeep: Home
      }
    },
    {
      path: "/ProfitCount",
      name: "ProfitCount",
      components: {
        sub: ProfitCount
      }
    },
    {
      path: "/ReplaceBoard",
      name: "ReplaceBoard",
      components: {
        sub: ReplaceBoard
      }
    },
    {
      path: "/DeviceList",
      name: "DeviceList",
      components: {
        sub: DeviceList
      }
    },
    {
      path: "/DeviceRelease",
      name: "DeviceRelease",
      components: {
        sub: DeviceRelease
      }
    },
    {
      path: "/PlaceList",
      name: "PlaceList",
      components: {
        sub: PlaceList
      }
    },
    {
      path: "/AdPlan",
      name: "AdPlan",
      components: {
        sub: AdPlan
      }
    },
    {
      path: "/OutPaperRecord",
      name: "OutPaperRecord",
      components: {
        sub: OutPaperRecord
      }
    },
    {
      path: "/",
      name: "Null",
      redirect: "/Home"
    },
    {
      path: "/Error",
      name: "Error",
      // redirect: '/Login'
      components: {
        sub: Error
      }
    }
  ]
});
