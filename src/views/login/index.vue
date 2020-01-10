<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./yxlm.png" alt />
        <!-- prop代码是使校验规则可以找到当前目录进行匹配的校验,''引号里的值就是当前项目的名称 -->
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile"  placeholder="请输入手机号码">
          <!-- <i slot="prefix" class="el-icon-user-solid"></i> -->
          <i slot="prefix" class='iconfont icon-shouji'></i>

          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入校验码">
          <!-- <i slot="prefix" class="el-icon-s-promotion"></i> -->
          <i slot="prefix" class="iconfont icon-duanxinyanzhengzhuanhuan"></i>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align:left;" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px;"></el-checkbox>
          <span>
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私协议</a>
          </span>
        </el-form-item>

        <el-form-item>
          <el-button
          style="width:100%;"
          type="primary"
          @click="dl"
          :loading="isLoading"
          :disabled="isLoading"
          >登录</el-button>
          <!-- loading是按钮绕圈效果  disabled是禁用效果,禁止点击 -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// daoru阿里妈妈图标样式css
import '@/assets/f6/iconfont.css'
import './gt'
export default {
  name: '',
  data () {
    // 声明局部函数,实现校验
    var xieyi = function (rule, value, callback) {
      // rule: 校验规则,一般没用
      // value: 被校验的数据
      // callback: 回调函数,校验成功或失败都要执行
      if (value) {
        // 校验通过
        callback()
        // 校验不通过
      } else {
        callback(new Error('把勾点了'))
      }
    }
    // value ? callback() : callback(new Error('把勾点了')) 上面的if else可以简写为这样
    return {
      isLoading: false, // 设置按钮是否处于等待效果和是否禁用
      capobj: null, // 这就是一个data的一个成员 用于接收极验窗口对象,避免无用的div,出现第一次就保存下来
      loginForm: {
        // mobile: '15800008888', // 服务器给的手机号
        mobile: '13911111111', // 服务器给的手机号
        code: '246810', // 服务器给的验证码
        xieyi: true // 协议复选框
      },
      // 表单校验
      loginFormRules: {
        // 校验格式
        // 项目名称: [
        //   { 具体校验规则 },
        //   { 具体校验规则 }
        // ]
        // 几种校验规则: required:项目必填;
        // message:错误提示;
        // min:信息长度最小限制;
        // max:信息长度最大限制
        // 手机号码
        mobile: [
          { required: true, message: '你他娘的手机号没填' },
          { pattern: /^1[35789]\d{9}$/, message: '你他娘的自己手机号记不住吗?' }
        ],
        code: [{ required: true, message: '你手机欠费了?,收不到验证码?' }],
        // 协议
        xieyi: [
          // {validator:函数名字} 自定义校验
          { validator: xieyi }
        ]
      }
    }
  },
  methods: {
    // 登录系统
    dl () {
      // 点击登录按钮时表单要做校验
      // el - form表单对象.validate()
      // console.log(this) log一下获取到表单el-form的组件对象
      // this.$refs.loginFormRef.validate(回调函数)
      this.$refs.loginFormRef.validate(aa => {
        // 这里一定要写箭头函数,应为里面有this,普通函数的this就指向window
        // a:true 校验通过
        // a:false 校验失败
        if (!aa) {
          return false
        }
        // 这一步要写在极验前面.如果出现了极验就保存起来,下次极验的时候就特别快出现不会一直获取新div  ----判断极验窗口对象存在,就直接使用
        if (this.capobj !== null) {
          return this.capobj.verify() // 激活窗口显示
        }

        // 设置登录按钮等待和禁用状态(极验的那个)-------------------
        this.isLoading = true
        // 人机交互验证 ,就是极验-----------------------------------------------------
        // axios获得极验的秘钥信息
        let pr = this.$http({
          url: '/mp/v1_0/captchas/' + this.loginForm.mobile,
          method: 'get'
        })
        pr
          .then(result => {
            console.log(result)
            // console.log(result) // 极验的秘钥信息
            // 从result里边解构下述的data对象出来(对象结构赋值)
            let { data } = result.data
            // 请检测data的数据结构， 保证data.gt, data.challenge, data.success有值
            window.initGeetest({
              // 以下配置参数来自服务端 SDK
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: true,
              product: 'bind' // 设置验证窗口样式的
            }, captchaObj => {
              // captchaObj 就是极验窗口对象
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.onReady(() => {
                // 验证码ready之后才能调用verify方法显示验证码(可以显示窗口了)
                captchaObj.verify() // 显示验证码窗口
                // 接收极验窗口对象 赋值给上面的data小成员 catobj
                this.capobj = captchaObj
                // 设置登录按钮等待和禁用状态(极验的那个)-------------------
                this.isLoading = false
              }).onSuccess(() => {
                // 行为校验正确的处理
                // B. 验证账号，登录系统
                // 表单校验好了之后 做服务器端账号的真实校验 axios
                let pro = this.$http({
                  url: '/mp/v1_0/authorizations',
                  method: 'post',
                  data: this.loginForm
                })
                pro
                  .then(result => {
                    // 路由编程导航 this.$router.push('/home') 跳转到首页面
                    this.$router.push('/home')
                    // console.log(result); 里面有data 有秘钥信息
                    // 客户端浏览器把服务器端犯规的秘钥等相关信息通过sessionstorage做记录,表明是登录状态
                    window.sessionStorage.setItem('userinfo', JSON.stringify(result.data.data))
                  }).catch(err => {
                    // 这里是验证失败后 设一个弹框提示 用的是饿了么组件库的弹框
                    // this.$message({
                    //   type: 'info',
                    //   message: '写错了' + err
                    // })
                    // 上下效果一致
                    this.$message.error('写错了' + err)
                  })
              }).onError(() => {
                // 行为校验错误的处理
              })
            })
          })

          .catch(err => {
            return this.$message.error('获取极验秘钥失败' + err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-image: url("./0.jpg");
  //弹性布局 水平居中
  // display: flex;
  // justify-content: center;
  // align-items: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  background-position: center center
}
.login-box {
  width: 410px;
  height: 340px;
  background-color: rgb(44, 40, 40);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  width: 75%;
  text-align: center;
}
img {
  width: 60%;
  margin: 20px auto;
}
i{
  margin-left: 5px;
}
</style>
