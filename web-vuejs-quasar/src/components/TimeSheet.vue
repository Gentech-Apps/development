<template>
  <q-card
    class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm"
    style="width: 200px; min-height: 230px"
    :class="
      timesheet.border == 'border-brown' ? 'custom-border' : timesheet.border
    "
  >
    <div class="q-pt-md">
      <div
        class="text-subtitle2 text-center"
        style="margin-top: -7px"
        data-id="candidate-name"
      >
        {{ capitalizeFirst(timesheet.user.user_name) }}
      </div>
      <q-icon
        name="!"
        size="13px"
        :style="checkColor(timesheet.data)"
        style="
          position: absolute;
          right: 0;
          top: 0;
          margin: 12px 7px 0px 0px;
          border-radius: 9px;
          padding: 0 1px 2px 1px;
          color: white;
        "
      />
      <div
        class="text-subtitle2 text-center"
        style="margin-top: -3px"
        data-id="timesheetcard-date"
      >
        {{ convertDate(timesheet.reportDate) }}
      </div>
      <div
        class="fs--10 text-center"
        style="margin-top: -0px"
        data-id="candidate-mentorname"
      >
        Mentor: {{ timesheet.mentor.name }}
      </div>
    </div>
    <div v-if="timesheet.data" class="q-mx-sm custom_timesheet_table">
      <q-table
        style="height: 113px"
        dense
        flat
        hide-bottom
        :rows="timesheetTableData"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-name="props">
          <q-td
            :props="props"
            class="capitalize"
            data-id="timesheetcard-projectname"
          >
            {{ props.row.name }}
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              class="bg-tip shadow-1 capitalize"
              :offset="[10, 10]"
            >
              {{ props.row.name }}
            </q-tooltip>
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
          :class="timesheet.actualHours > 0 ? 'greaterHours' : 'lessHours'"
        >
          <div
            :style="
              timesheet.actualHours > 0
                ? 'margin-right:5px; text-decoration-line: line-through;'
                : ''
            "
            data-id="timesheetcard-totalhours"
          >
            {{ timesheet.data.totalHours }}
          </div>
          <div v-if="timesheet.actualHours > 0">
            <strong style="color: #c10015">{{ actualTime }}</strong>
          </div>
        </div>
      </div>
    </div>
    <q-card-actions class="justify-around">
      <q-btn
        v-if="
          timesheet.color == 'warning' &&
          users.includes(userType) &&
          timesheet.user.user_id != loggedInUserId &&
          timesheet.status != 'Approved' &&
          (new Date(timesheet.reportDate).getDay() != 0 ||
            new Date(timesheet.reportDate).getDay() != 6) &&
          timesheet.isRejected == false &&
          timesheet.isApproved == false
        "
        icon="o_check"
        color="primary"
        class="fs--10"
        flat
        @click="onApprove(true)"
        data-id="dailyreport-approve"
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
        v-if="
          timesheet.color == 'warning' &&
          users.includes(userType) &&
          timesheet.user.user_id != loggedInUserId &&
          timesheet.status != 'Approved' &&
          timesheet.oneTimeRejection != true &&
          timesheet.isApproved == false
        "
        icon="o_cancel"
        color="negative"
        class="fs--10"
        flat
        @click="openReject(timesheet.date)"
        data-id="dailyreport-reject"
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
        v-if="
          calculateSatSunByDate(timesheet.date)
            ? false
            : tabType == 'My TimeSheets' &&
              timesheet.color == 'negative' &&
              !users.includes(userType)
        "
        icon="o_edit"
        color="warning"
        flat
        @click="editClicked(timesheet)"
        style="margin-top: -10px"
        data-id="edittimesheet-button"
      >
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          class="bg-tip shadow-1"
          :offset="[10, 10]"
        >
          Edit
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        @click="openModel"
        :color="timesheet.color"
        class="fs--10 text-color-enhance"
        data-id="dailyreport-viewdetails"
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
      v-if="timesheet.color == 'warning' && users.includes(userType)"
      userType="mentor"
      tabValue="timesheet"
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
      @sheetRequest="getMentorRequest"
    >
    </ViewTimeSheet>
    <ViewTimeSheet
      v-else
      tabValue="timesheet"
      :timesheetData="timesheet"
      :viewModel="viewTimesheet"
      @viewTimesheet="closeViewModel"
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
              data-id="dailyreport-rejectionreason"
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
                data-id="rejectionreason-absent"
              />
              <q-radio
                size="xs"
                v-model="menteeReason"
                val="hourDifferent"
                label="Hours Different"
                data-id="rejectionreason-hoursdifferent"
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
                  data-id="rejectionreason-actualhours"
                >
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="justify-end">
          <q-btn
            flat
            @click="closeModel"
            color="negative"
            label="Close"
            data-id="rejectionreason-close"
          ></q-btn>
          <q-btn
            flat
            @click="rejectSubmit"
            color="primary"
            label="Submit"
            data-id="rejectionreason-submit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
import moment from "moment";
import * as functions from "../services/functions";
import * as TimesheetsService from "../services/timesheets.service";
import ConfirmReject from "./TimeSheets/ConfirmReject.vue";
import EditTimesheet from "./TimeSheets/EditTimesheet.vue";
import ViewTimeSheet from "./TimeSheets/ViewTimeSheet.vue";
export default {
  components: {
    ViewTimeSheet,
    EditTimesheet,
    ConfirmReject,
  },
  data: {
    totalHours: 0,
  },
  methods: {
    async openReject(date) {
      this.TEMP1 = await this.calculateSatSunByDate(date);
      this.menteesRejectionPopUp = true;
    },
    differenceInDays(from, to) {
      if (from && to) {
        const fromDate = moment(new Date(from));
        const toDate = moment(new Date(to));
        return fromDate.diff(toDate, "days");
      }
    },
    async onSubmit() {
      this.menteesRejectionPopUp = true;
    },

    calculateSatSunByDate(date) {
      if (new Date(date).getDay() == 0 || new Date(date).getDay() == 6) {
        return true;
      } else {
        return false;
      }
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
    closeModel() {
      this.actualHours = "";
      this.menteeReason = "hourDifferent";
      this.menteesRejectionPopUp = false;
    },
    timeCalculation(val) {
      var convertedTime = 0;
      var data = val.toString();
      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);
      convertedTime = Number(hours) * 60 + Number(minutes);
      return convertedTime < 1440;
    },
    async fetchServerDate() {
      const res = await TimesheetsService.getServerDate();
      this.serverDate = new Date(res.data);
    },
    async getMentorRequest(value, date) {
      if (!value) {
        this.TEMP1 = await this.calculateSatSunByDate(date);
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
    timeConvert(val) {
      var convertedTime = 0;
      var data = val.toString();
      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);
      return (convertedTime = Number(hours) * 60 + Number(minutes));
    },
    async onApprove(value) {
      let temp = await this.calculateSatSunByDate(this.timesheet.date);
      let num = 0;
      if (this.menteeReason == "absent" && !value) {
        num = 0;
      } else if (this.menteeReason == "hourDifferent" && !value) {
        num = this.timeConvert(this.actualHours);
      }

      this.menteesRejectionPopUp = false;
      this.$emit("approveUserTimeSheetData", {
        userId: this.timesheet.user.user_id,
        sheetsDate: this.timesheet.date,
        isApprove: value,
        isAbsent: this.menteeReason == "absent" && !value ? true : false,
        isLapsed: !value && this.menteeReason == "absent" ? true : false,
        actualHours: num,
        oneTimeRejection: num > 0 && !value ? true : false,
      });
      this.closeModel();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertUTCToDate(date) {
      return functions.convertUTCToDate(date);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    async openModel() {
      this.viewTimesheet = true;
      this.timesheet.data;
    },
    closeViewModel(value) {
      this.viewTimesheet = value;
    },
    getConfirmRejectClose(value) {
      this.confirmRejectTimesheet = value;
      this.timesheet.actualHours = this.timeConvert(this.actualHours);
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    checkColor(timesheetData) {
      let totalTime = 0;
      let sheetData = timesheetData;
      let extraTime = 540;
      let lessTime = 480;
      sheetData.forEach((sheet) => {
        totalTime += sheet.time;
      });
      if (totalTime > extraTime) {
        return "background-color:rgb(193, 0, 21)";
      } else if (totalTime < lessTime) {
        return "background-color:rgb(242, 192, 55)";
      } else {
        return "display:none";
      }
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
        this.totalHours = 0;
        this.timesheet?.actualHours > 0
          ? ((this.totalTime += this.timesheet?.actualHours),
            (this.actualTime = this.convertTime(this.timesheet?.actualHours)))
          : "";
        this.timesheet?.data.forEach((data) => {
          this.totalHours += data.time;
          this.timesheetTableData.push({
            name: this.capitalizeFirst(data.name),
            time: this.convertTime(data.time),
          });
          this.timesheet.data.totalHours = this.convertTime(this.totalHours);
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      TEMP1: false,
      layout: false,
      editTimesheet: "",
      users: ["mentor", "manager", "admin"],
      viewTimesheet: false,
      confirmRejectTimesheet: false,
      timesheetTableData: [],
      loggedInUserId: this.$store.getters.userId,
      pagination: {
        rowsPerPage: 0,
      },
      serverDate: null,
      menteesRejectionPopUp: false,
      menteeReason: "hourDifferent",
      actualHours: "",
      timesheetRef: null,
    };
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
  border: 2px solid brown;
  border-radius: 10px;
}

.text-color-enhance.text-brown {
  color: #972800 !important;
}
</style>
