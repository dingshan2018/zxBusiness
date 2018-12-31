<template>
  <scroll-view full>
    <!-- 用户信息 -->
    <section class="user-info van-hairline--bottom">
      <img class="user-info__bg--blur" :src="wxUserBaseInfo.headImg"/>
      <div class="user-info__content block__clear-both">
        <img class="user-info__avatar" :src="wxUserBaseInfo.headImg"/>
        <p class="user-info__name van-ellipsis animated">{{wxUserBaseInfo.name}}</p>
      </div>
      <div class="block__loading" v-if="!wxUserBaseInfo.headImg"></div>
    </section>

    <!-- 菜单 -->
    <section class="menu-section" :class="isMenu ? 'menu-section--show' : false" ref="menuSection">
      <div class="menu-item van-col--8" v-if="menuLimitHas('settle:userIncome:view')">
        <router-link to="/ProfitCount">
          <img class="menu-item__icon" src="../assets/img/icon__ProfitCount.png"/>
          <span class="menu-item__name van-ellipsis">收益统计</span>
        </router-link>
      </div>
      <div class="menu-item van-col--8" v-if="menuLimitHas('business:place:view')">
        <router-link to="/PlaceList">
          <img class="menu-item__icon" src="../assets/img/icon__PlaceList.png"/>
          <span class="menu-item__name van-ellipsis">场所列表</span>
        </router-link>
      </div>
      <div class="menu-item van-col--8" v-if="menuLimitHas('business:device:view')">
        <router-link to="/DeviceRelease">
          <img class="menu-item__icon" src="../assets/img/icon__DeviceRelease.png"/>
          <span class="menu-item__name van-ellipsis">设备投放</span>
        </router-link>
      </div>
      <div class="menu-item van-col--8" v-if="menuLimitHas('advertise:adSchedule:view')">
        <router-link to="/AdPlan">
          <img class="menu-item__icon" src="../assets/img/icon__AdPlan.png">
          <span class="menu-item__name van-ellipsis">广告计划</span>
        </router-link>
      </div>
      <div class="menu-item van-col--8" v-if="menuLimitHas('business:tissueRecord:view')">
        <router-link to="/OutPaperRecord">
          <img class="menu-item__icon" src="../assets/img/icon__OutPaperRecord.png"/>
          <span class="menu-item__name van-ellipsis">出纸记录</span>
        </router-link>
      </div>
      <!--<div class="menu-item" v-if="menuLimitHas('business:device:view') || menuLimitHas('client:repair:view')">
        <router-link to="/ReplaceBoard">
          <span class="menu-item__icon">
            <van-icon name="setting"/>
          </span>
          <span class="menu-item__name van-ellipsis">设备换板</span>
        </router-link>
      </div>-->
      <div class="block__loading" v-if="!menuLimit.length"></div>
    </section>

    <!-- 最近出纸记录 -->
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
  </scroll-view>
</template>

<script>
  import { mapGetters } from "vuex";

  export default {
    name: "Home",
    data () {
      return {
        // 用户是否有菜单
        isMenu: false,
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
        limit: 5
      };
    },
    computed: {
      ...mapGetters(["userInfo", "wxUserBaseInfo", "menuLimit"])
    },
    watch: {
      "menuLimit": function (newV, oldV) {
        // 初始就进入
        if (newV.length) {
          this.menuHeight();
        }
      }
    },
    methods: {
      // 菜单权限判断
      menuLimitHas (value) {
        return this.menuLimit.indexOf(value) > -1;
      },
      // 动态计算菜单的高度
      menuHeight () {
        let menuSection = this.$refs.menuSection;
        this.$nextTick(function () {
          if (menuSection.scrollHeight > 0) {
            this.isMenu = true;
            // 等DOM 更新循环结束再设置height
            this.$nextTick(function () {
              menuSection.style.height = menuSection.scrollHeight + "px";
            });
          }
        });
      },
      // 出纸记录
      getOutPagerRecord (page, limit) {
        let _this = this;
        _this.$axios.post("/api/settle/settlementParam/selectzxtissuerecordlist", _this.$qs.stringify({
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
          _this.$dialog.alert({
            title: "系统发生错误",
            message: "错误码：xcHomeSelectzxtissuerecordlistCatch"
          });
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
      // 获取最近出纸记录
      this.getOutPagerRecord();
    },
    mounted () {
      // 从别的页面刷新进入
      if (!this.isMenu && this.menuLimit) {
        this.menuHeight();
      }
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
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    height: 0;
    padding: 0;
    overflow: hidden;
    transition: height .3s ease-in;
    &.menu-section--show {
      padding: 15px 0;
    }

    .menu-item {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
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
      /*background: radial-gradient(50% 50%, circle cover, #f1f1f1 0, #f9f9f9 100%);*/
    }

    .menu-item__name {
      display: block;
      height: 20px;
      line-height: 20px;
      margin-top: 8px;
      padding: 0 4px;
      font-weight: 600;
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
