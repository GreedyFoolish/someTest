const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "~": path.resolve(__dirname, "src"),
        assets: path.resolve(__dirname, "src/assets"),
        components: path.resolve(__dirname, "src/components"),
        views: path.resolve(__dirname, "src/views"),
        utils: path.resolve(__dirname, "src/utils"),
        api: path.resolve(__dirname, "src/api"),
      },
    },
  },
  // chainWebpack: (config) => {
  //   // 复制 tinymce 的皮肤文件到输出目录
  //   config.plugin("copy").tap(([options]) => {
  //     options[0].push({
  //       from: path.resolve(__dirname, "node_modules/tinymce/skins"),
  //       to: path.resolve(__dirname, "dist/js/skins"),
  //     });
  //     return [options];
  //   });
  // },
});
