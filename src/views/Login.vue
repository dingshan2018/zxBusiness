<template>
  <div class="app-container">
    <header class="login-header">
      <h1>共享纸巾机管理平台</h1>
    </header>
    <main class="login-body">
      <div class="login-form animated fadeInUp">
        <van-cell-group>
          <van-field v-model="userName" placeholder="用户名"/>
          <van-field type="password" v-model="userPsw" placeholder="密码"/>
        </van-cell-group>
        <van-button type="default" class="submit-btn" block :disabled="!(!!userName && !!userPsw)" @click="submitClick">登录</van-button>
      </div>
    </main>
  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name   : "Login",
    data () {
      return {
        userName: "",
        userPsw : "",
        userInfo: {}
      };
    },
    methods: {
      // 微信用户信息
      getWxUserInfo () {
        let _this = this;
        let accessCode = globalTools.getUrlParam("code");

        // 未授权
        if (!accessCode) {
          //获取授权code的回调地址，获取到code，直接返回到当前页
          location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4e2cf38426225453&redirect_uri=" +
            encodeURIComponent(location.href) + "&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect";
        }
        else {
          _this.$axios.get("/api/wx/userInfo", {
            params: {
              code : accessCode,
              state: 0
            }
          }).then(function (response) {
            let data = response.data;

            // 用户信息
            if (data && data.userInfo) {
              _this.userInfo = data.userInfo;

            } else {
              alert("获取用户信息失败");

            }
          }).catch(function (error) {
            alert("获取用户信息失败:" + JSON.stringify(error));

          });
        }
      },
      submitClick () {
        let _this = this;

        _this.$toast.loading({
          duration   : 0,
          forbidClick: true,
          message    : "登录中..."
        });

        _this.$axios.post("/api/wxLogin", _this.$qs.stringify({
          // ohZpd0tPFpAeGZweVQEuinaa5H8M
          openId  : _this.userInfo.openId || 'ohZpd0tPFpAeGZweVQEuinaa5H8M'
        })).then(function (response) {
          let data = response.data;
          console.log(data);
          if (data.code === 0) {
            _this.$toast.clear();
            _this.$router.replace("/Home");
          }

        }).catch(function (error) {
          setTimeout(function () {
            _this.$toast.clear();
            _this.$router.replace("/Home");
          }, 3000);
        });
      }
    },
    created () {
      // this.getWxUserInfo();
    }
  };
</script>

<style lang="less" scoped>
  @base-green: #00c292;

  .login-header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 140px;
    color: #333;
  }

  .login-body {
    display: flex;
    justify-content: center;
    position: relative;
  }

  .login-form {
    position: relative;
    width: 100%;
    margin-top: -10px;
    animation-delay: 0.5s;

    .van-field {
      width: calc(100% - 10px);
      margin-left: 10px;
    }
  }

  .input-item-wrap {
    position: relative;
    width: 280px;
    margin: 0 auto 40px;
  }

  .input-item__title {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 2px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    transition: transform 0.2s ease-in;
  }

  .input-item__title.input-item__title--rise {
    transform: translateY(-110%);
    transition: transform 0.3s ease-out;
  }

  .input-item__control {
    display: block;
    position: relative;
    width: 100%;
    height: 24px;
    line-height: 22px;
    margin: 0;
    padding: 0 10px;
    border: 1px solid transparent;
    border-bottom-color: #e0e0e0;
    outline: 0;
    font-size: 14px;
    resize: none;
    color: #333;
    font-weight: 400;
    background-color: transparent;
  }

  .submit-btn {
    width: 320px;
    margin: 30px auto;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 400;
    color: #fff;
    background-color: @base-green;
    transition: background 0.3s linear;
  }
</style>

