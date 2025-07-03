<template>
  <div class="gridStyle">
    <div v-for="client in allClients" :key="client.id">
      <div>
        <ClientNameBox
          :client="client"
          @openEditByProjectId="getProjectIdForEdit"
          @openAddByClientId="getClientIdForAdd"
          @openEditClientName="getClientInfoForEdit"
          @clientActiveInactive="getActiveInactiveClient"
          @projectActiveInactive="getActiveInactiveProject"
          @clientLeaveShowOrNot="clientLeaveShowOrNot"
        />
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
    clients: {
      immediate: true,
      deep: true,
      handler: function (value) {
        this.allClients = value;
        this.filterByClientAndProjects(this.searchProject);
      },
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
            client.project.filter(
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
    filterByClientAndProjects(searchStr) {
      if (searchStr === "" || searchStr === null) {
        this.allClients = [];
        this.allClients = this.clients;
      } else {
        this.allClients = [];
        this.allClients = this.clients.filter(
          (client) =>
            client.clientName.toLowerCase().indexOf(searchStr.toLowerCase()) >
              -1 ||
            client.project.filter(
              (project) =>
                project.name.toLowerCase().indexOf(searchStr.toLowerCase()) >
                -1,
            ).length > 0,
        );
      }
    },
    getProjectIdForEdit(value) {
      this.$emit("openEditWithProjectId", value);
    },
    getClientIdForAdd(value) {
      this.$emit("openAddByClientId", value);
    },
    getClientInfoForEdit(value) {
      this.$emit("openEditClientName", value);
    },
    getActiveInactiveClient(value) {
      this.$emit("clientActiveInactive", value);
    },
    clientLeaveShowOrNot(value) {
      this.$emit("clientLeaveShowOrNot", value);
    },
    getActiveInactiveProject(value) {
      this.$emit("projectActiveInactive", value);
    },
  },
};
</script>
<style>
.client-detail-box {
  width: 570px !important;
  height: 200px !important;
}

@media (min-width: 992px) {
  .gridStyle {
    display: grid;
    grid-template-columns: auto auto;
    gap: 10px;
  }
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
