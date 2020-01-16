// 导入Vue
import Vue from 'vue'
import router from '@/router'
// 引入 json bigint
import JSONbig from 'json-bigint'
// 导入axios模块
import axios from 'axios'
// axios 配置公共根地址 (线上地址)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置weivue的继承成员
Vue.prototype.$http = axios
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token存在再做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 正常响应处理 token服务器有两个小时缓存时间,时间到了服务器的token消失,就返回401,这时用响应拦截器做操作,让他跳转到登录界面
  // 401报错是非正常的 所以要在非正常里写
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // 任何超出2xx范围的状态码都会触发此函数
  // Do something with response error  处理响应错误

  if (error.response.status === 401 && confirm('身份已过期')) {
    // response.status === 401 如果这个显示的是401
    // 让用户重新登录
    // this.$router.push('/login')// 在这不能用这种方法,这是用在组件上的 现在是js文件不能用这个
    // 这里需要先要导入路由
    router.push('/login')
    return new Promise(function () {})
  }
  return Promise.reject(error)
})
// 服务器返回,数据转换器 比响应拦截器更快一步
// 这个跟配置公共根地址前缀是一样的
axios.defaults.transformResponse = [function (data) {
  // data的返回形式有两种
  // 1. 实体字符串
  // 2. 空字符串(不能转的)
  // JSONbig.parse针对大整型进行处理，其他信息不给处理
  if (data) {
    return JSONbig.parse(data)
  }
  return data
}]
