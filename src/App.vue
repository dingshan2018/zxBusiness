<template>
  <div id="app" v-cloak @touchmove.stop.prevent>
    <transition name="van-fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    created () {
      this.$router.replace("/login");
    }
  };
</script>

<style lang="less">
  @base-green: #0ba84c;

  .input-group {
    margin-top: 40px;

    .van-field {
      width: calc(100% - 10px);
      margin-left: 10px;
    }
  }

  .block__model-title {
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    font-weight: 600;
    background-color: #f6f6f6;
  }

  .block__table-record {
    position: relative;
  }

  .block__loading {
    z-index: 10;
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    .block__loading-icon {
      display: inline-block;
      vertical-align: middle;
      width: 40px;
      height: 30px;
      margin: 0 auto;
      background: url("./assets/icon/loading__spinning-circles.svg") no-repeat center center/24px;
    }

    .block__loading-text {
      display: inline-block;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
      margin: 0 auto;
      font-size: 14px;
    }
  }

  .block__null {
    z-index: 1;
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    left: 0;
    height: 230px;
    padding: 15px 0;
    overflow: auto;
    background: url("./assets/icon/icon__null.svg") no-repeat center center/ auto 150px #fff;

    .block__null-text {
      position: absolute;
      top: calc(15px + 100px);
      left: calc(50% + 13px);
      text-align: center;
      font-size: 14px;
      transform: translate(-50%, -50%);
    }
  }

  .chart {
    position: relative;

    .block__null {
      top: 30px;
      background-position: center center;
      background-size: auto 120px;
    }

    .block__null-text {
      top: 50%;
      font-size: 12px;
      left: calc(50% + 10px);
    }
  }
</style>
