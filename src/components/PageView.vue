<template>
  <div class="page-view"
       ref="pageView"
       :style="style"
       v-cloak>
    <div id="iosStatusBar" ref="iosStatusBar" v-if="isIPhone" @touchmove.stop.prevent></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "page-view",
    data () {
      return {
        isIPhone: false
      };
    },
    props: {
      // 苹果顶部状态栏条
      iphoneBar: {
        type: Boolean,
        default: true
      },
      // 细腻的高度设置
      height: {
        type: String,
        default: ""
      }
    },
    computed: {
      style: function () {
        return this.height ? {
          height: this.height
        } : false;
      }
    },
    created () {
      if (!this.iphoneBar) return;
      let u = navigator.userAgent;
      // 终端设备类型
      if (u.indexOf("iPhone") > -1) {
        this.isIPhone = true;
        this.$nextTick(function () {
          let barHeight = window.screen.height - window.screen.availHeight;
          this.$refs.iosStatusBar.style.height = barHeight + "px";
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .page-view {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #fff;
    overflow: hidden;
  }

  #iosStatusBar {
    z-index: 1000;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: transparent;
    overflow: hidden;
  }
</style>
