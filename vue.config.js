module.exports = {
  devServer: {
    port: 8080, //端口号 如果端口号被占用，会自动提升1
    host: "localhost", //主机名 127.0.0.1 真机0.0.0.0
    https: false, //协议
    open: true, //启动服务时自动打开浏览器
    proxy: {
      //匹配 /dev-api 开头的请求
      // "/dev-api": {
      [process.env.VUE_APP_BASE_API]: {
        //目标服务器，代理访问到http://localhost:8081
        // target: "http://localhost:8081",
        target: process.env.VUE_APP_SERVICE_URL,
        //开启代理：在本地会创建一个虚拟服务器，然后发送请求的数据，
        //并同时接收请求的数据，这样服务器端和服务器端进行数据的交互就不会有跨域问题
        changeOrigin: true, //开启代理
        pathRewrite: {
          //会将 /dev-api 替换为"", 也就是 /dev-api 会移除
          // "^/dev-api": ""
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },

  lintOnSave: false, // 格式检查
  productionSourceMap: false //打包是不会生成map文件，提高打包速度
};
