<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="场所列表"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <table-list :columns="tableColumns" :data="tableData" @onRow="toDeviceList"></table-list>
    </scroll-view>
  </div>
</template>

<script>
  export default {
    name: "PlaceList",
    data () {
      return {
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
        limit: 50
      };
    },
    methods: {
      // 场所列表
      getPlaceList (page, limit) {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/selectzxplacelist", _this.$qs.stringify({
          page: _this.page,
          limit: _this.limit
        })).then(function (response) {
          let data = response.data;
          if (!data) return;

          _this.totalCount = data.totalCount;
          _this.page = data.page;
          _this.limit = data.limit;
          _this.tableData = data.list;

          /*_this.tableData = [
            {
              name: "场地名称1",
              count: "123",
              time: "2018-12-12 12:12:12",
              placeId: '1'
            }
          ];*/
        }).catch(function (error) {

        });
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
