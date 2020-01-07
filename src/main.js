import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import  from 'element-ui'
// 导入axios模块
import axios from 'axios'

// 导入全局样式文件
import '@/assets/css/global.css'

// 饿了么-------------------------------------------------------
// // 引入饿了么全局css样式
// import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, { Row, Button, MessageBox, Message } from 'element-ui'
// axios 配置公共根地址 (线上地址)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置weivue的继承成员
Vue.prototype.$http = axios
// 注册全局的饿了么 组件和方法
Vue.use(ElementUI)
// 按需注册elmcss样式
Vue.use(Row)
Vue.use(Button)
// 按需注册事件方法(原型继承)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
// 饿了么-------------------------------------------------------
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
