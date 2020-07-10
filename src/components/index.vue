<template>
  <div>
    <div id="main" style="width:600px ; height:400px"></div>
  </div>
</template>

<script>
import { articlebychannel, channellist, http } from "../api/api";
export default {
  data() {
    return {
      //分类数据
      typelist: {},
      //文章数量
      num: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //视图
    viewtype(arr1, arr2) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "文章统计"
        },
        tooltip: {},

        xAxis: {
          data: arr1
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: arr2
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    //获取文章信息
    getData() {
      Promise.all([
        this.$http.get(http + channellist),
        this.$http.get(http + articlebychannel)
      ])
        .then(res => {
          this.typelist = res[0].data.data.map(item => {
            return item.name;
          });
          this.num = res[1].data.data.map(item => {
            return item.articles;
          }); 
          this.viewtype(this.typelist, this.num);
        })
        .catch(err => (location.href = "./login.html"));
    }
  }
};
</script>
<style scoped>
</style>

