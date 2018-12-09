import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 微信用户信息
    userInfo: {},
    // 首页用户基本信息
    wxUserBaseInfo: {},
    // 首页菜单权限
    menuLimit: ""
  },
  getters: {
    userInfo: state => state.userInfo,
    wxUserBaseInfo: state => state.wxUserBaseInfo,
    menuLimit: state => state.menuLimit
  },
  mutations: {
    userInfo: (state, payload) => state.userInfo = payload,
    wxUserBaseInfo: (state, payload) => state.wxUserBaseInfo = payload,
    menuLimit: (state, payload) => state.menuLimit = payload
  },
  actions: {}
});
