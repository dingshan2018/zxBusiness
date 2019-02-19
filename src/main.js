import Vue from "vue";
import router from "./router";
import App from "./App.vue";
import TableList from "./components/TableList";
import PageView from "./components/PageView";
import PageScroll from "./components/PageScroll";
import Vant from "vant";
import "vant/lib/index.css";
import axios from "axios";
import qs from "qs";
import f2 from "@antv/f2";
import "lib-flexible";
import "@/assets/css/base.css";

Vue.config.productionTip = false;
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$f2 = f2;
Vue.prototype.$util = {
  getUrlParam (paramKey) {
    // 参数正则
    let reg = new RegExp("(^|&)" + paramKey + "=([^&]*)(&|$)", "i");
    // 匹配参数
    let result = window.location.search.substr(1).match(reg) ||
      window.location.hash.split("?")[1] && window.location.hash.split("?")[1].match(reg);

    return result ? decodeURIComponent(result[2]) : null;
  }
};

Vue.component(TableList.name, TableList);
Vue.component(PageView.name, PageView);
Vue.component(PageScroll.name, PageScroll);

Vue.use(Vant);

new Vue({
  router,
  // store,
  render: h => h(App),
  created () {
    // 刷新
    if (this.$route.path !== "/" && this.$route.path !== "/login")
      return location.href = "/";
    // 微信用户信息
    localStorage.userInfo = JSON.stringify({});
    // 首页用户基本信息
    localStorage.wxUserBaseInfo = JSON.stringify({});
    // 首页菜单权限
    localStorage.menuLimit = "";
  }
}).$mount("#app");
