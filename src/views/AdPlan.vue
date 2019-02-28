<template>
  <page-view :iphone-bar="false">
    <van-nav-bar
      class="nav-bar"
      title="广告计划"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"/>
    <page-scroll height="calc(100vh - 1.17333rem)"
                 :iphone-bar="false"
                 :pull-up-offset="pullUpOffset"
                 :pull-up-load="pullUpLoad"
                 :pull-up-finished="pullUpFinished"
                 @pull-up-finish="pullUpFinish">
      <div class="chart">
        <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">广告点击量排名</div>
        <div v-if="adPlanClickRanking.length" id="chartContainer"></div>
        <div class="block__loading" v-if="chartLoading">
          <span class="block__loading-icon"></span>
          <span class="block__loading-text">加载中...</span>
        </div>
        <div class="block__null" v-if="!chartLoading && !adPlanClickRanking.length"></div>
      </div>
      <div class="block__table-record">
        <div class="block__loading" v-if="tableLoading">
          <span class="block__loading-icon"></span>
          <span class="block__loading-text">加载中...</span>
        </div>
        <div class="block__null" v-if="!tableLoading && !tableData.length"></div>
        <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">广告点击量</div>
        <table-list :columns="tableColumns" :data="tableData"></table-list>
      </div>
    </page-scroll>
  </page-view>
</template>

<script>
  export default {
    data () {
      return {
        // 广告点击量排名
        adPlanClickRanking: [],
        // 图表加载
        chartLoading: true,
        // 加载
        tableLoading: true,
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
      // 图表
      initChart () {
        let _this = this;
        if (!_this.adPlanClickRanking.length) return;
        let myChart = echarts.init(document.getElementById("chartContainer"));
        let option = {
          color: ["#0ba84c"],
          grid: {
            top: "20",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: _this.adPlanClickRanking.map(value => value.name),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              type: "bar",
              barWidth: "55%",
              data: _this.adPlanClickRanking.map(value => value.num),
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      {offset: 0, color: "#38ef7d"},
                      {offset: 0.8, color: "#0ba84c"}
                    ]
                  )
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      },
      // 广告点击量排名
      getAdPlanClickRanking () {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/scheduleStatistics")
          .then(function (response) {
            _this.chartLoading = false;
            let data = response.data;
            _this.adPlanClickRanking = data.list;
            _this.$nextTick(() => _this.initChart());
          });
      },
      // 广告列表
      getAdPlanList () {
        let _this = this;
        _this.pullUpLoad = true;
        _this.$axios.post("/api/settle/settlementParam/selecadschedulelist",
          _this.$qs.stringify({
            page: _this.page,
            limit: _this.limit
          }))
          .then(function (response) {
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
          })
          .catch(function (error) {
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
        this.getAdPlanList();
      }
    },
    created () {
      this.getAdPlanClickRanking();
      this.getAdPlanList();
    }
  };
</script>

<style lang="less" scoped>
  .chart {
    width: 100%;
    height: 200px;
    background-color: #fff;
  }

  #chartContainer {
    width: 100%;
    height: calc(100% - 30px);
  }
</style>
