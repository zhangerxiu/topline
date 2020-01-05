import Vue from 'vue'
import App from './App.vue'

// import  from 'element-ui'

// // 引入css样式
// import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, { Row, Button, MessageBox, Message } from 'element-ui'
Vue.use(ElementUI)
// 按需注册组件
Vue.use(Row)
Vue.use(Button)
// 按需注册事件方法(原型继承)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
