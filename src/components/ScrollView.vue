<template>
  <div class="scroll-view"
       :class="full ? 'scroll-view--full' : false"
       ref="scrollView"
       :style="style"
       @touchstart.stop="touchStart($event)"
       @touchmove.stop="touchMove($event)"
       @scroll.stop="scrollBind($refs.scrollView, $refs.scrollViewContent)">

    <div class="scroll-view__content" ref="scrollViewContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "scroll-view",
    data () {
      return {
        // 触摸Y起点
        touchPageYStart: null,
        // 触摸时记录scrollTop距离
        viewTopStart: null
      };
    },
    props: {
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
        this.touchPageYStart = event.pageY;
        this.viewTopStart = this.$refs.scrollView.scrollTop;
      },
      // 滑动
      touchMove (event) {
        let touchPageYMove = event.pageY;
        let viewScrollTop = this.$refs.scrollView.scrollTop;
        let viewOffsetHeight = this.$refs.scrollView.offsetHeight;
        let contentScrollHeight = this.$refs.scrollViewContent.scrollHeight;

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
    mounted () {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .scroll-view {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 46px);
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .scroll-view--full {
    height: 100%;
  }
</style>
