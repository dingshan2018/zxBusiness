<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="设备换板"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <van-cell-group class="input-group">
        <van-field
          v-model="termCode"
          label="终端编号"
          disabled/>

        <div class="field-query ">
          <van-field
            v-model="deviceCode"
            label="设备号"
            placeholder="填写设备号"
            required
            clearable
            @click.native.stop/>

          <scroll-view class="field-query__view" v-show="fieldQueryShow">
            <div class="field-query__item van-ellipsis van-hairline--bottom"
                 v-if="!this.fieldQueryData.length">未查询到此设备编号
            </div>
            <div class="field-query__item van-ellipsis van-hairline--bottom"
                 v-for="(item, index) in fieldQueryData"
                 :key="index"
                 @click.stop="fieldQueryDataClick(item)">{{item.deviceSn}}
            </div>
          </scroll-view>
        </div>

        <!--<div class="field-query">
          <van-field
            v-model="deviceCode"
            label="设备号"
            placeholder="填写设备号"
            required
            clearable
            @click.native.stop/>

          <div class="field-query__list" v-show="queryListShow">
            <ul @touchmove.stop>
              <li class="field-query__item van-ellipsis van-hairline&#45;&#45;bottom"
                  v-for="item in onlineDevice"
                  :key="item.deviceId"
                  @click.stop="onlineDeviceClick(item)">{{item.deviceSn}}
              </li>
            </ul>
          </div>
        </div>-->

      </van-cell-group>

      <van-button type="default"
                  class="submit-btn"
                  block
                  :disabled="!(!!termCode && !!deviceCode)"
                  @click="submitClick">绑定
      </van-button>
    </scroll-view>

  </div>
</template>

<script>
  export default {
    name: "deviceBind",
    data () {
      return {
        // 终端号
        termCode: "",
        // 设备号
        deviceCode: "",
        // 模糊查询列表点击时记录的旧设备号value
        fieldQueryClickOldCode: "",
        // 模糊查询列表点击
        fieldQueryClick: false,
        // 模糊查询设备列表
        fieldQueryData: [],
        // 模糊查询是否显示
        fieldQueryShow: false,
      };
    },
    watch: {
      // 监听设备号，模糊查询
      "deviceCode": function (newV, oldV) {
        // fieldQuery点击后
        // value为空
        // 模糊查询列表为空并且value为空
        if (this.fieldQueryClick && oldV === this.fieldQueryClickOldCode
          || !newV
          || !newV && !this.fieldQueryData.length)
          return this.fieldQueryShow = false;

        this.fieldQueryShow = true;
        this.fieldQueryOnline();
      }
    },
    methods: {
      // 设备模糊查询
      fieldQueryOnline () {
        let _this = this;

        _this.$axios.post("/wx/queryOnlineDevice", _this.$qs.stringify({
          params: {
            deviceCode: _this.deviceCode,
            deviceStatus: "02",
            pageNo: "",
            pageSize: ""
          }
        })).then(function (response) {
          let data = response.data;

          _this.fieldQueryData = data.list;
        }).catch(function () {
          // _this.$toast.fail("系统繁忙！");

          let data = [];
          for (var i = 0; i < 10; i++) {
            data.push({
              deviceId: i,
              deviceSn: new Date().getTime()
            });
          }
          _this.fieldQueryData = data;

        });
      },
      // 设备模糊查询选择
      fieldQueryDataClick (item) {
        this.fieldQueryClickOldCode = this.deviceCode;
        this.fieldQueryClick = true;
        this.deviceCode = item.deviceSn;
      },
      // 提交确认按钮
      submitClick () {
        let _this = this;

        _this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: "加载中..."
        });

        _this.$axios.get("/wx/activeTerminal", {
          params: {
            userId: _this.userId,
            termCode: _this.termCode,
            deviceCode: _this.deviceCode
          }
        }).then(function (response) {
          let data = response.data;
          _this.$toast.success(data.error.message);

          if (parseInt(data.code) === 0) {
            setTimeout(function () {
              WeixinJSBridge.call("closeWindow");
            }, 3000);
          }
        }).catch(function () {
          _this.$toast.fail("系统繁忙！");

        });
      }
    },
    created () {
      this.termCode = this.$util.getUrlParam("termCode");
      this.userId = this.$util.getUrlParam("userId");
    }
  };
</script>

<style lang="less" scoped>
  @base-green: #00c292;

  .field-query {
    position: relative;

    .field-query__view {
      z-index: 1;
      position: absolute;
      height: 190px;
      top: 100%;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 #efefef;
    }

    .field-query__item {
      padding: 0 10px 0 calc(10px + 15px + 90px);
      line-height: 40px;
      font-size: 14px;
    }
  }

  .input-group {
    margin-top: 40px;

    .van-field {
      width: calc(100% - 10px);
      margin-left: 10px;
    }
  }

  .submit-btn {
    width: 320px;
    margin: 30px auto;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 400;
    color: #fff;
    background-color: @base-green;
  }
</style>
