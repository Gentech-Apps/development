<template>
  <div class="sidebar dashboard-sidebar">
    <q-layout class="height_unset">
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="true"
        :width="200"
        :breakpoint="100"
        bordered
        content-class="bg-grey-3"
        class="sidebar-menu-q-drawer"
        v-if="$store.getters.isAuthenticated"
        style="padding-top: 150%"
      >
        <q-scroll-area class="fit full_height_toChilds">
          <q-list padding class="sidebarpadding">
            <q-item
              clickable
              v-ripple
              v-show="checkRole(navItem.role, navItem.name)"
              v-for="navItem in routes"
              :key="navItem.name"
              @click="route(navItem.route)"
              :class="[$route.path == navItem.route ? 'active' : '']"
              :data-id="navItem.name"
            >
              <q-item-section avatar class="text-center">
                <q-icon
                  class="sidebar-menu-icons"
                  v-if="
                    navItem.icon == 'rule' ||
                    navItem.icon == 'dashboard' ||
                    navItem.icon == 'work_history' ||
                    navItem.icon == 'diversity_2' ||
                    navItem.icon == 'festival' ||
                    navItem.icon == 'assessment' ||
                    navItem.icon == 'connecting_airports' ||
                    navItem.icon == 'payments' ||
                    navItem.icon == 'attach_money' ||
                    navItem.icon == 'inventory' ||
                    navItem.icon == 'real_estate_agent'
                  "
                >
                  <span class="material-icons-outlined">
                    {{ navItem.icon }}
                  </span>
                </q-icon>
                <q-icon
                  class="sidebar-menu-icons"
                  v-else-if="navItem.icon == 'home_health'"
                >
                  <span class="material-symbols-outlined">
                    {{ navItem.icon }}
                  </span>
                </q-icon>

                <q-icon
                  class="sidebar-menu-icons"
                  v-else-if="navItem.icon == 'id_card'"
                >
                  <img
                    src="../assets/images/employee_details.svg"
                    alt="id_card"
                  />
                </q-icon>
                <q-icon
                  class="sidebar-menu-icons"
                  :name="navItem.icon"
                  v-else
                />
                <span class="fs--10">{{ navItem.name }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container class="full-page-container">
        <q-page padding>
          <router-view></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import moment from "moment";
import * as timesheetsService from "../services/timesheets.service";

export default {
  name: "PageIndex",
  components: {},
  data() {
    return {
      left: false,
      showActions: false,
      toolbarButtons: [
        {
          label: "Share",
          icon: "fa fa-share",
          action: () => {
            this.$router.push("/import");
          },
        },
        {
          label: "Save",
          icon: "fa fa-save",
          action: () => {},
        },
      ],

      drawer: "",
      miniState: "",
      name: "",
      accept: true,
      routes: [
        {
          name: "Dashboard",
          icon: "dashboard",
          route: "/",
          role: "user",
        },
        {
          name: "Employee Details",
          icon: "id_card",
          route: "/users",
          role: "manager",
        },
        {
          name: "Events",
          icon: "festival",
          route: "/events",
          role: "admin",
        },
        {
          name: "Daily Report",
          icon: "work_history",
          route: "/daily-reports",
          role: "user",
        },
        {
          name: "Leaves",
          icon: "connecting_airports",
          route: "/leaves",
          role: "user",
        },
        {
          name: "Appraisal",
          icon: "assessment",
          route: "/appraisal",
          role: "user",
        },
        {
          name: "Clients",
          icon: "diversity_2",
          route: "/clients",
          role: "manager",
        },
        {
          name: "Internet Reimbursement",
          icon: "cell_wifi",
          route: "/internetreimbursement",
          role: "user",
        },
        {
          name: "Crons",
          icon: "rule",
          route: "/crons",
          role: "admin",
        },
        {
          name: "Payroll",
          icon: "payments",
          route: "/payroll",
          role: "admin",
        },
        {
          name: "Inventories",
          icon: "inventory",
          route: "/inventories",
          role: "admin",
        },
        {
          name: "Loan",
          icon: "real_estate_agent",
          route: "/loan",
          role: "loanUser",
        },
        {
          name: "Mediclaim",
          icon: "home_health",
          route: "/mediclaims",
          role: "user",
        },
        {
          name: "Petty Cash",
          icon: "savings",
          route: "/petty-cash",
          role: "admin",
        },
      ],
      serverDateResponse: {},
    };
  },
  props: ["modal", "logoutUser"],
  watch: {
    logoutUser: function (value) {
      if (value) {
        this.logout();
      }
    },
  },
  async mounted() {
    const res = await timesheetsService.getServerDate();
    this.serverDateResponse = res.data;
  },
  methods: {
    onSubmit: function () {},
    onReset: function () {
      this.name = "";
      this.age = null;
    },
    route: function (value) {
      this.$router.push(value);
    },
    checkRole(role, name) {
      const userType = this.$store.getters.userType;
      const departments = this.$store.getters.user.departments;
      if (role == "user") return true;
      if (
        role == "mentor" &&
        (userType == "manager" || userType == "admin" || userType == "mentor")
      )
        return true;
      if (role == "manager" && (userType == "manager" || userType == "admin"))
        return true;
      if (
        (role == "admin" && userType == "admin") ||
        (name == "Events" &&
          departments.some(
            (dep) =>
              dep.name?.toLowerCase() === "admin" ||
              dep.name?.toLowerCase() === "human resource",
          )) ||
        (name == "Petty Cash" &&
          departments.some(
            (dep) =>
              dep.name?.toLowerCase() === "admin" ||
              dep.name?.toLowerCase() === "human resource",
          ))
      )
        return true;
      return role == "loanUser" && this.visibilityLoanMenu();
    },
    visibilityLoanMenu() {
      const givenDate = moment(this.$store.getters.user.dates.dateOfJoin);
      const today = moment(this.serverDateResponse);
      return (
        this.$store.getters.user.grade.toString() !== "G1" &&
        today.diff(givenDate, "months") >= 6
      );
    },
  },
};
</script>

<style>
.sidebarpadding {
  color: white;
  text-align: center;
  height: 100%;
}

.full-page-container {
  padding-left: 5% !important;
}
.sidebar-menu-q-drawer .q-drawer {
  width: 5% !important;
}
.sidebar-menu-icons {
  align-self: center;
  display: block;
}

.q-drawer--left.q-drawer--bordered {
  border-right: none !important;
}

.height_unset {
  height: unset !important;
  min-height: unset !important;
}

.q-page.q-layout-padding {
  min-height: unset !important;
  padding-bottom: 0 !important;
}

.full_height_toChilds .absolute.full-width {
  height: 100%;
}

.active > .q-focus-helper {
  background: #fff;
  opacity: 0.15 !important;
}

@media (min-width: 850px) {
  .full-page-container {
    padding-left: 6% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 6% !important;
  }
}
@media (min-width: 600px) and (max-width: 850px) {
  .full-page-container {
    padding-left: 8% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 8% !important;
  }
}
@media (min-width: 500px) and (max-width: 600px) {
  .full-page-container {
    padding-left: 12% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 12% !important;
  }
}
@media (max-width: 350px) {
  .full-page-container {
    padding-left: 15% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 15% !important;
  }
}
@media (min-width: 350px) and (max-width: 500px) {
  .full-page-container {
    padding-left: 14% !important;
  }
  .sidebar-menu-q-drawer .q-drawer {
    width: 15% !important;
  }
}
.q-drawer-container .q-drawer.q-drawer--left {
  width: 75px !important;
  background-color: #373737;
}
.dashboard-sidebar .q-drawer-container .q-scrollarea__thumb {
  width: 0px !important;
}
</style>
