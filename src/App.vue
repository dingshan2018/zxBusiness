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
              _this.$dialog.alert({
                title: "系统出错",
                message: "系统正在维护，请稍候再试"
              }).then(function () {
                WeixinJSBridge.call("closeWindow");
              });
              _this.$router.push("/Error");
            }
          }).catch(function (error) {
            _this.$dialog.alert({
              title: "系统出错",
              message: "系统正在维护，请稍候再试"
            }).then(function () {
              WeixinJSBridge.call("closeWindow");
            });
            _this.$router.push("/Error");
          });
        }
      },
      // 登录
      login () {
        let _this = this;
        _this.$axios.post("/api/wxLogin", _this.$qs.stringify({
          //  || "ohZpd0tPFpAeGZweVQEuinaa5H8M"
          openId: _this.userInfo.openId
        }), {
          withCredentials: true
        })
          .then(function (response) {
            let data = response.data;

            if (data && data.code === 0) {
              // 菜单权限
              _this.setMenuLimit(data.msg ? data.msg.toString() : "");
              // _this.setMenuLimit(
              //   "settle:userIncome:view,business:place:view,business:device:view,advertise:adSchedule:view,business:tissueRecord:view,business:device:view");
              // 用户头像、名字
              _this.setWxUserBaseInfo({
                name: data.name,
                headImg: data.headImg
              });
              // 路由跳转
              _this.$router.push("/Home");
            }
            else {
              _this.$dialog.alert({
                title: "系统",
                message: "您的微信未绑定智媒纸巾管理员，请联系管理员注册加入鼎善智媒纸巾机项目"
              }).then(function () {
                WeixinJSBridge.call("closeWindow");
              });
              _this.$router.push("/Error");
            }

          }).catch(function (error) {
          _this.$dialog.alert({
            title: "系统出错",
            message: "系统正在维护，请稍候再试"
          }).then(function () {
            WeixinJSBridge.call("closeWindow");
          });
        });
      }
    },
    created () {
      this.getWxUserInfo();
      // this.login();
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

  .block__model-title {
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    font-weight: 600;
    background-color: #f6f6f6;
  }

  .block__loading {
    z-index: 10;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url("./assets/img/icon__loading.svg") no-repeat center center/100% 15px #fff;
  }

  .block__null {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    background: url("./assets/img/icon__null.svg") no-repeat center 70px/ auto 200px #fff;

    .block__null-text {
      position: absolute;
      top: calc(70px + 100px);
      left: calc(50% + 15px);
      text-align: center;
      font-size: 16px;
      transform: translate(-50%, -50%);
    }
  }

  .chart {
    position: relative;

    .block__null {
      top: 30px;
      background-position: center center;
      background-size: auto 120px;
    }

    .block__null-text {
      top: 50%;
      font-size: 12px;
      left: calc(50% + 10px);
    }
  }
</style>
