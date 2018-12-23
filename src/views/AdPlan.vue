<template>
  <div class="page-view" full>
    <van-nav-bar
      class="nav-bar"
      title="广告计划"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>

    <scroll-view>
      <div class="chart">
        <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">广告点击量排名</div>
        <canvas id="chartCanvas" v-if="adPlanClickRanking"></canvas>
        <div class="block__loading" v-if="!adPlanClickRanking.length && !chartDataEmpty"></div>
        <div class="block__null" v-if="!adPlanClickRanking.length && chartDataEmpty">
          <span class="block__null-text">暂无数据</span>
        </div>
      </div>

      <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">广告点击量</div>
      <table-list :columns="tableColumns" :data="tableData"></table-list>

    </scroll-view>
  </div>

</template>

<script>
  export default {
    name: "AdPlan",
    data () {
      return {
        // 广告点击量排名
        adPlanClickRanking: [],
        // 图表空数据
        chartDataEmpty: false,
        // 表格列
        tableColumns: [
          {
            title: "名称",
            key: "name",
            width: "90px"
          },
          {
            title: "投放位置",
            key: "position"
          },
          {
            title: "数量",
            key: "count",
            width: "90px"
          },
          {
            title: "状态",
            key: "status",
            width: "90px"
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
    watch: {
      adPlanClickRanking: function (newV, oldV) {
        if (!newV.length && !this.chartDataEmpty) {
          this.chartDataEmpty = true;
        } else {
          this.chartDataEmpty = false;
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

        chart.source(this.adPlanClickRanking, {
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
      // 广告点击量排名
      getAdPlanClickRanking () {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/scheduleStatistics").then(function (response) {
          let data = response.data;
          if (!data) return;

          _this.adPlanClickRanking = data.list;

          _this.initAdChart();

        }).catch(function (error) {

        });

      },
      // 广告列表
      getAdPlanList (page, limit) {
        let _this = this;
        _this.$axios.post("/settle/settlementParam/selecadschedulelist", _this.$qs.stringify({
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
