<template>
  <page-view :iphone-bar="false">
    <page-scroll full>

    </page-scroll>
  </page-view>
</template>

<script>
  // @ is an alias to /src
  export default {
    methods: {
      // 微信用户信息
      getWxUserInfo () {
        let _this = this;
        let accessCode = _this.$util.getUrlParam("code");
        // 未授权
        if (!accessCode) {
          //获取授权code的回调地址，获取到code，直接返回到当前页
          return location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4e2cf38426225453&redirect_uri=" +
            encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect";
        }
        // 授权
        _this.$axios.get("/wx/userInfo",
          {
            params: {
              code: accessCode,
              state: 0
            }
          })
          .then(function (response) {
            let data = response.data;
            if (!data && !data.userInfo) {
              _this.$dialog.alert({
                title: "系统出错",
                message: "系统正在维护，请稍候再试"
              }).then(function () {
                WeixinJSBridge.call("closeWindow");
              });
            }
            // 用户信息
            localStorage.userInfo = JSON.stringify(data.userInfo);
            _this.login();
          })
          .catch(function (error) {
            _this.$dialog.alert({
              title: "系统出错",
              message: "系统正在维护，请稍候再试"
            }).then(function () {
              WeixinJSBridge.call("closeWindow");
            });
          });
      },
      // 登录
      login () {
        let _this = this;
        _this.$axios.post("/api/wxLogin",
          _this.$qs.stringify({
            //  || "ohZpd0tPFpAeGZweVQEuinaa5H8M"
            openId: JSON.parse(localStorage.userInfo).openId
          }))
          .then(function (response) {
            let data = response.data;
            if (!data || data.code !== 0) {
              return _this.$dialog.alert({
                title: "提示",
                message: data.msg
              }).then(function () {
                WeixinJSBridge.call("closeWindow");
              });
            }
            // localStorage.menuLimit = ["settle:userIncome:view,business:place:view,business:device:view,advertise:adSchedule:view,business:tissueRecord:view,business:device:view"].join();
            // 菜单权限
            localStorage.menuLimit = (data.msg && data.msg.join()) || "";
            // 用户头像、名字
            localStorage.wxUserBaseInfo = JSON.stringify({
              name: data.name,
              headImg: data.headImg,
              userId: data.userId,
              placeId: data.placeId,
              coperatorId: data.coperatorId,
              coperatorType: data.coperatorType
            });
            _this.$toast.clear();
            _this.$router.replace("/home");
          });
      }
    },
    created () {
      this.$toast.loading({
        mask: true,
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      this.getWxUserInfo();
    }
  };
</script>

