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
        target: "http://192.168.10.149:8086" || "http://mp.dingscm.com",
        ws: true,
        changeOrigin: true,
        pathRewrite: function (path, req) {
          return path.replace("/api", "");
        }
      }
    }
  },
  // webpack配置
  chainWebpack: config => {
    // 使用cnpm可能会导致热更新失效，设置可恢复热更新
    config.resolve.symlinks(true);
    return config;
  }
};
