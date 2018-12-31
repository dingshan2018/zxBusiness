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
        <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">出纸记录排名</div>
        <canvas v-if="outPaperRecordRanking.length" id="chartCanvas"></canvas>
        <div class="block__loading" v-if="!outPaperRecordRanking.length && !chartDataEmpty"></div>
        <div class="block__null" v-if="!outPaperRecordRanking.length && chartDataEmpty">
          <span class="block__null-text">暂无数据</span>
        </div>
      </div>

      <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">出纸记录</div>
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
        // 图表空数据
        chartDataEmpty: false,
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
        page: 1,
        // 每页条数
        limit: 50
      };
    },
    watch: {
      outPaperRecordRanking: function (newV, oldV) {
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
        _this.$axios.post("/api/settle/settlementParam/tissuerecordStatistics", {}, {
          withCredentials: true
        }).then(function (response) {
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
        _this.$axios.post("/api/settle/settlementParam/selectzxtissuerecordlist", _this.$qs.stringify({
          page: _this.page,
          limit: _this.limit
        }), {
          withCredentials: true
        }).then(function (response) {
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

    canvas {
      width: 100%;
      height: calc(100% - 40px);
    }
  }
</style>
