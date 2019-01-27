module.exports = {
  // 基本Url
  baseUrl: process.env.NODE_ENV === "production" ? "././" : "/",
  // 打包路径
  outputDir: "business",
  // 不打包Map
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    port: 9090,
    // 跨域代理
    proxy: {
      "^/api": {
        // target: "http://mp.bp.zcloudtechs.cn",
        target: "http://mp.dingscm.com",
        ws: true,
        changeOrigin: true
      },
    }
  },
  // webpack配置
  chainWebpack: config => {
    // 使用cnpm可能会导致热更新失效，设置可恢复热更新
    config.resolve.symlinks(true);
    return config;
  }
};
