import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import  from 'element-ui'

// 导入全局样式文件
import '@/assets/css/global.css'

// 引入axios 文件
import '@/utils/ax.js'
// 饿了么-------------------------------------------------------
// // 引入饿了么全局css样式
// import 'element-ui/lib/theme-chalk/index.css'
// import ElementUI, { Row, Button, MessageBox, Message } from 'element-ui'

// ----------------------------------------------
// 注册全局的饿了么 组件和方法
// Vue.use(ElementUI)
// // 按需注册elmcss样式
// Vue.use(Row)
// Vue.use(Button)
// // 按需注册事件方法(原型继承)
// Vue.prototype.$confirm = MessageBox.confirm
// Vue.prototype.$message = Message
// 饿了么-------------------------------------------------------
// 绝对按需导入饿了么(element)组件
import '@/utils/element.js'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
