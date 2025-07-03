<template>
  <div>
    <div class="q-gutter-sm" style="position: relative">
      <q-dialog :persistent="true" v-model="viewTimesheet">
        <q-card
          :class="
            timesheetData.status == 'Approved' &&
            timesheetData.CompoffStatus == 'Pending' &&
            timesheetData.border != 'border-brown'
              ? timesheetData.border == 'border-secondary'
                ? 'border-secondary'
                : 'border-warning'
              : timesheetData.border == 'border-brown'
              ? 'custom-border'
              : timesheetData.border
          "
          class="view-all-timesheet"
        >
          <div>
            <q-card-section>
              <div class="row">
                <div
                  class="col-md-5 col-sm-5 col-xs-12 text-h6"
                  data-id="viewdetails-date"
                >
                  {{ convertDate(timesheetData.date) }}
                </div>
                <div
                  class="col-md-5 col-sm-5 col-xs-12 text-h6"
                  data-id="viewdetails-candidatename"
                >
                  {{ timesheetData.user.user_name }}
                </div>
                <div
                  class="col-md-2 col-sm-2 col-xs-12 text-h6"
                  data-id="viewdetails-totaltime"
                >
                  {{ TotalTimePerDay() + " hours" }}
                </div>
              </div>
            </q-card-section>
          </div>
          <div class="view_all_timesheet_scroll">
            <div
              class="row q-mx-md q-my-md"
              v-for="(worksheet, index) in timesheetData.data"
              :key="index"
            >
              <q-table
                style="width: 100%"
                :rows="worksheet.sheets"
                hide-bottom
                virtual-scroll
                :hide-pagination="true"
                :rows-per-page-options="[0]"
                data-id="viewdetails-task"
              >
                <template v-slot:top>
                  <div
                    class="col-md-10 float-left fs--18 capitalize"
                    data-id="viewdetails-projectname"
                  >
                    {{ worksheet.name }}
                  </div>
                  <q-space />
                  <div
                    class="col-md-2 q-pl-lg fs--18"
                    data-id="viewdetails-projecttime"
                  >
                    {{ convertTime(worksheet.time) + " hours" }}
                  </div>
                </template>

                <template v-slot:body-cell-time="props">
                  <q-td :props="props" data-id="viewdetails-tasktime">
                    {{ convertTime(props.row.time) + " hours" }}
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>

          <div>
            <q-card-actions class="justify-end">
              <q-btn
                v-if="
                  tabValue == 'compoff' &&
                  ((timesheetData.color == 'warning' &&
                    users.includes(userType) &&
                    timesheetData.status == !'Approved' &&
                    !timesheetData.oneTimeRejection &&
                    !timesheetData.isApproved) ||
                    (timesheetData.color == 'warning' &&
                      $store.getters.userType == 'admin'))
                "
                icon-right="o_check"
                color="primary"
                class="fs--14"
                flat
                label="Approve"
                @click="requestforSheet(true)"
              ></q-btn>
              <q-btn
                v-if="
                  tabValue == 'timesheet' &&
                  ((timesheetData.color == 'warning' &&
                    users.includes(userType) &&
                    timesheetData.status != 'Approved' &&
                    !timesheetData.isApproved &&
                    !timesheetData.oneTimeRejection) ||
                    (new Date(timesheetData.reportDate).getDay() != 0 &&
                      new Date(timesheetData.reportDate).getDay() != 6 &&
                      timesheetData.oneTimeRejection &&
                      users.includes(userType)))
                "
                icon-right="o_check"
                color="primary"
                class="fs--14"
                flat
                label="Approve"
                @click="requestforSheet(true)"
                data-id="viewdetails-approve"
              ></q-btn>
              <q-btn
                v-if="
                  tabValue == 'compoff' &&
                  ((timesheetData.color == 'warning' &&
                    users.includes(userType) &&
                    timesheetData.status == !'Approved' &&
                    !timesheetData.oneTimeRejection &&
                    !timesheetData.isApproved) ||
                    (timesheetData.color == 'warning' &&
                      $store.getters.userType == 'admin'))
                "
                icon-right="o_cancel"
                color="negative"
                class="fs--14"
                flat
                label="Reject"
                @click="requestforSheet(false)"
              ></q-btn>
              <q-btn
                v-if="
                  tabValue == 'timesheet' &&
                  timesheetData.color == 'warning' &&
                  users.includes(userType) &&
                  timesheetData.status != 'Approved' &&
                  !timesheetData.oneTimeRejection &&
                  !timesheetData.isApproved
                "
                icon-right="o_cancel"
                color="negative"
                class="fs--14"
                flat
                label="Reject"
                @click="requestforSheet(false)"
                data-id="viewdetails-reject"
              ></q-btn>
              <q-btn
                :color="
                  timesheetData.status == 'Approved' &&
                  timesheetData.CompoffStatus == 'Pending' &&
                  timesheetData.color !== 'brown'
                    ? timesheetData.color == 'secondary'
                      ? 'secordary'
                      : 'warning'
                    : timesheetData.color == 'brown'
                    ? 'brown'
                    : timesheetData.color == 'secondary'
                    ? timesheetData.color
                    : timesheetData.color
                "
                flat
                label="Close"
                class="fs--14 text-color-enhance"
                @click="closeModel"
                data-id="viewdetails-close"
              ></q-btn>
            </q-card-actions>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import * as functions from "../../services/functions";

export default {
  methods: {
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    TotalTimePerDay() {
      var totalTime = 0;
      this.timesheetData.data.forEach((eleWork) => {
        totalTime += eleWork.time;
      });
      return this.convertTime(totalTime);
    },
    closeModel() {
      this.$emit("viewTimesheet", false);
    },
    requestforSheet(value) {
      this.$emit("sheetRequest", value, this.timesheetData.date);
      this.closeModel();
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    checkWeeklyCronRunStatus(timesheet) {
      var serverDate = this.serverDate ? new Date(this.serverDate) : new Date();
      var date = new Date(timesheet.date);
      if (new Date(date).getDay() == 1) {
        var cronDate = new Date(
          new Date(
            new Date(date).setDate(new Date(date).getDate() + 14),
          ).setHours(14, 0, 0, 0),
        );
        if (new Date(serverDate).getTime() > cronDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else if (new Date(date).getDay() == 2) {
        var cronDate = new Date(
          new Date(
            new Date(date).setDate(new Date(date).getDate() + 13),
          ).setHours(14, 0, 0, 0),
        );
        if (new Date(serverDate).getTime() > cronDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else if (new Date(date).getDay() == 3) {
        var cronDate = new Date(
          new Date(
            new Date(date).setDate(new Date(date).getDate() + 12),
          ).setHours(14, 0, 0, 0),
        );
        if (new Date(serverDate).getTime() > cronDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else if (new Date(date).getDay() == 4) {
        var cronDate = new Date(
          new Date(
            new Date(date).setDate(new Date(date).getDate() + 11),
          ).setHours(14, 0, 0, 0),
        );
        if (new Date(serverDate).getTime() > cronDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else if (new Date(date).getDay() == 5) {
        var cronDate = new Date(
          new Date(
            new Date(date).setDate(new Date(date).getDate() + 10),
          ).setHours(14, 0, 0, 0),
        );
        if (new Date(serverDate).getTime() > cronDate.getTime()) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
  },
  props: {
    userType: {
      default: "user",
    },
    timesheetData: {
      default: {},
    },
    viewModel: {
      default: Boolean,
    },
    tabValue: {
      default: "timesheet",
    },
  },
  watch: {
    viewModel: function (value) {
      this.viewTimesheet = value;
    },
    timesheetData: function (value) {
      this.viewTimesheet = value;
    },
    tabValue: {
      immediate: true,
      handler: function (value) {},
      deep: true,
    },
  },
  data() {
    return {
      users: ["mentor", "manager", "admin"],
      viewTimesheet: false,
    };
  },
};
</script>

<style>
.q-dialog__inner .view-all-timesheet {
  height: fit-content;
  max-height: 80vh;
  width: 100%;
  max-width: 800px !important;
}

.view_all_timesheet_scroll {
  height: 60vh;
  overflow: auto;
}

.custom-border {
  border: 2px solid brown;
  border-radius: 10px;
}

.text-color-enhance.text-brown {
  color: #972800 !important;
}
</style>
