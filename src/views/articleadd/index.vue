<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <div class="text item">
        <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
          <el-form-item label="标题：" prop="title">
            <el-input placeholder="请输入内容" v-model="addForm.title" :style="{width:'400px'}" clearable></el-input>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <!-- <el-input placeholder="请输入内容" v-model="addForm.content" clearable> </el-input> -->
            <quillEditor v-model="addForm.content" :style="{width:'800px' }"></quillEditor>
          </el-form-item>
          <el-form-item label="图片：">
              <el-radio-group v-model="addForm.cover.type">
                <el-radio :label="0">无图</el-radio>
                <el-radio :label="1">一张</el-radio>
                <el-radio :label="3">3张</el-radio>
                <el-radio :label="-1">自动</el-radio>
              </el-radio-group>
              <ul>
                <li class="uploadbox" v-for="item in covernum" :key="item" @click="showDialog(item)">
                  <span>点击图标选择图片</span>
                  <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
                  <div v-else class="el-icon-picture-outline"></div>
                </li>
              </ul>
          </el-form-item>
<el-form-item label="频道：" prop='channel_id'>
            <el-select v-model="addForm.channel_id" placeholder="请选择" clearable>
              <el-option
               v-for="item in channelList"
               :key="item.id"
               :label="item.name"
               :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="想清楚在点：">
          <el-button type="success" round @click='addarticle(false)'>提交?</el-button>
          <el-button type="info" round @click='addarticle(true)'>草稿需要我</el-button>
          </el-form-item>
        </el-form>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="60%" @close="clearImage">
  <!-- 标签切换效果 -->
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="素材库" name="first">
      <!-- 素材图片列表展示 -->
      <ul>
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="没有图片" @click="clkImage">
        </li>
      </ul>
    </el-tab-pane>
    <el-tab-pane label="上传图片" name="second">
      <el-button type="primary">上传图片</el-button>
    </el-tab-pane>
  </el-tabs>

  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="imageOK">确 定</el-button>
  </span>
</el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'ArticleAdd',

  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor
  },
  computed: {
    covernum () {
      // 设计选择框显示个数
      // type>0  ========= type值
      // type<=0 ==========0 值
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      dialogVisible: false, // 素材对话框是否启用
      channelList: [], // 接收频道信息
      materialUrl: '', // 选中的素材图片的路径名地址信息
      xu: 0,
      activeName: 'first', // 默认激活标签
      imageList: [], // 素材图片列表
      // 获取素材图片的条件参数
      querycdt: {
        collect: false, // 非收藏图片
        page: 1,
        per_page: 12
      },
      addForm: {
        title: '', // 文章标题
        content: '',
        cover: {
          type: 0, // 选择上传几张图片的东西
          images: [],
          channel_id: '' // 频道
        }
      },
      addFormRules: {
        title: [
          { required: true, message: '空' },
          { min: 5, max: 30, message: '错了' }
        ],
        content: [{ required: true, message: '空' }],
        channel_id: [{ required: true, message: '空' }]
      }
    }
  },
  created () {
    this.getChannelList()
    this.getImageList() // 获得供选取的素材图片
  },
  methods: {
    // 获取频道列表信息
    getChannelList () {
      var pro = this.$http.get('/mp/v1_0/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('你没资格看文章 ' + err)
        })
    },
    // 获得图片列表
    getImageList () {
      let pro = this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get',
        params: this.querycdt
      })
      pro
        .then(result => {
          // console.log(result)
          // imageList接收素材图片
          this.imageList = result.data.data.results
        })
        .catch(err => {
          return this.$message.error('获得图片列表失败：' + err)
        })
    },
    // 素材图片被单击选中
    clkImage (evt) {
      // evt:事件对象
      // console.log(evt) // MouseEvent
      // evt.target: 目标被单击的dom的img对象
      // evt.target.parentNode // 获得父级li标签对象
      // 给li设置border边框效果

      // 全部项目的border都清除
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // 当前选中项目的border给设置好
      // let nowli = evt.target.parentNode
      // nowli.style.border = '5px solid rgb(236, 131, 10)'

      evt.target.parentNode.style.border = '5px solid rgb(236, 131, 10)'
      // 把当前选中图片的src地址信息赋予给meterialUrl成员
      this.materialUrl = evt.target.src
    },
    // 素材图片选取好，点击“对话框”确定按钮后，记录素材图片
    imageOK () {
      if (this.materialUrl) {
        // 给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('咋地，一个都没有相中！')
      }
    },
    // 展示对话框逻辑
    // n：代表第n个选择框被单击到了(值为1/2/3)
    showDialog (n) {
      // 更新xu成员,0/1/2分别代表选择框序号
      this.xu = n - 1
      this.dialogVisible = true // 开启对话框
    },
    // 恢复出厂设置
    clearImage () {
      // 清除border选中高亮效果
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      // 清除选中图片materialUrl地址
      this.materialUrl = ''
    },
    // 添加文章-收集数据存储--------------------------------------------------
    // flag:true  发布一个草稿文章
    // flag:false 发布一个正式文章
    addarticle (flag) {
      // 表单校验
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return false
        }
        // 把被添加的文章信息通过axios传递给服务器端存储
        // axios发起post请求的时候，不仅可以传递post数据还可以传递get请求字符串信息
        // this.$http.post(地址,post数据,get请求字符串信息)
        var pro = this.$http({
          url: '/mp/v1_0/articles',
          method: 'post',
          data: this.addForm,
          params: { draft: flag }
        })
        pro
          .then(result => {
            this.$message.success('文章发布成功')
            this.$router.push('/article')
          })
          .catch(err => {
            return this.$message.error('发布文章失败' + err)
          })
      })
    }
    // // 展示对话框逻辑
    // showDialog () {
    //   this.dialogVisible = true // 打开dialog对话框
    // }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
// 文章封面选择框样式
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid rgb(238, 238, 238);
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
