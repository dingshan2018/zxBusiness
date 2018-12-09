<template>
  <scroll-view full>
    <!-- 用户信息 -->
    <section class="user-info van-hairline--bottom">
      <img class="user-info__bg--blur" :src="wxUserBaseInfo.headImg"/>
      <div class="user-info__content block__clear-both">
        <img class="user-info__avatar" :src="wxUserBaseInfo.headImg">
        <p class="user-info__name van-ellipsis animated">{{wxUserBaseInfo.name}}</p>
      </div>
    </section>

    <!-- 菜单 -->
    <van-row class="menu-section" v-if="menuLimit.length">
      <van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('settle:userIncome:view')">
        <router-link to="/ProfitCount">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">收益统计</span>
        </router-link>
      </van-col>
      <van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('business:place:view')">
        <router-link to="/PlaceList">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">场所列表</span>
        </router-link>
      </van-col>
      <van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('business:device:view')">
        <router-link to="/DeviceRelease">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">设备投放</span>
        </router-link>
      </van-col>
      <van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('advertise:adSchedule:view')">
        <router-link to="/AdPlan">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">广告计划</span>
        </router-link>
      </van-col>
      <van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('business:tissueRecord:view')">
        <router-link to="/OutPaperRecord">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">出纸记录</span>
        </router-link>
      </van-col>
      <!--<van-col class="menu-item"
               span="8"
               v-if="menuLimitHas('business:device:view') || menuLimitHas('client:repair:view')">
        <router-link to="/ReplaceBoard">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name">设备换板</span>
        </router-link>
      </van-col>-->
    </van-row>

    <!-- 最近出纸记录 -->
    <div class="table-list__title van-ellipsis">最近记录：</div>
    <table-list :columns="tableColumns" :data="tableData"></table-list>
    <van-row class="pagination" tag="ul">
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

  </scroll-view>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "Home",
    data () {
      return {
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
    computed: mapGetters(["userInfo", "wxUserBaseInfo", "menuLimit"]),
    methods: {
      // 菜单权限判断
      menuLimitHas (value) {
        return this.menuLimit.indexOf(value) > -1;
      },
      // 出纸记录
      getOutPagerRecord (page, limit) {
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
    created () {
      this.getOutPagerRecord();
    }
  };
</script>

<style lang="less" scoped>
  @base-green: #00c292;

  .user-info {
    position: relative;
    height: 140px;
    overflow: hidden;
  }

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

  .menu-section {
    padding: 10px;
    margin: 0 -10px;
    /*border-bottom: 1px solid #eee;*/

    .menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      /*height: 70px;*/
      /*line-height: 70px;*/
      text-align: center;
      overflow: hidden;
    }

    .menu-item__icon {
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      margin: 0 auto;
      border-radius: 4px;
      font-size: 16px;
      background: radial-gradient(50% 50%, circle cover, #f1f1f1 0, #f9f9f9 100%);
    }

    .menu-item__name {
      display: block;
      height: 20px;
      line-height: 20px;
      margin: 10px auto;
      padding: 0 4px;
      font-weight: 600;
      font-size: 14px;
      color: #333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    a {
      display: block;
      max-width: 100%;
    }

    .van-icon {
      vertical-align: middle;
    }
  }

  .table-list__title {
    padding: 0 10px;
    line-height: 40px;
    text-align: left;
    font-weight: 600;
    font-size: 13px;
    background-color: #f6f6f6;
  }

  .pagination {
    position: relative;
    width: 100%;
    padding: 0 10px;

    .pagination__like {
      padding: 0 5px;
      line-height: 40px;
      text-align: center;
      font-size: 12px;
    }
  }
</style>
