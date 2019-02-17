<template>
  <page-view :iphone-bar="false">
    <van-nav-bar
      class="nav-bar"
      title="场所列表"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>
    <page-scroll height="calc(100vh - 1.17333rem)"
                 :iphone-bar="false"
                 :pull-up-offset="pullUpOffset"
                 :pull-up-load="pullUpLoad"
                 :pull-up-finished="pullUpFinished"
                 @pull-up-finish="pullUpFinish">
      <div class="block__table-record">
        <div class="block__loading" v-if="tableLoading">
          <span class="block__loading-icon"></span>
          <span class="block__loading-text">加载中...</span>
        </div>
        <div class="block__null" v-if="!tableLoading && !tableData.length">
          <span class="block__null-text">暂无数据</span>
        </div>
        <table-list :columns="tableColumns" :data="tableData" @onRow="toDeviceList"></table-list>
      </div>
    </page-scroll>
  </page-view>
</template>

<script>
  export default {
    data () {
      return {
        // 加载
        tableLoading: true,
        // 表格列
        tableColumns: [
          {
            title: "场地名称",
            key: "name",
            width: "90px"
          },
          {
            title: "设备数量",
            key: "count",
            width: "90px"
          },
          {
            title: "创建时间",
            key: "time"
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
      getPlaceList () {
        let _this = this;
        _this.pullUpLoad = true;
        _this.$axios.post("/api/settle/settlementParam/selectzxplacelist", _this.$qs.stringify({
          page: _this.page,
          limit: _this.limit
        })).then(function (response) {
          _this.tableLoading = false;
          let data = response.data;
          _this.totalCount = data.totalCount;
          _this.page = data.page;
          _this.limit = data.limit;
          _this.tableData = data.list;
          // 上拉加载完成
          _this.pullUpLoad = false;
          if (parseInt(_this.limit) >= parseInt(_this.totalCount)) {
            return _this.pullUpFinished = true;
          }
        }).catch(function (error) {
          _this.pullUpFinished = true;
          _this.$dialog.alert({
            title: "系统繁忙",
            message: "系统繁忙，请稍候再试"
          });
        });
      },
      // 上拉加载
      pullUpFinish () {
        if (this.pullUpFinished) return;
        this.limit += 50;
        this.getPlaceList();
      },
      toDeviceList (target, rowData) {
        this.$router.push({path: "/DeviceList", query: {placeId: rowData.placeId}});
      }
    },
    created () {
      this.getPlaceList();
    }
  };
</script>
