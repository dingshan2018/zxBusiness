<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="出纸记录"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <div class="chart">
        <div class="chart__title">出纸记录排名：</div>
        <canvas id="chartCanvas"></canvas>
      </div>

      <table-list :columns="tableColumns" :data="tableData"></table-list>

    </scroll-view>
  </div>

</template>

<script>
  export default {
    name: "OutPaperRecord",
    data () {
      return {
        // 出纸记录排名
        outPaperRecordRanking: [],
        // 表格列
        tableColumns: [
          {
            title: "设备名称",
            key: "deviceName",
            width: "90px"
          },
          {
            title: "所在场所",
            key: "place"
          },
          {
            title: "日期",
            key: "time"
          }
        ],
        // 表格数据
        tableData: [],
        // 分页总条数
        totalCount: "",
        // 当前页
        page: "",
        // 每页条数
        limit: ""
      };
    },
    watch: {
      // 设备列表变化刷新BScroll
      list (newValue, oldValue) {
        if (this.mainBScrollInstance !== null) {
          this.mainBScrollInstance.refresh();
        }
      }
    },
    methods: {
      // 图表
      initAdChart () {

        let chart = new this.$f2.Chart({
          id: "chartCanvas",
          pixelRatio: window.devicePixelRatio
        });

        chart.source(this.outPaperRecordRanking, {
          sales: {
            tickCount: 5
          }
        });

        chart.tooltip({
          showItemMarker: false,
          onShow: function onShow (ev) {
            var items = ev.items;
            items[0].name = null;
            items[0].name = items[0].title;
            // items[0].value = '¥ ' + items[0].value;
          }
        }).interval().position("name*num");

        chart.render();
      },
      // 出纸记录排名
      getAdPlanClickRanking () {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/tissuerecordStatistics").then(function (response) {
          let data = response.data;
          if (!data) return;

          _this.outPaperRecordRanking = data.list;

          _this.initAdChart();

        }).catch(function (error) {

        });

      },
      // 出纸列表
      getAdPlanList (page, limit) {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/selectzxtissuerecordlist", _this.$qs.stringify({
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
      this.getAdPlanClickRanking();
      this.getAdPlanList();
    }
  };
</script>

<style lang="less" scoped>
  @base-green: #00c292;

  .chart {
    width: 100%;
    height: 200px;
    background-color: #fff;

    .chart__title {
      height: 40px;
      line-height: 40px;
      font-size: 13px;
      font-weight: 600;
      padding: 0 10px;
      background-color: #f6f6f6;
    }

    canvas {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
</style>
