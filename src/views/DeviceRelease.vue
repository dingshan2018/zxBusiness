<template>
  <page-view :iphone-bar="false">
    <van-nav-bar
      class="nav-bar"
      title="设备投放"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>
    <page-scroll height="calc(100vh - 1.17333rem)"
                 :iphone-bar="false">
      <van-cell-group class="input-group">
        <div class="field-query ">
          <van-field
            v-model="device.deviceSn"
            label="设备编号"
            placeholder="填写设备编号"
            clearable
            @click.native.stop/>
          <page-scroll class="field-query__view"
                       v-show="fieldQueryShow"
                       :iphone-bar="false"
                       height="190px">
            <div class="field-query__item van-ellipsis van-hairline--bottom"
                 v-if="!this.fieldQueryData.length">未查询到此设备编号
            </div>
            <div class="field-query__item van-ellipsis van-hairline--bottom"
                 v-for="(item, index) in fieldQueryData"
                 :key="index"
                 @click.stop="fieldQueryDataClick(item)">{{item.deviceSn}}
            </div>
          </page-scroll>
        </div>
        <van-field
          v-model="place.name"
          label="投放场所"
          placeholder="选择投放场所"
          @touchstart.native="onPlaceTouchStart"/>
      </van-cell-group>
      <van-button type="default"
                  class="submit-btn"
                  block
                  :disabled="!(!!device.deviceSn && !!place.name)"
                  @click="submitClick">确认
      </van-button>
    </page-scroll>
    <!-- 设备列表 -->
    <van-popup v-model="placePopup" position="bottom">
      <van-picker :columns="placePickerColumns"
                  value-key="name"
                  show-toolbar
                  title="选择场所"
                  @cancel="placePopup = false"
                  @confirm="placePickerConfirm"/>
    </van-popup>
  </page-view>
</template>

<script>
  export default {
    data () {
      return {
        // 设备编号
        device: {
          deviceSn: "",
          deviceId: ""
        },
        // 模糊查询列表点击时记录的旧设备号value
        fieldQueryClickOldCode: "",
        // 模糊查询列表点击
        fieldQueryClick: false,
        // 模糊查询设备列表
        fieldQueryData: [],
        // 模糊查询是否显示
        fieldQueryShow: false,
        // 场所
        place: {
          name: "",
          placeId: ""
        },
        // 场所弹出层
        placePopup: false,
        // 场所选择器数据
        placePickerColumns: []
      };
    },
    watch: {
      // 监听设备号，模糊查询
      "device.deviceSn": function (newV, oldV) {
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
      // 选择场所
      onPlaceTouchStart (event) {
        event.preventDefault();
        this.placePopup = true;
      },
      // 设备模糊查询
      fieldQueryOnline () {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/selectdeviceAll", _this.$qs.stringify({
          deviceSn: _this.device.deviceSn
        })).then(function (response) {
          let data = response.data;
          _this.fieldQueryData = data.list;
        }).catch(function () {
          _this.$toast.fail("系统繁忙！");
        });
      },
      // 设备模糊查询选择
      fieldQueryDataClick (item) {
        this.fieldQueryClickOldCode = this.device.deviceSn;
        this.fieldQueryClick = true;
        this.device = item;
      },
      // 获取场所列表
      getPlaceList () {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/selectplaceAll")
          .then(function (response) {
            let data = response.data;
            _this.placePickerColumns = data.list;
          });
      },
      // 场所选择确定
      placePickerConfirm (item, index) {
        this.place = item;
        this.placePopup = false;
      },
      // 提交确认按钮
      submitClick () {
        let _this = this;
        _this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: "加载中..."
        });
        _this.$axios.post("/api/settle/settlementParam/deviceSave",
          _this.$qs.stringify({
            deviceId: _this.device.deviceId,
            placeId: _this.place.placeId
          }))
          .then(function (response) {
            let data = response.data;
            if (!data && data.code !== "0000") {
              return _this.$dialog.alert({
                title: "系统繁忙",
                message: "系统繁忙，请稍候再试"
              });
            }
            _this.$toast.success("操作成功");
          })
          .catch(function (error) {
            _this.$toast.clear();
            _this.$dialog.alert({
              title: "系统繁忙",
              message: "系统繁忙，请稍候再试"
            });
          });
      }
    },
    created () {
      this.getPlaceList();
    }
  };
</script>

<style lang="less" scoped>
  @base-green: #0ba84c;

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
