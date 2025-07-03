<template>
  <div>
    <div class="row" v-for="client in allClients" :key="client.id">
      <div class="col-md-5 col-sm-4 col-xs-12">
        <ClientNameBox
          :client="client"
          @openEditByProjectId="getProjectIdForEdit"
        />
      </div>
      <div class="col-md-2 col-sm-2 col-xs-12">
      </div>
      <div class="col-md-2 col-sm-2 col-xs-12">
      </div>
      <div class="col-md-3 col-sm-4 col-xs-12">
      </div>
    </div>
  </div>
</template>
<script>
import ClientNameBox from "./ProjectListComponents/ClientNameBox.vue";
import ProjectTimePieChart from "./ProjectListComponents/ProjectTimePieChart.vue";
import PersonTimePieChart from "./ProjectListComponents/PersonTimePieChart.vue";
import ProjectGraphChart from "./ProjectListComponents/ProjectGraph.vue";

export default {
  name: "ProjectList",
  components: {
    ClientNameBox,
    ProjectTimePieChart,
    PersonTimePieChart,
    ProjectGraphChart,
  },
  props: ["searchProject", "clients"],
  watch: {
    clients: function (value) {
      this.allClients = value;
    },
    searchProject: function (searchStr) {
      if (searchStr === "" || searchStr === null) {
        this.allClients = [];
        this.allClients = this.clients;
      } else {
        this.allClients = [];
        this.allClients = this.clients.filter(
          (client) =>
            client.clientName.toLowerCase().indexOf(searchStr.toLowerCase()) >
              -1 ||
            client.projects.filter(
              (project) =>
                project.name.toLowerCase().indexOf(searchStr.toLowerCase()) >
                -1,
            ).length > 0,
        );
      }
    },
  },
  data() {
    return {
      allClients: [],
    };
  },
  mounted() {
    this.allClients = this.clients;
  },
  methods: {
    refreshClientsData() {
    },
    getProjectIdForEdit(value) {
      this.$emit("openEditWithProjectId", value);
    },
  },
};
</script>

<style>
.client-detail-box {
  height: 200px;
}

/* BOTH PIE CHART CSS */
.pie-chart-teams .highcharts-plot-border {
  height: 250px !important;
}
.pie-chart-teams .highcharts-container {
  height: 250px !important;
}
.pie-chart-teams .highcharts-root {
  height: 250px !important;
}
.pie-chart-teams .highcharts-legend-item text {
  font-size: 16px !important;
}
</style>
