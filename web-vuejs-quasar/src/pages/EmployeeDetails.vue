<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="window-height appraisal_tab_width leave_tab_width"
      style="margin-left: -20px; height: 100% !important"
    >
      <!-- left side tabs -->
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="timesheet_tabs text-primary gen_tabs q-pt-xl custom-padding"
        >
          <q-list bordered class="menu-grouping-list rounded-borders">
            <q-tab
              class="font-weight q-tab--full"
              name="users"
              icon="o_group_add"
              @click="routeToLoadUsers"
              data-id="users"
              >Users</q-tab
            >
            <q-tab
              name="departments_and_designations"
              @click="routeToLoadDepartmentsAndDesignations"
              data-id="departments-and-designations"
              v-if="$store.getters.userType == 'admin'"
              class="font-weight q-tab--full"
            >
              <q-icon class="department-icon">
                <span class="material-symbols-outlined"> hub </span>
              </q-icon>
              Departments & <br />
              Designations
            </q-tab>
          </q-list>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          v-touch-swipe="handler"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="users">
            <UserLayout />
          </q-tab-panel>

          <q-tab-panel name="departments_and_designations">
            <div>
              <div class="denote_color">
                <ul>
                  <li v-for="data in denoteColors" :key="data">
                    <span
                      class="color_dot"
                      :style="{ backgroundColor: data.color }"
                    ></span>
                    <span> {{ data.text }} </span>
                  </li>
                </ul>
              </div>

              <q-splitter v-model="splitterModel" class="full-width">
                <template v-slot:before class="categories-window">
                  <div class="justify-between full-width">
                    <div
                      class="text-primary text-weight-medium text-center non-selectable title"
                    >
                      Departments
                    </div>

                    <q-btn
                      flat
                      label="Add Department"
                      color="primary"
                      @click="openAddDepartmentDialog"
                      class="q-ml-auto float-right"
                      data-id="add-department"
                    />

                    <div
                      class="scroll_timesheet leave-separator full-width"
                      style="height: 73.5vh !important"
                    >
                      <DepartmentDesignationCard
                        v-for="(department, index) in departments"
                        :key="index"
                        :departmentData="department"
                        :tab="tab"
                        @loadDesignations="loadAllDesignationsByDepartmentId"
                        @reloadLeaves="getDepartmentsByFilter()"
                        @updatedList="updateList"
                        @errorHandling="errorHandling($event)"
                      />
                    </div>
                  </div>
                </template>

                <template v-slot:after>
                  <div class="justify-between full-width">
                    <div
                      data-id="designation_heading"
                      class="text-primary text-weight-medium text-center non-selectable title"
                    >
                      {{ departmentName }} Designations
                      <q-tooltip> {{ departmentName }} Designations </q-tooltip>
                    </div>

                    <q-btn
                      flat
                      label="Add Designation"
                      color="primary"
                      @click="openAddDesignationDialog"
                      class="q-ml-auto float-right"
                      data-id="add-designation"
                    />

                    <div
                      class="scroll_timesheet leave-separator full-width"
                      style="height: 73.5vh !important"
                    >
                      <DepartmentDesignationCard
                        v-for="(designation, z) in designations"
                        :key="z"
                        :departmentData="designation"
                        :isDesignation="true"
                        :tab="tab"
                        @updatedList="updateList($event)"
                        @errorHandling="errorHandling($event)"
                      />
                    </div>
                  </div>
                </template>
              </q-splitter>

              <AddOrUpdateDepartmentAndDesignation
                v-if="openDialogBox"
                @close="closeDialog"
                :isSetDataForEdit="isSetDataForEdit"
                :isDesignation="isDesignation"
                @refreshDepartments="loadToDepartmentsAndDesignations"
                @errorHandling="errorHandling($event)"
                @successHandling="successHandling($event)"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <q-dialog
      v-model="errorLayout"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white login-error">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="warning" class="text-white" style="font-size: 2rem" />
            Oops
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errMsg }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            color="negative"
            label="OK"
            @click="errorLayout = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import Notify from "../../src/components/Notify.vue";
import AddOrUpdateDepartmentAndDesignation from "../components/DepartmentAndDesignation/AddOrUpdateDepartmentAndDesignation.vue";
import DepartmentDesignationCard from "../components/DepartmentAndDesignation/DepartmentDesignationCard.vue";
import { fetchAllDepartment } from "../services/departments.service";
import { fetchAllDesignation } from "../services/designations.service";
import UserLayout from "./Users.vue";
export default {
  components: {
    UserLayout,
    DepartmentDesignationCard,
    AddOrUpdateDepartmentAndDesignation,
    Notify,
  },
  data() {
    return {
      splitterModel: "",
      tab: "users",
      departments: [],
      designations: [],
      denoteColors: [
        {
          text: "Enabled",
          color: "#93BE3B ",
        },
        {
          text: "Disabled",
          color: "Black ",
        },
      ],
      openDialogBox: false,
      errorLayout: false,
      errMsg: "",
      isDesignation: false,
      isSetDataForEdit: false,
      successMsg: "",
      allActive: false,
      departmentName: "",
    };
  },
  methods: {
    openAddDepartmentDialog() {
      this.openDialogBox = true;
    },
    closeDialog() {
      this.openDialogBox = false;
      this.isDesignation = false;
    },
    openAddDesignationDialog() {
      this.openDialogBox = true;
      this.isDesignation = true;
    },
    async loadAllDesignationsByDepartmentId(event) {
      this.$q.loading.show();
      this.designations = this.filterDesignations.filter((ele) => {
        return ele.departments.includes(event._id.toString());
      });
      this.departmentName = event?.name;
      this.updateList();
      this.$q.loading.hide();
    },
    routeToLoadUsers() {
      this.$store.commit("changeTabName", "Users");
    },
    routeToLoadDepartmentsAndDesignations() {
      this.loadToDepartmentsAndDesignations();
    },
    async loadToDepartmentsAndDesignations() {
      this.designations = [];
      const res = await fetchAllDepartment();
      this.departments = res.data;
      const res1 = await fetchAllDesignation();
      this.filterDesignations = res1.data;
      this.loadAllDesignationsByDepartmentId(this.departments[0]);
      this.updateList();
      this.$store.commit("changeTabName", "Departments & Designations");
    },
    errorHandling(msg) {
      this.errMsg = msg;
      this.errorLayout = true;
    },
    successHandling(event) {
      this.successMsg = event.message;
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    updateList(event) {
      if (!event?.isDesignation && event?.data?.name) {
        this.departmentName = event.data.name;
        const updateDesignations = (designations) => {
          designations?.forEach((designation) => {
            if (designation.departments == event.data._id) {
              designation.Data.name = event.data.name;
              designation.Data.isActive = event.data.isActive;
            }
          });
        };
        updateDesignations(this.designations);
        updateDesignations(this.filterDesignations);
      }

      this.departments?.forEach((department) => {
        const departmentDesignations = this.filterDesignations?.filter(
          (designation) => designation.departments === department._id,
        );
        const anyActive = departmentDesignations?.some(
          (designation) => designation.isActive === true,
        );
        department.allActive = anyActive;
      });
      this.departments = this.sortByIsActiveAndName(this.departments);
      this.designations = this.sortByIsActiveAndName(this.designations);
    },
    sortByIsActiveAndName(arr) {
      return arr?.sort((a, b) => {
        if (a.isActive === b.isActive) {
          return a.name.localeCompare(b.name);
        }
        return b.isActive - a.isActive;
      });
    },
  },
  mounted() {
    this.$store.commit("changeTabName", "Users");
  },
};
</script>

<style scoped>
.title {
  font-size: 16px;
  text-transform: capitalize;
  color: rgb(0, 0, 0) !important;
  letter-spacing: 0.005em;
}

.appraisal_tab_width .q-splitter__panel.q-splitter__before {
  width: 13% !important;
}
.department-icon {
  font-size: 24px;
  margin: 5px 0;
}
.font-weight {
  font-weight: 500;
}
.leave-separator {
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
}
body {
  overflow: hidden;
}
</style>
