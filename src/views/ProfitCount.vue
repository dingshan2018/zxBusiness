<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="收益统计"
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
        limit: 50
      };
    },
    methods: {
      // 场所列表
      getProfitList (page, limit) {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/selecuserincomelist", _this.$qs.stringify({
          page: _this.page,
          limit: _this.limit
        })).then(function (response) {
          let data = response.data;
          if (!data) return;

          _this.totalCount = data.totalCount;
          _this.page = data.page;
          _this.limit = data.limit;
          _this.tableData = data.list;

        }).catch(function (error) {

        });
      }
    },
    created () {
      this.getProfitList();
    }
  };
</script>
