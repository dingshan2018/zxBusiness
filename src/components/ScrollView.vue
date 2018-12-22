<template>
  <div class="scroll-view"
       :class="full ? 'scroll-view--full' : false"
       ref="scrollView"
       :style="style"
       @touchstart.stop="touchStart($event)"
       @touchmove.stop="touchMove($event)"
       @scroll="scrollBind($refs.scrollView)">

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
        viewOffsetHeight: null,
        viewScrollHeight: null,
        touchPageYStart: null
      };
    },
    props: {
      full: Boolean,
      height: String
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
      scrollBind (targer) {
        let scrollTop = targer.scrollTop;
        if (this.viewScrollHeight - (this.viewOffsetHeight + scrollTop) <= 50) {
          // console.log('触底刷新')
        }
      }
    },
    mounted(){
      this.viewScrollHeight = this.$refs.scrollView.scrollHeight;
      this.viewOffsetHeight = this.$refs.scrollView.offsetHeight;
    }
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
