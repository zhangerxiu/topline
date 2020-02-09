<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>粉丝统计</span>
    </div>
    <div ref="main2" style="width: 600px;height:400px;"></div>
    <div ref="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
export default {
  name: 'Fans',
  // paintPic需要尽早被调用(以便显示图表效果)，要在mounted中调用(此时页面容器已经编译好并渲染完成了)
  mounted () {
    // 绘制图表
    this.paintPic()
    this.paint()
  },
  data () {
    return {
      myChart: null, // 接收echarts图表对象
      myy: null
    }
  },
  methods: {
    // 绘制图表
    paintPic () {
      // 基于准备好的dom，初始化echarts实例
      // 在Vue中获得页面元素有两种方式：
      // 1. dom方式，例如document.getElementById('main')
      // 2. ref方式，this.$refs.xxx  // el-form ref="loginForm" this.$refs.loginForm.validate()
      //    ref既可以获得组件对象 还可以获得html标签对象(与document.getElementById()表达意思相同)
      // var myChart = echarts.init(document.getElementById('main'))
      let dv = this.$refs.main2
      this.myChart = echarts.init(dv)

      // 饼形图的参数项目
      let option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 绘制图表
      // myChart.setOption(option)
      // 绘制图表
      this.myChart.setOption(option)

      // 获取数据对图表进行二次填充
      this.getFansStat()
    },

    // 获得对象的成员名称集合
    getkeys (obj) {
      var keys1 = []
      for (var p1 in obj) {
        if (obj.hasOwnProperty(p1)) { keys1.push(p1) }
      }
      return keys1
    },

    // 动态获得服务器真实粉丝数据
    getFansStat () {
    // axios发起请求(该接口不稳定，会提示404，多尝试即可)
      let pro = this.$http({
        url: '/mp/v1_0/statistics/followers',
        method: 'get'
      })
      pro
        .then(result => {
        // 把粉丝数据封装为option的样子
        // age:{le18:57,le23:71……}
        // 1. 把legend的data数据通过result组织
          let keys = this.getkeys(result.data.data.age)
          // console.log(keys) // ['le18','le23'……]
          // 2. 把series的data数据通过result组织
          let dataObj = []
          let ages = result.data.data.age
          for (var k in ages) {
          // 把 成员的key和value获得出来填充到dataObj里边
            dataObj.push({ value: ages[k], name: k })
          }
          // console.log(dataObj)
          let opt = {
            legend: {
            // data: ['le18', 'le23', 'le30', 'le40', 'le50']
              data: keys
            },
            series: [
              {
                data: dataObj
              }
            ]
          }
          // echarts图表对象调用setOption()
          this.myChart.setOption(opt)
        })
        .catch(err => {
          return this.$message.error('获得粉丝统计数据失败：' + err)
        })
    },
    // 英雄联盟
    paint () {
      // var myChart = echarts.init(document.getElementById('main'))
      let da = this.$refs.main
      this.myy = echarts.init(da)
      let op = {
        backgroundColor: '#2c343c',
        // backgroundColor: '#A1A1A1',

        title: {
          text: '爱情公寓5观后评价',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#ccc'
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '各大平台评论',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '笑点全靠张伟' },
              { value: 310, name: '我是来看诸葛大力的' },
              { value: 274, name: '大力我宣你' },
              { value: 235, name: '爱奇艺已卸载' },
              { value: 400, name: "一个字'垃圾'" }
            ].sort(function (a, b) { return a.value - b.value }),
            roseType: 'radius',
            label: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }
        ]
      }
      this.myy.setOption(op)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
