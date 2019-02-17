<template>
  <div class="page-scroll"
       :class="full && 'page-scroll--full'"
       ref="pageScroll"
       :style="style"
       @touchstart="touchStart($event)"
       @touchmove="touchMove($event)"
       @scroll="scrollBind($refs.pageScroll, $refs.pageScrollContent)">
    <div class="page-scroll__content" ref="pageScrollContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "page-scroll",
    data () {
      return {
        // 触摸Y起点
        touchPageYStart: null,
        // 触摸时记录scrollTop距离
        viewTopStart: null
      };
    },
    props: {
      // 苹果顶部状态栏条
      iphoneBar: {
        type: Boolean,
        default: true
      },
      // height: 100%
      full: {
        type: Boolean,
        default: false
      },
      // 细腻的高度设置
      height: {
        type: String,
        default: ""
      },
      // 触发加载事件的距离
      pullUpOffset: {
        type: Number,
        default: 50
      },
      // 是否处于上拉加载中
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      // 上拉加载结束
      // 将不再触发上拉加载事件
      pullUpFinished: {
        type: Boolean,
        default: false
      },
      // touchStart是否冒泡
      touchStartStop: {
        type: Boolean,
        default: false
      },
      // touchMoveStop是否冒泡
      touchMoveStop: {
        type: Boolean,
        default: false
      },
      // scrollStop是否冒泡
      scrollStop: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      style: function () {
        return this.height ? {
          height: this.height
        } : false;
      }
    },
    methods: {
      // 触摸
      touchStart (event) {
        !this.touchStartStop && event.stopPropagation();
        this.touchPageYStart = event.pageY;
        this.viewTopStart = this.$refs.pageScroll.scrollTop;
      },
      // 滑动
      touchMove (event) {
        !this.touchMoveStop && event.stopPropagation();
        let touchPageYMove = event.pageY;
        let viewScrollTop = this.$refs.pageScroll.scrollTop;
        let viewOffsetHeight = this.$refs.pageScroll.offsetHeight;
        let contentScrollHeight = this.$refs.pageScrollContent.scrollHeight;

        // 边界判断
        /* eslint-disable vue/script-indent */
        if (viewScrollTop <= 0 && touchPageYMove >= this.touchPageYStart
          || contentScrollHeight <= viewOffsetHeight
          || viewOffsetHeight + viewScrollTop >= contentScrollHeight && touchPageYMove <= this.touchPageYStart) {
          event.preventDefault();
        }
      },
      // 滚动
      scrollBind (view, scroll) {
        !this.scrollStop && event.stopPropagation();
        let viewHeight = view.offsetHeight;
        let viewTop = view.scrollTop;
        let scrollHeight = scroll.scrollHeight;
        // 上拉加载
        if ((viewTop >= this.viewTopStart)
          && (scrollHeight - (viewHeight + viewTop) <= this.pullUpOffset)) {
          this.pullUpFinish();
        }
      },
      // 上拉加载
      pullUpFinish () {
        if (this.pullUpFinished || this.pullUpLoad) return;
        this.$emit("pull-up-finish");
      }
    },
    mounted () {
      if (this.full || !this.iphoneBar) return;
      let u = navigator.userAgent;
      // 终端设备类型
      if (u.indexOf("iPhone") > -1) {
        this.$nextTick(function () {
          let pageScroll = this.$refs.pageScroll;
          let barHeight = window.screen.height - window.screen.availHeight;
          pageScroll.style.height = pageScroll.offsetHeight - barHeight + "px";
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .page-scroll {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 44px - 50px);
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &.page-scroll--full {
      height: 100vh;
    }
  }

  .page-scroll__content {
    &::before,
    &::after {
      content: '';
      display: table;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    &::after {
      clear: both;
    }
  }
</style>
