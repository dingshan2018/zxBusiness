<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="设备列表"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <table-list :columns="tableColumns" :data="tableData"></table-list>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    name: "DeviceList",
    data () {
      return {
        // 表格列
        tableColumns: [
          {
            title: "设备编号",
            key: "deviceSn"
          },
          {
            title: "状态",
            key: "status",
            width: '90px'
          }
        ],
        // 表格数据
        tableData: [],
        // 分页总条数
        totalCount: "",
        // 当前页
        page: 1,
        // 每页条数
        limit: 50
      };
    },
    methods: {
      // 设备列表
      getDeviceList (page, limit) {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/selecdevicelist", _this.$qs.stringify({
          page: _this.page,
          limit: _this.limit,
          placeId: _this.$route.query.placeId
        })).then(function (response) {
          let data = response.data;
          if (!data) return;

          _this.totalCount = data.totalCount;
          _this.page = data.page;
          _this.limit = data.limit;
          _this.tableData = data.list;

          /*_this.tableData = [
            {
              deviceSn: "D006",
              status: "上线"
            }
          ];*/
        }).catch(function (error) {

        });
      }
    },
    created () {
      this.getDeviceList();
    }
  };
</script>
