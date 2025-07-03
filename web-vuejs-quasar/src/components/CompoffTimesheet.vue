<template>
  <q-card
    class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm"
    style="width: 200px; min-height: 240px"
    :class="
      timesheet.CompoffStatus !== 'Pending'
        ? timesheet.CompoffStatus == 'Approved'
          ? 'border-primary'
          : 'border-secondary'
        : timesheet.border == 'border-brown'
        ? 'custom-border'
        : timesheet.border == 'border-secondary'
        ? timesheet.border
        : 'border-warning'
    "
  >
    <div class="q-pt-md">
      <div class="text-subtitle2 text-center" style="margin-top: -7px">
        {{ timesheet.user.user_name }}
      </div>
      <div class="text-subtitle2 text-center" style="margin-top: -3px">
        {{ convertDate(timesheet.date) }}
      </div>
      <div class="fs--10 text-center" style="margin-top: -0px">
        Mentor: {{ timesheet.mentor.name }}
      </div>
      <div
        class="fs--10 text-center"
        style="margin-top: -0px"
        v-if="!removeIfWorkingDay(timesheet.date)"
      >
        Compoff: {{ compOff }}
      </div>
    </div>
    <div v-if="timesheet.data" class="q-mx-sm custom_timesheet_table">
      <q-table
        style="height: 112px"
        dense
        flat
        hide-bottom
        :rows="timesheetTableData"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props" :title="props.row.name">
            {{ props.row.name }}
          </q-td>
        </template>
      </q-table>
    </div>
    <q-card-section v-else>
      <q-img height="112px" width="100%" :src="riddler"></q-img>
    </q-card-section>

    <q-separator light inset />

    <div style="margin-top: 5px">
      <div class="totalHours">
        <div style="margin-left: 24px">Total Hours:</div>
        <div
          style="display: flex; justify-content: space-between"
          :class="
            timesheet.actualHours > 0 || timesheet.actualTime > 0
              ? 'greaterHours'
              : 'lessHours'
          "
        >
          <div
            :style="
              timesheet.actualHours > 0 || timesheet.actualTime > 0
                ? 'margin-right:5px; text-decoration-line: line-through;'
                : ''
            "
          >
            {{ timesheet.data.totalHours }}
          </div>
          <div v-if="timesheet.actualTime > 0 || timesheet.actualHours > 0">
            <strong style="color: #c10015">{{ actualTime }}</strong>
          </div>
        </div>
      </div>
    </div>
    <q-card-actions class="justify-around">
      <q-btn
        icon="o_check"
        color="primary"
        class="fs--10"
        flat
        @click="onCompoffApproveReject('Approved')"
        v-if="
          timesheet.CompoffStatus == 'Pending' && timesheet.isLapsed == false
        "
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          class="bg-tip shadow-1"
          :offset="[10, 10]"
        >
          Approve
        </q-tooltip>
      </q-btn>
      <q-btn
        icon="o_cancel"
        color="negative"
        class="fs--10"
        flat
        @click="onCompoffApproveReject('Rejected')"
        v-if="
          timesheet.CompoffStatus == 'Pending' && timesheet.isLapsed == false
        "
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          class="bg-tip shadow-1"
          :offset="[10, 10]"
        >
          Reject
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        @click="openModel"
        :color="
          timesheet.CompoffStatus !== 'Pending'
            ? timesheet.CompoffStatus == 'Approved'
              ? 'primary'
              : 'secondary'
            : timesheet.color == 'brown'
            ? 'brown'
            : timesheet.color == 'secondary'
            ? timesheet.border
            : 'warning'
        "
        class="fs--10 text-color-enhance"
      >
        View Details
      </q-btn>
    </q-card-actions>
    <EditTimesheet
      :layout="layout"
      :editTimesheet="editTimesheet"
      @layoutFalse="getLayout"
    />

    <ViewTimeSheet
      v-if="
        (timesheet.color == 'warning' && users.includes(userType)) ||
        (timesheet.color == 'primary' && timesheet.status == 'Approved')
      "
      user-type="mentor"
      tabValue="compoff"
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
      @sheetRequest="getMentorRequest"
    >
    </ViewTimeSheet>
    <ViewTimeSheet
      v-else
      tabValue="compoff"
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
      @sheetRequest="getMentorRequest"
    >
    </ViewTimeSheet>
    <ConfirmReject
      :confirmReject="confirmRejectTimesheet"
      @confirmRejectClose="getConfirmRejectClose"
      @rejectUserSheets="onApprove(false)"
    />

    <q-dialog v-model="menteesRejectionPopUp" persistent>
      <q-card class="q-py-sm">
        <q-card-section>
          <div class="row">
            <div
              class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-sm"
            >
              Rejection Reason
            </div>
            <div
              class="q-px-sm"
              style="
                margin-left: 8px;
                display: flex;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div>
                Name : <strong>{{ timesheet.user.user_name }}</strong>
              </div>
              <div>
                Timesheet Date :
                <strong>{{ convertUTCToDate(timesheet.date) }}</strong>
              </div>
            </div>
            <div class="q-pt-md q-px-sm full-width">
              <q-radio
                size="xs"
                v-model="menteeReason"
                val="absent"
                :label="this.TEMP1 ? 'Close Timesheet' : 'Absent'"
              />
              <q-radio
                v-if="timesheet.actualTime == 0"
                size="xs"
                v-model="menteeReason"
                val="hourDifferent"
                label="Hours Different"
              />
              <div
                v-if="menteeReason == 'hourDifferent'"
                style="display: flex; margin-left: 8px"
              >
                <span style="margin-top: 20px">Actual timesheet hours is</span>
                <q-input
                  style="margin-left: 20px"
                  outlined
                  placeholder="hh:mm"
                  v-model="actualHours"
                  ref="timesheetRef"
                  mask="time"
                  :rules="[
                    (val) => val != '00:00' || 'time should be more than 0',
                    (val) =>
                      timeCalculation(val) || 'Please enter time < 24 hours',
                    (val) => !!val || 'Please enter time spent on task',
                    (val) =>
                      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val) ||
                      'Please enter valid time',
                  ]"
                >
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="justify-end">
          <q-btn flat @click="closeModel" color="negative" label="Close" />
          <q-btn flat @click="rejectSubmit" color="primary" label="Submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import EditTimesheet from "./TimeSheets/EditTimesheet.vue";
import * as functions from "../services/functions";
import ConfirmReject from "./TimeSheets/ConfirmReject.vue";
import ViewTimeSheet from "./TimeSheets/ViewTimeSheet.vue";
import * as eventService from "../services/events.service";

export default {
  components: {
    ViewTimeSheet,
    EditTimesheet,
    ConfirmReject,
  },
  methods: {
    removeIfWorkingDay(date) {
      return this.markedWorkingDays.includes(String(new Date(date)));
    },
    rejectSubmit() {
      let bool = false;
      if (this.menteeReason == "hourDifferent") {
        let value = this.$refs.timesheetRef.modelValue;
        var data = value
          .toString()
          .replace(/(<([^>]+)>)/gi, " ")
          .trim();
        var removespace = data.replace(/&nbsp;/g, " ").trim();
        value = removespace == "" ? removespace : value;
        bool =
          value == "00:00" ||
          !this.timeCalculation(value) ||
          !/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
            ? true
            : false;
        this.$refs.timesheetRef.foused = true;
        this.$refs.timesheetRef.validate();
      }
      if (!bool) {
        this.confirmRejectTimesheet = true;
      }
    },
    timeCalculation(val) {
      var convertedTime = 0;
      var data = val.toString();
      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);
      convertedTime = Number(hours) * 60 + Number(minutes);
      return convertedTime < 1440;
    },
    convertUTCToDate(date) {
      return functions.convertUTCToDate(date);
    },
    closeModel() {
      this.actualHours = "";
      this.menteeReason = "absent";
      this.menteesRejectionPopUp = false;
    },
    async getMentorRequest(value, timesheetData) {
      if (!value) {
        this.TEMP1 = await this.calculateSatSunByDate(timesheetData);
        this.menteesRejectionPopUp = true;
      } else {
        this.onApprove(value);
      }
    },
    editClicked(value) {
      this.editTimesheet = value;
      this.layout = true;
    },
    getLayout() {
      this.layout = false;
      this.$emit("resetData", false);
    },
    async onCompoffApproveReject(value) {
      if (value == "Rejected") {
        this.TEMP1 = await this.calculateSatSunByDate(this.timesheet.date);
        this.menteesRejectionPopUp = true;
      } else {
        if (value == "Approved") {
          this.$emit("approveCompoffSheet", {
            date: this.timesheet.date,
            user: this.timesheet.user.user_id,
            CompoffStatus: value,
            actualHours:
              this.menteeReason == "hourDifferent"
                ? this.timeConvert(this.actualHours)
                : this.timesheet.actualTime,
          });
        }
      }
    },
    calculateSatSunByDate(date) {
      if (new Date(date).getDay() == 0 || new Date(date).getDay() == 6) {
        return true;
      } else {
        return false;
      }
    },
    timeConvert(val) {
      var convertedTime = 0;
      var data = val.toString();
      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);
      return (convertedTime = Number(hours) * 60 + Number(minutes));
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    openModel() {
      this.viewTimesheet = true;
      this.timesheet.data;
    },
    closeViewModel(value) {
      this.viewTimesheet = value;
    },
    getConfirmRejectClose(value) {
      this.confirmRejectTimesheet = value;
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    calcCompoff() {
      if (this.totalTime >= 390) {
        this.compOff = 1;
      } else if (this.totalTime >= 180 && this.totalTime < 390) {
        this.compOff = 0.5;
      } else if (this.totalTime < 180) {
        this.compOff = 0;
      }
    },
    async onApprove(value) {
      if (value == true) {
        value = "Approved";
        if (value == "Approved") {
          this.menteesRejectionPopUp = false;
          this.$emit("approveCompoffSheet", {
            date: this.timesheet.date,
            user: this.timesheet.user.user_id,
            CompoffStatus: value,
            actualHours:
              this.menteeReason == "hourDifferent"
                ? Number(this.timeConvert(this.actualHours))
                : this.timesheet.actualTime,
          });
        }
        this.closeModel();
      } else {
        this.menteesRejectionPopUp = false;
        value = "Rejected";
        this.$emit("approveCompoffSheet", {
          date: this.timesheet.date,
          user: this.timesheet.user.user_id,
          CompoffStatus:
            this.menteeReason == "hourDifferent" ? "Approved" : "Rejected",
          actualHours:
            this.menteeReason == "hourDifferent"
              ? this.timeConvert(this.actualHours)
              : this.timesheet.actualTime,
        });
        this.closeModel();
      }
    },
    async fetchAllWorkingDays() {
      this.markedWorkingDays = [];
      const res = await eventService.fetchAllWorkingDays();
      res.data?.forEach((element) => {
        this.markedWorkingDays.push(String(new Date(element.date)));
      });
    },
  },

  props: {
    userType: {
      default: "user",
    },
    timesheet: {
      default: {},
    },
    tabType: {
      default: "",
    },
  },
  watch: {
    timesheet: {
      immediate: true,
      handler: function (value) {
        this.timesheetTableData = [];
        this.totalTime = 0;
        this.totalHours = 0;
        this.timesheet?.actualTime > 0
          ? ((this.totalTime += this.timesheet?.actualTime),
            (this.actualTime = this.convertTime(this.timesheet?.actualTime)))
          : "";
        this.timesheet?.data?.forEach((data) => {
          this.totalHours += data.time;
          this.timesheetTableData.push({
            name: this.capitalizeFirst(data.name),
            time: this.convertTime(data.time),
          });
          this.totalTime += this.timesheet?.actualTime > 0 ? 0 : data.time;
          this.timesheet.data.totalHours = this.convertTime(this.totalHours);
        });

        this.calcCompoff();
      },
      deep: true,
    },
  },
  data() {
    return {
      menteeReason: "absent",
      actualHours: "",
      menteesRejectionPopUp: false,
      layout: false,
      editTimesheet: "",
      users: ["mentor", "manager", "admin"],
      viewTimesheet: false,
      confirmRejectTimesheet: false,
      timesheetTableData: [],
      totalTime: 0,
      compOff: 0,
      actualTime: 0,
      totalHours: 0,
      markedWorkingDays: [],
    };
  },
  mounted() {
    this.fetchAllWorkingDays();
  },
};
</script>

<style>
.q-splitter__before,
.q-splitter__after {
  overflow: hidden;
}

.timesheet-card tbody tr td:first-child {
  overflow-x: hidden !important;
  text-overflow: ellipsis;
}

.timesheet-card .q-table {
  table-layout: fixed;
}

.view-all-timesheet .q-table--no-wrap th,
.view-all-timesheet .q-table--no-wrap td {
  white-space: initial;
}

.totalHours {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}

.text-line-decoration {
  text-decoration-line: line-through;
  margin-right: 10px;
}

.no-line-decoration {
  margin-right: 60px;
}

.greaterHours {
  margin-right: 24px;
}

.lessHours {
  margin-right: 60px;
}

.custom-border {
  border: 2px solid #a52a2a;
  border-radius: 10px;
}

.text-color-enhance.text-brown {
  color: rgb(165, 42, 42) !important;
}
</style>
