<template>
  <div class="login-container">
      <div class="login-box">
        <el-form ref="loginFormRef" :model="loginForm">
          <el-form-item>
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginForm.code"  placeholder="请输入校验码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
            <span>我已阅读并同意用户协议和隐私条款</span>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%;" type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
    background-color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.login-box{
    width: 410px;
    height: 340px;
    background-color: white
}
</style>
