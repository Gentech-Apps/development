<template>
  <div>
    <div v-if="subTab == 'Missing Timesheet' && timesheet != null">
      <q-card
        class="leave-card bg-white text-secondary q-ma-sm"
        style="width: 200px; min-height: 150px; margin-top: 20px"
        :class="missingTimesheetdate == 0 ? 'border-primary' : 'border-danger'"
      >
        <q-card-section class="display-setting" data-id="timesheet-date">
          <div class="text-h6">{{ timesheet }}</div>
        </q-card-section>
        <q-card-actions class="display-setting">
          <q-btn
            flat
            label="Add Timesheet"
            color="primary"
            @click="layoutTrue"
            data-id="missingsheet-addtimesheet"
          />
        </q-card-actions>
      </q-card>
      <div
        class="q-mb-md justify-between full-width"
        style="display: inline-flex"
      >
        <AddTimeSheet
          @openTimesheetModal="openAddTimesheet"
          @layoutTimeSheet="layoutTimeSheetClose"
          :timesheetModal="timesheetModal"
          :selectedDatefromDashboard="selectedDate"
          :fromCalender="fromCalender"
        />
      </div>
    </div>
    <div v-if="ApplyDate != null && flag == true">
      <q-card
        class="leave-card bg-white text-secondary q-ma-sm"
        style="width: 200px; min-height: 150px; margin-top: 20px"
        :class="missingTimesheetdate == 0 ? 'border-primary' : 'border-danger'"
      >
        <q-card-section class="display-setting">
          <div class="text-h6">{{ ApplyDate }}</div>
        </q-card-section>
        <q-card-actions class="display-setting">
          <q-btn
            flat
            label="Apply for IR"
            color="primary"
            @click="visibiitytrue"
          />
        </q-card-actions>
      </q-card>
      <div class="q-px-md fs--10 text-center q-pt-sm">
        <ApplyIR
          v-if="afterMeIr"
          :viewModal="visibilityApplyIR"
          :serverDate="serverDate"
          @closeModal="closeApplyIR"
          @successIR="OnSuccessIR"
        />
      </div>
    </div>
    <div v-if="subTab == 'My Team Leaves' && !this.activeCards">
      <q-card
        class="leave-card bg-white text-secondary q-ma-sm border-primary"
        style="width: 200px; min-height: 150px; margin-top: 20px"
      >
        <div class="text-subtitle2 text-center" style="margin-top: 20px">
          {{ timesheet.userName }}
        </div>
        <q-card-section
          style="
            display: flex;
            align-items: flex-start;
            justify-content: center;
            min-height: 100px;
            padding: unset;
          "
        >
          <div
            :class="timesheet.monthData.length > 4 ? 'card-scroll' : ''"
            style="margin-top: 10px"
          >
            <div
              v-for="(monthData, i) in timesheet.monthData"
              :key="i"
              class="q-px-md"
            >
              <strong>{{ monthData.monthName }}</strong> -
              <div class="eclipse">
                {{ monthData.monthDates }}
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  class="bg-tip shadow-1"
                  :offset="[10, 10]"
                >
                  {{ monthData.monthDates }}
                </q-tooltip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="subTab == 'My Team Leaves' && this.activeCards">
      <q-card
        class="leave-card bg-white text-secondary q-ma-sm"
        style="
          width: 220px;
          min-height: 206px;
          margin-top: 20px;
          margin-left: 5px !important;
          margin-right: 5px !important;
        "
        :class="'border-primary'"
      >
        <q-card-section style="min-height: 206px">
          <div>
            <div class="text-subtitle2 text-center">
              {{ convertDate(timesheet.date) }}
            </div>
            <div
              class="leaveTable inboxMyTeamTable"
              :class="timesheet.userNames.length > 4 ? 'myTeamScroll' : ''"
              style="margin-top: 10px"
            >
              <q-table
                dense
                flat
                hide-bottom
                :rows="timesheet.userNames"
                :rows-per-page-options="[timesheet?.userNames?.length, 0]"
              >
                <template v-slot:body="props">
                  <q-tr>
                    <q-td class="eclipse">
                      {{ userNameCount(props.row.username) }}
                      <q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        class="bg-tip shadow-1"
                        :offset="[10, 10]"
                      >
                        {{ props.row.username }}
                      </q-tooltip>
                    </q-td>
                    <q-td style="text-transform: capitalize">
                      {{ props.row.status }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
const moment = require("moment");
import * as functions from "../services/functions";
import AddTimeSheet from "../components/AddTimeSheet.vue";
import ApplyIR from "./InternetReimbursement/ApplyIR.vue";
import * as timesheetsService from "../services/timesheets.service";

export default {
  name: "MissingTimesheetCount",
  components: {
    AddTimeSheet,
    ApplyIR,
  },
  data() {
    return {
      subTabName: "",
      totalsheets: {
        dates: [],
      },
      timesheetModal: false,
      fromCalender: false,
      selectedDate: "",
      changeDate: "",
      visibilityApplyIR: false,
      serverDate: "",
      flag: true,
      afterMeIr: false,
    };
  },
  async beforeMount() {
    this.subTabName = localStorage.getItem("subtabname");
    let x = localStorage.getItem("myinbox");
    const res = await timesheetsService.getServerDate();
    this.serverDate = new Date(res.data);
  },
  methods: {
    userNameCount(username) {
      return username.length > 16
        ? username.substr(0, username.length - 5) + "..."
        : username;
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    openAddTimesheet() {
      this.timesheetModal = true;
    },
    layoutTimeSheetClose() {
      this.timesheetModal = false;
      this.$emit("reloadTimesheetCard");
    },
    closeApplyIR() {
      this.visibilityApplyIR = false;
    },
    OnSuccessIR() {
      this.flag = false;
      this.$router.replace("/");
    },
    visibiitytrue() {
      this.visibilityApplyIR = true;
    },
    layoutTrue() {
      this.timesheetModal = true;
      this.fromCalender = true;
      let myMomentObject = moment(this.timesheet, "DD/MM/YYYY").toDate();
      let date = functions.convertReverseUTCToDate(myMomentObject);
      this.selectedDate = date;
    },
  },
  props: ["timesheet", "ApplyDate", "subTab", "activeCards"],
  watch: {
    timesheet: function (val) {
      this.changeDate = val;
    },
    ApplyDate: function (val) {
      if (val) {
        this.afterMeIr = true;
      }
    },
  },
};
</script>

<style>
.display-setting {
  display: flex;
  justify-content: center;
}

.leave_table_scroller .q-table {
  table-layout: fixed;
}

.leave_table_scroller .q-table__middle.scroll {
  overflow-x: hidden;
}
.leaveTable.inboxMyTeamTable tr td {
  font-size: 12px !important;
}
.leaveTable.inboxMyTeamTable th:first-child,
.leaveTable.inboxMyTeamTable td:first-child {
  padding-left: unset !important;
}
.leaveTable.inboxMyTeamTable th:last-child,
.leaveTable.inboxMyTeamTable td:last-child {
  padding-right: unset !important;
}

.card-scroll {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 88px;
}
.leaveTable.myTeamScroll .scroll {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 140px;
  padding-right: 5px;
}
.eclipse {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 92px;
  display: inline-block;
  vertical-align: bottom;
  cursor: pointer;
}
</style>
