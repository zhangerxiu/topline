<template>
  <div>
    <!--搜索卡片区-->
    <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <!--匿名插槽，内容主体-->
      <div class="text item">
        <!--el-form搜索表单区域-->
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态：">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
            <el-radio v-model="searchForm.status" label="4">已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select v-model="searchForm.channel_id" placeholder="请选择" clearable>
              <el-option
               v-for="item in channelList"
               :key="item.id"
               :label="item.name"
               :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
     <el-card class="box-card">
      <!--命名插槽，头部内容-->
      <div slot="header" class="clearfix">
        <span>共找到{{tot}}条数据</span>
      </div>
       <el-table :data="articleList" style="width: 100%">
        <el-table-column prop="cover.images[0]" label="图标">
          <!-- 体现img图片标签效果
          想方设法把'当前数据记录'获得到,进而获得对应的 cover.images[0] ,下面的img标签不能直接用 cover.images[0] , 需要用到作用域插槽, 里面还有一个row属性-->
          <img :src="stData.row.cover.images[0]" slot-scope="stData" alt="没有图标"
       width="150" height="100">
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="状态">
           <!-- 获得“当前文章对象的status状态”数据，做判断进而显示对应的内容效果
作用域插槽要被使用，与获取图标原理一致-->
  <!-- 如果许多标签都需要接收插槽数据，处于代码优雅考虑，可以通过一个名称为template的父标签统一接收 -->
  <template slot-scope="stData">
    <el-tag v-if="stData.row.status===0">草稿</el-tag>
    <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
    <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
    <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
  </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
         <!-- 修改、删除不属于数据部分，只是普通的按钮，那么可以不用设置prop，对应的内容可以通过el-table-column的标签“内容区域”体现 -->
        <el-table-column label="操作">
          <template slot-scope="stData">
          <!-- <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button> -->
          <el-button type="primary" size="mini" class="iconfont icon-xiugaianniumian" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
          <!-- <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button> -->
         <el-button type="danger" size="mini" class="iconfont icon-shanchuanniu" @click="del(stData.row.id)">删除</el-button>
       </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件---------------------------------------------------------- -->
      <!-- <el-pagination
               @size-change="handleSizeChange"    事件,每页条数变化的回调处理
               @current-change="handleCurrentChange" 事件,当前页码变化的回调函数处理
               :current-page="currentPage4" 属性绑定,默认当前显示那个页码, 默认是第一页
               :page-sizes="[100, 200, 300, 400]"  属性绑定,下拉列表,设置每页显示条数
               :page-size="100" 属性绑定,这个跟上面是一起的,是设置默认每页显示多少条的,这的值必须是上面有的
               layout="total, sizes, prev, pager, next, jumper"  分页布局设置就是显示的样式, 元素构成
               :total="400"  属性绑定,设置记录总条数的
               >
</el-pagination> -->
<el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="searchForm.page"
               :page-sizes="[10, 20, 30, 40]"
               :page-size="searchForm.per_page"
               layout="total, sizes, prev, pager, next, jumper"
               :total="tot"
               >
</el-pagination>

         </el-card>
  </div>
</template>

<script>
import '@/assets/fffff/iconfont.css'
export default {
  name: '',
  // 监听器设置
  watch: {
    // 对searchForm做深度监听
    searchForm: {
      handler: function (newV, oldV) {
        this.getarticleList()
      },
      deep: true
    },
    // 被检测的成员: function (newV, oldV) {
    //   // newV:数据变化后样子
    //   // oldV:数据变化前样子
    // }
    // 被检测成员一般就是data成员,它们的名称保持一致
    timetotime: function (newV) {
      // 把接收到的时间信息一分为二给到 begin_pubdate 和 end_pubdate
      if (newV) {
        this.searchForm.begin_pubdate = newV[0]
        this.searchForm.end_pubdate = newV[1]
      } else {
        // 清除时间信息
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    }
  },
  created () {
    // 获得频道信息
    this.getChannelList()
    // 获得真实文章列表信息
    this.getarticleList()
  },
  methods: {
    // 分页相关,
    // 每条条数变化的回调处理
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getarticleList()
    },
    // 分页 每页变化
    handleCurrentChange (val) {
      // 形参随便写啥都行, val=变化后的页码
      // 更新页码
      this.searchForm.page = val

      // 根据变化后页码重新获得文章列表
      this.getarticleList()
    },
    // 获得真实频道列表数据
    getChannelList () {
      let pro = this.$http({
        url: '/mp/v1_0/channels',
        method: 'get'
      })
      pro
        .then(result => {
          // console.log(result)
          // data接收频道数据
          this.channelList = result.data.data.channels
        })
        .catch(err => {
          return this.$message.error('获得频道失败：' + err)
        })
    },
    getarticleList () {
      // 把searchForm内部为空的成员都"过滤掉"
      let searchData = {}
      for (var i in this.searchForm) {
        // i:代表对象的成员属性名称, status、channel_id、begin_pudate等等
        if (this.searchForm[i] || this.searchForm[i] === 0) {
          // 成员值非空
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http({
        url: '/mp/v1_0/articles',
        method: 'get',
        // get 请求传递参数, 如果不传递参数,地址栏不显示,后期做筛选也没办法做
        params: searchData

      })
      pro
        .then(result => {
          // data接收文章数据
          this.articleList = result.data.data.results
          // 接收总条数
          this.tot = result.data.data.total_count
        })
        .catch(err => {
          return this.$message.error('获得文章失败：' + err)
        })
    },
    // 删除文章
    del (id) {
      // 确认事情
      this.$confirm('确认要删除该文章么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // axios请求服务器端实现删除
        let pro = this.$http({
          url: '/mp/v1_0/articles/' + id,
          method: 'delete'
        })
        pro
          .then(result => {
            // 删除成功
            // console.log(result)  // 返回空的data数据
            // 直接页面刷新即可
            this.getarticleList()
          })
          .catch(err => {
            return this.$message.error('删除文章失败：' + err)
          })
      }).catch(() => {
      })
    }
  },
  data () {
    return {
      timetotime: '', // 时间范围临时接收成员
      channelList: [], // 频道列表
      articleList: [], // 文章列表
      tot: 0, // 文章总条数
      // 搜索表单数据对象
      searchForm: {
        channel_id: '',
        status: '',
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        page: 1, // 默认显示第几页
        per_page: 20 // 是分页每页显示多少个

      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card{
  margin-bottom: 20px;
}
.el-pagination{
  margin: 15px 0 0 120px
}
</style>
