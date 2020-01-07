import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {path:'login',component:箭头函数}
  // import使用:
  // 1.import xxx from xxx 模块化导入 //完整导入
  // 2.import(xxx) 函数调用 // 按需导入
  // 他们本质不是一回事
  // 如下是 import()函数调用,好处是按需导入
  { path: '/login', component: () => import('@/views/login') }
]

const router = new VueRouter({
  routes
})

export default router
