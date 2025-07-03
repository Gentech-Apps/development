<template>
  <highcharts :options="options"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import More from "highcharts/highcharts-more";
More(Highcharts);

export default {
  data() {
    return {
      options: {
        chart: {
          zoomType: "x",
          backgroundColor: "transparent",
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        subtitle: {
          enabled: false,
        },
        xAxis: {
          title: {
            text: "Hours",
          },
        },
        yAxis: {
          title: {
            text: "Weeks",
          },
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 1,
              },
              stops: [
                [0, Highcharts.getOptions().colors[0]],
                [
                  1,
                  Highcharts.color(Highcharts.getOptions().colors[4])
                    .setOpacity(0.5)
                    .get("rgba"),
                ],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 3,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },
        tooltip: {
          useHTML: true,
          pointFormat: "<b>{point.y}</b> Weeks",
        },
        series: [
          {
            type: "area",
            name: "",
            data: [],
          },
        ],
      },
    };
  },
  props: {
    chartData: {
      default: () => [],
    },
    title: {
      default: "",
    },
    yAxisTitle: {
      default: "",
    },
    type: {
      default: "users",
    },
  },
  watch: {
    chartData: function (value) {
      this.options.series[0].data = this.chartData;
    },
  },
  mounted() {
    this.options.series[0].data = this.chartData;
    this.options.title.text = this.title;
    this.options.yAxis.title.text = this.yAxistitle;
    this.options.series[0].name = this.yAxistitle;
  },
  components: {
    highcharts: Chart,
  },
};
</script>
