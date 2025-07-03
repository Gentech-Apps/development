<template>
  <div class="relative-position">
    <div id="pieChart" class="pie-chart-dashboard"></div>
    <div class="rangeSelector cursor-pointer absolute q-mt-lg">
      <li>
        <span class="text-italic text-weight-bold text-center"> Period </span>
      </li>
      <ul>
        <li
          v-for="(rsl, index) in rangeSelectors"
          v-bind:key="index"
          class="text-left"
          style="margin-left: -20px"
        >
          <span
            v-bind:class="{ 'text-weight-bold': active_el == index }"
            @click="getProjectByUserId(rsl.value, index)"
            >{{ rsl.Label }}</span
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import * as TimesheetsService from "../services/timesheets.service";

export default {
  name: "PieChart",
  mounted() {
    this.loadChart();
    this.getProjectByUserId();
  },
  data() {
    return {
      active_el: 4,
      chart: null,
      chartData: [],
      rangeSelectors: [
        {
          Label: "7 days",
          value: "lastWeek",
        },
        {
          Label: "30 days",
          value: "lastMonth",
        },
        {
          Label: "6 Months",
          value: "lastSixMonths",
        },
        {
          Label: "1 Year",
          value: "lastYear",
        },
        {
          Label: "All Time",
          value: "default",
        },
      ],
    };
  },
  methods: {
    loadChart() {
      this.chart = new Highcharts.Chart({
        chart: {
          renderTo: "pieChart",
          type: "pie",
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
            text: "Total Percent Time spent",
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
            name: "Projects",
            data: this.chartData,
            marginTop: -100,
            size: "70%",
            innerSize: "70%",
            showInLegend: true,

            dataLabels: {
              enabled: false,
            },
          },
        ],
      });
    },
    async getProjectByUserId(rangeValue, index) {
      var startDate;
      var date = new Date();
      var endDate = date.toISOString();
      if (rangeValue === "lastWeek") {
        date.setDate(date.getDate() - 7);
        startDate = date.toISOString();
        this.active_el = index;
      } else if (rangeValue === "lastMonth") {
        date.setMonth(date.getMonth() - 1);
        startDate = date.toISOString();
        this.active_el = index;
      } else if (rangeValue === "lastSixMonths") {
        date.setMonth(date.getMonth() - 6);
        startDate = date.toISOString();
        this.active_el = index;
      } else if (rangeValue === "lastYear") {
        date.setFullYear(date.getFullYear() - 1);
        startDate = date.toISOString();
        this.active_el = index;
      } else {
        date.setFullYear(date.getFullYear() - 150);
        startDate = date.toISOString();
        this.active_el = 4;
      }

      const response = await TimesheetsService.getTimeSpentByUser(
        this.$store.getters.userId,
        startDate,
        endDate,
      );
      this.chartData = [];
      response.data.forEach((ele) => {
        this.chartData.push({
          name: ele.name,
          y: ele.time,
        });
      });
      this.loadChart();
      this.chart.redraw();
    },
  },
  watch: {
    pieChartData: function (newValue) {
      this.loadChart();
      this.chart.redraw();
    },
  },
};
</script>

<style>
.pie-chart-dashboard .highcharts-container {
  height: 250px !important;
}
.pie-chart-dashboard .highcharts-root {
  height: 250px !important;
}
.rangeSelector {
  list-style: none;
  width: 115px;
  top: 0;
  right: 0;
}
.rangeSelector li:hover {
  font-weight: 500;
}

@media (max-width: 450px) {
  .rangeSelector {
    font-size: 0.8em;
    width: 82px;
  }
}
</style>
