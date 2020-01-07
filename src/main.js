import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import  from 'element-ui'

// // 引入css样式
// import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, { Row, Button, MessageBox, Message } from 'element-ui'
// 导入全局样式文件
import '@/assets/css/global.css'
// 注册全局的饿了么 组件和方法
Vue.use(ElementUI)
// 按需注册组件
Vue.use(Row)
Vue.use(Button)
// 按需注册事件方法(原型继承)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
