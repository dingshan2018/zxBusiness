<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="收益统计"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <table-list :columns="tableColumns" :data="tableData1"></table-list>
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
        // 表格数据
        tableData1: [
          {"adIncome": 60.0, "serviceIncome": 0.0, "promotionIncome": 22.5, "coperatorName": "喜多多加盟商"},
          {"adIncome": 0.0, "serviceIncome": 0.0, "promotionIncome": 2250.0, "coperatorName": "喜多多代理商"},
          {"adIncome": 132.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 40.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 60.0, "serviceIncome": 0.0, "promotionIncome": 22.5, "coperatorName": "喜多多加盟商"},
          {"adIncome": 0.0, "serviceIncome": 0.0, "promotionIncome": 2250.0, "coperatorName": "喜多多代理商"},
          {"adIncome": 132.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 40.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 60.0, "serviceIncome": 0.0, "promotionIncome": 22.5, "coperatorName": "喜多多加盟商"},
          {"adIncome": 0.0, "serviceIncome": 0.0, "promotionIncome": 2250.0, "coperatorName": "喜多多代理商"},
          {"adIncome": 132.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 40.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 60.0, "serviceIncome": 0.0, "promotionIncome": 22.5, "coperatorName": "喜多多加盟商"},
          {"adIncome": 0.0, "serviceIncome": 0.0, "promotionIncome": 2250.0, "coperatorName": "喜多多代理商"},
          {"adIncome": 132.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 40.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 60.0, "serviceIncome": 0.0, "promotionIncome": 22.5, "coperatorName": "喜多多加盟商"},
          {"adIncome": 0.0, "serviceIncome": 0.0, "promotionIncome": 2250.0, "coperatorName": "喜多多代理商"},
          {"adIncome": 132.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"},
          {"adIncome": 40.0, "serviceIncome": 0.0, "promotionIncome": 0.0, "coperatorName": "喜多多加盟商"}
        ],
        // 分页总条数
        totalCount: "",
        // 当前页
        page: "",
        // 每页条数
        limit: ""
      };
    },
    methods: {
      // 场所列表
      getProfitList (page, limit) {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/selecuserincomelist", _this.$qs.stringify({
          page: page || 1,
          limit: limit || 5
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
