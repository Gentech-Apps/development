<template>
  <highcharts :options="options" class="pie-chart-teams"></highcharts>
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import More from "highcharts/highcharts-more";
More(Highcharts);

export default {
  data() {
    return {
      chartData: [],
      options: {
        chart: {
          marginTop: -17,
          backgroundColor: "transparent",
        },
        credits: {
          enabled: false,
        },
        exporting: {
          buttons: [
            {
              enabled: true,
            },
          ],
        },
        title: {
          text: "",
        },
        yAxis: {
          title: {
            text: "Total Project Time spent",
          },
        },
        plotOptions: {
          pie: {
            shadow: false,
          },
        },
        tooltip: {
          formatter: function () {
            return (
              "<b>" +
              this.point.name +
              "</b>: <b>" +
              Math.floor(this.y / 60) +
              ":" +
              (this.y % 60) +
              "</b>"
            );
          },
        },
        colors: [
          "#4D4D4D",
          "#93be3b",
          "#5DA5DA",
          "#FAA43A",
          "#F17CB0",
          "#DECF3F",
          "#F15854",
          "#F0F8FF",
          "#00FFFF",
          "#7FFFD4",
          "#8A2BE2",
          "#A9A9A9",
          "#8B008B",
          "#8FBC8F",
          "#2F4F4F",
          "#FF1493",
          "#800080",
        ],
        series: [
          {
            type: "pie",
            name: "",
            data: [],
            marginTop: -100,
            size: "100%",
            innerSize: "70%",
            showInLegend: false,

            dataLabels: {
              enabled: false,
            },
          },
        ],
      },
    };
  },
  props: {
    projects: {
      default: () => [],
    },
    clientid: {
      default: 0,
    },
    title: {
      default: "",
    },
    yAxisTitle: {
      default: "",
    },
    type: {
      default: "projects",
    },
  },
  watch: {
    projects: function (value) {
      this.getProjectByClientId();
      this.options.series[0].data = this.chartData;
    },
  },
  mounted() {
    this.getProjectByClientId();
    this.options.series[0].data = this.chartData;
  },
  methods: {
    getProjectByClientId() {
      this.chartData = [];
      this.projects.forEach((ele) => {
        this.chartData.push({
          name: ele.name,
          y: ele.spentTimeTotal,
        });
      });
    },
  },
  components: {
    highcharts: Chart,
  },
};
</script>
