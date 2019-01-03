<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="收益统计"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view
      :pull-up-offset="pullUpOffset"
      :pull-up-load="pullUpLoad"
      :pull-up-finished="pullUpFinished"
      @pull-up-finish="pullUpFinish">
      <table-list :columns="tableColumns" :data="tableData"></table-list>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    name: "ProfitCount",
    data () {
      return {
        // 表格列
        tableColumns: [
          {
            title: "经营主体",
            key: "coperatorName"
          },
          {
            title: "广告收益",
            key: "adIncome"
          },
          {
            title: "推广收益",
            key: "promotionIncome"
          },
          {
            title: "服务收益",
            key: "serviceIncome"
          }
        ],
        // 表格数据
        tableData: [],
        // 分页总条数
        totalCount: "",
        // 当前页
        page: 1,
        // 每页条数
        limit: 50,
        // 触发加载事件的距离
        pullUpOffset: 50,
        // 是否处于上拉加载状态
        pullUpLoad: false,
        // 上拉加载结束
        // 为false将不再触发加载事件
        pullUpFinished: false
      };
    },
    methods: {
      // 场所列表
      getProfitList () {
        let _this = this;
        _this.pullUpLoad = true;

        _this.$axios.post("/api/settle/settlementParam/selecuserincomelist",
          _this.$qs.stringify({
            page: _this.page,
            limit: _this.limit
          }))
          .then(function (response) {
            let data = response.data;
            if (!data) return;

            _this.totalCount = data.totalCount;
            _this.page = data.page;
            _this.limit = data.limit;
            _this.tableData = data.list;
            // 上拉加载完成
            _this.pullUpLoad = false;
            if (parseInt(_this.limit) >= parseInt(_this.totalCount)) {
              return _this.pullUpFinished = true;
            }
          })
          .catch(function (error) {
            _this.pullUpFinished = true;
            _this.$dialog.alert({
              title: "系统繁忙",
              message: "系统繁忙，请稍候再试"
            }).then(function () {
              WeixinJSBridge.call("closeWindow");
            });
          });
      },
      // 上拉加载
      pullUpFinish () {
        if (this.pullUpFinished) return;
        this.limit += 50;
        this.getProfitList();
      }
    },
    created () {
      this.getProfitList();
    }
  };
</script>
