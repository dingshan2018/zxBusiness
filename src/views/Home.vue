<template>
  <page-view :iphone-bar="false">
    <page-scroll full>
      <!-- 用户信息 -->
      <section class="user-info van-hairline--bottom">
        <div class="user-info__content block__clear-both">
          <img class="user-info__avatar" :src="wxUserBaseInfo.headImg"/>
          <p class="user-info__name van-ellipsis">{{coperatorType}}{{wxUserBaseInfo.name}}</p>
        </div>
      </section>
      <!-- 菜单 -->
      <section class="menu-section" v-if="menuLimit.length">
        <div class="menu-item van-col--6" v-if="menuLimitHas('settle:userIncome:view')">
          <router-link to="/profitCount">
            <img class="menu-item__icon" src="../assets/icon/icon__ProfitCount.png"/>
            <span class="menu-item__name van-ellipsis">收益统计</span>
          </router-link>
        </div>
        <div class="menu-item van-col--6" v-if="menuLimitHas('business:place:view')">
          <router-link to="/placeList">
            <img class="menu-item__icon" src="../assets/icon/icon__PlaceList.png"/>
            <span class="menu-item__name van-ellipsis">场所列表</span>
          </router-link>
        </div>
        <div class="menu-item van-col--6" v-if="menuLimitHas('business:device:view')">
          <router-link to="/deviceRelease">
            <img class="menu-item__icon" src="../assets/icon/icon__DeviceRelease.png"/>
            <span class="menu-item__name van-ellipsis">设备投放</span>
          </router-link>
        </div>
        <div class="menu-item van-col--6" v-if="menuLimitHas('advertise:adSchedule:view')">
          <router-link to="/adPlan">
            <img class="menu-item__icon" src="../assets/icon/icon__AdPlan.png">
            <span class="menu-item__name van-ellipsis">广告计划</span>
          </router-link>
        </div>
        <div class="menu-item van-col--6" v-if="menuLimitHas('business:tissueRecord:view')">
          <router-link to="/outPaperRecord">
            <img class="menu-item__icon" src="../assets/icon/icon__OutPaperRecord.png"/>
            <span class="menu-item__name van-ellipsis">出纸记录</span>
          </router-link>
        </div>
      </section>
      <!-- 最近出纸记录 -->
      <div class="block__table-record" v-if="menuLimitHas('business:tissueRecord:view')">
        <div class="block__loading" v-if="tableLoading">
          <span class="block__loading-icon"></span>
          <span class="block__loading-text">加载中...</span>
        </div>
        <div class="block__null" v-if="!tableLoading && !tableData.length"></div>
        <div class="block__model-title van-hairline--top van-hairline--bottom van-ellipsis">最近出纸记录：</div>
        <table-list :columns="tableColumns" :data="tableData"></table-list>
        <van-row class="pagination" tag="ul" v-if="tableData.length">
          <van-col span="12"
                   tag="li"
                   class="pagination__prev pagination__like van-ellipsis"
                   @click.native="paginationPrev">
            <van-icon name="arrow-left"/>
            上一页
          </van-col>
          <van-col span="12"
                   tag="li"
                   class="pagination__next pagination__like van-ellipsis"
                   @click.native="paginationNext">
            下一页
            <van-icon name="arrow"/>
          </van-col>
        </van-row>
      </div>
    </page-scroll>
  </page-view>
</template>

<script>
  export default {
    data () {
      return {
        // 首页用户基本信息
        wxUserBaseInfo: {},
        // 首页菜单权限
        menuLimit: [],
        // 加载
        tableLoading: true,
        // 表格列
        tableColumns: [
          {
            title: "设备名称",
            key: "deviceSn",
            width: "90px"
          },
          {
            title: "所在场所",
            key: "placeName"
          },
          {
            title: "日期",
            key: "TIME"
          }
        ],
        // 表格数据
        tableData: [],
        // 分页总条数
        totalCount: "",
        // 当前页
        page: 1,
        // 每页条数
        limit: 5
      };
    },
    computed: {
      coperatorType () {
        let type = "";
        switch (this.wxUserBaseInfo.coperatorType) {
          case "00":
            type = "系统用户";
            break;
          case "01":
            type = "合作伙伴";
            break;
          case "02":
            type = "机主";
            break;
          case "03":
            type = "代理商";
            break;
          case "04":
            type = "服务商";
            break;
          case "05":
            type = "广告商";
            break;
        }
        return type && `【${type}】`;
      }
    },
    methods: {
      // 判断是否有该菜单权限
      menuLimitHas (value) {
        return this.menuLimit.includes(value);
      },
      // 出纸记录
      getOutPagerRecord (page, limit) {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/selectzxtissuerecordlist",
          _this.$qs.stringify({
            page: _this.page,
            limit: _this.limit,
            userId: JSON.parse(localStorage.wxUserBaseInfo).userId,
            placeId: JSON.parse(localStorage.wxUserBaseInfo).placeId
          }))
          .then(function (response) {
            _this.tableLoading = false;
            let data = response.data;
            _this.totalCount = data.totalCount;
            _this.page = data.page;
            _this.limit = data.limit;
            _this.tableData = data.list;
          });
      },
      // 上一页
      paginationPrev () {
        if (this.page <= 1) {
          return this.$toast("已经是第一页！");
        }
        this.getOutPagerRecord(this.page--, this.limit);
      },
      // 下一页
      paginationNext () {
        if (this.page + this.limit >= this.totalCount) {
          return this.$toast("没有更多数据了！");
        }
        this.getOutPagerRecord(this.page++, this.limit);
      }
    },
    mounted () {
      // 首页用户基本信息
      this.wxUserBaseInfo = JSON.parse(localStorage.wxUserBaseInfo);
      // 首页菜单权限
      this.menuLimit = localStorage.menuLimit.split(",");
      // 获取最近出纸记录
      this.getOutPagerRecord();
    }
  };
</script>

<style lang="less" scoped>
  .user-info {
    position: relative;
    height: 140px;
    overflow: hidden;
    background: url("../assets/img/home-header.png") no-repeat -25px bottom/400px #0ba84c;
    .user-info__bg--blur {
      position: absolute;
      top: 0;
      left: -100%;
      width: 300%;
      height: 300%;
      filter: blur(15Px);
    }

    .user-info__content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .user-info__avatar {
      display: block;
      width: 66px;
      height: 66px;
      margin: 10px auto 0;
      padding: 2px;
      border-radius: 50%;
      background-color: #fff;
      overflow: hidden;
    }

    .user-info__name {
      text-align: center;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
    }
  }

  .menu-section {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding: 15px 0;
    overflow: hidden;
    transition: height .3s ease-in;

    .menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 0;
      text-align: center;
      overflow: hidden;
    }

    .menu-item__icon {
      display: block;
      width: 32px;
      height: 32px;
      margin: 0 auto;
      padding: 2px;
      border-radius: 4px;
    }

    .menu-item__name {
      display: block;
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      padding: 0 4px;
      font-size: 14px;
      color: #333;
    }

    a {
      display: block;
      max-width: 100%;
    }

    .van-icon {
      vertical-align: middle;
    }
  }

  .block__table-record {
    .pagination {
      position: relative;
      width: 100%;
      margin-top: 15px;
      padding: 0 10px;
      .pagination__like {
        padding: 0 5px;
        line-height: 40px;
        text-align: center;
        font-size: 12px;
      }

      .van-icon {
        vertical-align: middle;
      }
    }
  }

</style>
