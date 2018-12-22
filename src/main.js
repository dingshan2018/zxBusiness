import Vue from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import ScrollView from "./components/ScrollView";
import TableList from "./components/TableList";
import {
  Row,
  Col,
  NavBar,
  Button,
  List,
  Field,
  CellGroup,
  Dialog,
  Lazyload,
  Loading,
  Toast,
  Picker,
  Popup,
  Actionsheet,
  Icon
} from "vant";
import axios from "axios";
import qs from "qs";
import f2 from "@antv/f2";
import "lib-flexible";

import "../public/base.css";

/*import VConsole from "vconsole";

process.env.NODE_ENV === "development" ? new VConsole() : false;*/

Vue.config.productionTip = false;

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

Vue.component(ScrollView.name, ScrollView);
Vue.component(TableList.name, TableList);

Vue.use(Row)
  .use(Col)
  .use(NavBar)
  .use(Button)
  .use(List)
  .use(Field)
  .use(CellGroup)
  .use(Dialog)
  .use(Lazyload, {
    loading: "./img/icon__loading.svg",
    lazyComponent: true
  })
  .use(Loading)
  .use(Toast)
  .use(Picker)
  .use(Popup)
  .use(Actionsheet)
  .use(Icon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
