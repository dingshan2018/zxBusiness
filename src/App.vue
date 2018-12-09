<template>
  <div id="app" v-cloak @touchmove.stop.prevent>

    <!-- 页面缓存 -->
    <transition name="van-fade" mode="out-in">
      <keep-alive>
        <router-view name="mainKeep"/>
      </keep-alive>
    </transition>

    <!-- 页面不缓存 -->
    <transition name="van-fade" mode="out-in">
      <router-view name="sub"/>
    </transition>

  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";

  export default {
    name: "App",
    computed: mapGetters(["userInfo"]),
    methods: {
      ...mapMutations({
        setUserInfo: "userInfo",
        setWxUserBaseInfo: "wxUserBaseInfo",
        setMenuLimit: "menuLimit"
      }),
      // 微信用户信息
      getWxUserInfo () {
        let _this = this;
        let accessCode = _this.$util.getUrlParam("code");

        // 未授权
        if (!accessCode) {
          //获取授权code的回调地址，获取到code，直接返回到当前页
          location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4e2cf38426225453&redirect_uri=" +
            encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect";
        }
        else {
          _this.$axios.get("/wx/userInfo", {
            params: {
              code: accessCode,
              state: 0
            }
          }).then(function (response) {
            let data = response.data;

            // 用户信息
            if (data && data.userInfo) {
              _this.setUserInfo(data.userInfo);
              _this.login();

            } else {
              _this.$router.push("/Error");

            }
          }).catch(function (error) {
            _this.$router.push("/Error");

          });
        }
      },
      // 登录
      login () {
        let _this = this;

        _this.$axios.post("/wxLogin", _this.$qs.stringify({
          //  || "ohZpd0tPFpAeGZweVQEuinaa5H8M"
          openId: _this.userInfo.openId || "ohZpd0tPFpAeGZweVQEuinaa5H8M"
        }))
          .then(function (response) {
            let data = response.data;

            if (data && data.code === 0) {
              // 菜单权限
              // _this.setMenuLimit(data.msg ? data.msg.toString() : "");
              _this.setMenuLimit(
                "settle:userIncome:view,business:place:view,business:device:view,advertise:adSchedule:view,business:tissueRecord:view,business:device:view");
              // 用户头像、名字
              _this.setWxUserBaseInfo({
                name: data.name,
                headImg: data.headImg
              });
              // 路由跳转
              _this.$router.push("/Home");
            }
            else {
              _this.$router.push("/Error");
            }

          }).catch(function (error) {

        });
      }
    },
    created () {
      // this.getWxUserInfo();
      this.login();
    }
  };
</script>

<style lang="less">
  .input-group {
    margin-top: 40px;

    .van-field {
      width: calc(100% - 10px);
      margin-left: 10px;
    }
  }
</style>
