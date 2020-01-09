import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {path:'login',component:箭头函数}
  // import使用:
  // 1.import xxx from xxx 模块化导入 //完整导入
  // 1.1 {path:'login',component:箭头函数}
  // 2.import(xxx) 函数调用 // 按需导入
  // 他们本质不是一回事
  // 如下是 import()函数调用,好处是按需导入 用的话就导入,不用就不导入了
  // @符号代表src目录的绝对路径地址,以后就不用再写./ ../ 啥的了
  // index.vue是默认索引文件,不用设置,
  // { path: '/login', component: () => import('@/views/login/index.vue') }
  // name属性作用: 在编程式导航可以使用
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@/views/home'),
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 获得用户登录状态信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登录状态: userinfo是一个大字符串, 非登录状态 userinfo是null 获取不到,所以可以根据这个判断一下
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  // 如果秘钥没问题 就放行
  next()
})
export default router
