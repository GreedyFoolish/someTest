import Vue from "vue";
import App from "./App.vue";
import "./mock";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入 TinyMCE 核心文件
import "tinymce/tinymce";
import "tinymce/themes/silver";

Vue.config.productionTip = false;
Vue.use(ElementUI)

const app = new Vue({
  render: (h) => h(App),
});
app.$mount("#app");
