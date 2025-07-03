<template>
  <div class="fit row wrap justify-start items-start content-start custom_box">
    <div class="dashboard-calendar" data-id="dashboard-calendar">
      <q-date
        color="secondary"
        v-model="date"
        :events="eventsFn"
        :options="optionsFn"
        minimal
        @click.right="dateRightClick"
        @click.left="dateLeftClick"
        :event-color="(date) => colorFn(date)"
        ><q-popup-proxy
          v-model="showPopup"
          transition-show="flip-up"
          :target="selectedTarget"
          transition-hide="flip-down"
        >
          <div></div>
          <q-banner class="calendar-banner-options">
            <q-list>
              <q-item
                class="calendar-banner-list"
                :class="{
                  'q-mr-sm':
                    new Date().setDate(new Date().getDate() - 8) <=
                      new Date(selectedDate).getTime() &&
                    new Date().getTime() >= new Date(selectedDate).getTime() &&
                    !existDate.includes(selectedDate) &&
                    new Date(new Date(doj).getTime()).setHours(0, 0, 0, 0) <=
                      new Date(selectedDate).getTime() &&
                    !appliedLeavesRequests.includes(selectedDate) &&
                    !appliedLeaves.includes(selectedDate),
                }"
                v-if="
                  new Date(new Date(doj).getTime()).setHours(0, 0, 0, 0) <=
                    new Date(selectedDate).getTime() &&
                  !existDate.includes(selectedDate) &&
                  !holidays.includes(selectedDate) &&
                  !appliedLeavesRequests.includes(selectedDate) &&
                  !appliedLeaves.includes(selectedDate) &&
                  new Date(selectedDate).getDay() !== 0 &&
                  new Date(selectedDate).getDay() !== 6 &&
                  new Date().setDate(new Date().getDate() - 8) <=
                    new Date(selectedDate).getTime() &&
                  !(
                    new Date().getMonth() === 3 &&
                    this.calculateCurrentDate(selectedDate) <
                      this.calculateStartDateOfCurrentFinancialYear()
                  )
                "
              >
                <q-item-section avatar class="calendar-banner-list-section">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-tip shadow-1"
                    :offset="[10, 10]"
                  >
                    Apply For Leave
                  </q-tooltip>
                  <q-avatar
                    clickable
                    @click="applyLeave"
                    color="primary"
                    text-color="white"
                    icon="connecting_airports"
                    data-id="dashboard-calendar-applyforleave"
                  ></q-avatar>
                </q-item-section>
              </q-item>

              <q-item
                class="calendar-banner-list"
                v-if="
                  appliedLeaves.includes(selectedDate) &&
                  new Date(selectedDate).setHours(0, 0, 0, 0) >=
                    new Date().setHours(0, 0, 0, 0)
                "
              >
                <q-item-section avatar>
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-tip shadow-1"
                    :offset="[10, 10]"
                  >
                    Cancel Leave
                  </q-tooltip>
                  <q-avatar
                    clickable
                    @click="cancelLeave('leave')"
                    color="primary"
                    text-color="white"
                    icon="o_flight_land"
                  ></q-avatar>
                </q-item-section>
              </q-item>
              <q-item
                class="calendar-banner-list"
                v-if="
                  !appliedLeaves.includes(selectedDate) &&
                  appliedLeavesRequests.includes(selectedDate) &&
                  new Date(selectedDate).setHours(0, 0, 0, 0) >=
                    new Date().setHours(0, 0, 0, 0)
                "
              >
                <q-item-section avatar>
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-tip shadow-1"
                    :offset="[10, 10]"
                  >
                    Cancel Leave Request
                  </q-tooltip>
                  <q-avatar
                    clickable
                    @click="cancelLeave('leaveRequest')"
                    color="primary"
                    text-color="white"
                    icon="o_flight_land"
                    data-id="dashboard-calendar-cancelleave"
                  ></q-avatar>
                </q-item-section>
              </q-item>

              <q-item
                class="calendar-banner-list"
                v-if="
                  new Date(this.serverDate).setDate(
                    new Date(this.serverDate).getDate() - 8,
                  ) <= new Date(selectedDate).getTime() &&
                  new Date().getTime() >= new Date(selectedDate).getTime() &&
                  !existDate.includes(selectedDate) &&
                  new Date(new Date(doj).getTime()).setHours(0, 0, 0, 0) <=
                    new Date(selectedDate).getTime() &&
                  !appliedLeavesRequests.includes(selectedDate) &&
                  !appliedLeaves.includes(selectedDate) &&
                  !datesOfCompOff.includes(selectedDate)
                "
              >
                <q-item-section avatar>
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-tip shadow-1"
                    :offset="[10, 10]"
                  >
                    Add Timesheet
                  </q-tooltip>
                  <q-avatar
                    clickable
                    @click="openAddTimesheet"
                    color="primary"
                    text-color="white"
                    icon="event_note"
                    data-id="dashboard-calendar-addtimesheet"
                  ></q-avatar>
                </q-item-section>
              </q-item>

              <q-item
                class="calendar-banner-list"
                v-if="
                  new Date().getTime() > new Date(selectedDate).getTime() &&
                  new Date(doj1).getTime() <=
                    new Date(selectedDate).getTime() &&
                  new Date().getTime() >= new Date(selectedDate).getTime() &&
                  existDate.includes(selectedDate)
                "
              >
                <q-item-section avatar>
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-tip shadow-1"
                    :offset="[10, 10]"
                  >
                    View Timesheets
                  </q-tooltip>
                  <q-avatar
                    clickable
                    v-ripple
                    @click="$router.push('/daily-reports')"
                    color="primary"
                    text-color="white"
                    icon="o_event"
                    data-id="dashboard-calendar-viewtimesheet"
                  ></q-avatar>
                </q-item-section>
              </q-item>
            </q-list>
          </q-banner>
        </q-popup-proxy>
      </q-date>
      <div class="denote_color q-mt-sm">
        <ul style="column-count: 3; font-size: 9px; display: inherit">
          <li v-for="data in denoteColors" :key="data">
            <span
              class="color_dot"
              :style="{ backgroundColor: data.color }"
            ></span>
            <span> {{ data.text }} </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="dashboard-calendar-text">
      <q-card class="calendar-text">
        <q-card-section
          class="text-h6 headtext q-pa-none"
          style="font-size: 18px !important"
          data-id="timesheet-date-time"
        >
          {{ convertDate(date) }}
          <span
            v-if="
              totalProjectTimeByCurrentDate &&
              totalProjectTimeByCurrentDate != '00:00'
            "
            class="float-right"
            data-id="dashboard-totaltime"
            >{{ totalProjectTimeByCurrentDate + " hours" }}
          </span>
        </q-card-section>
        <div class="calendar-text-content">
          <q-card-section
            class="q-pt-none q-pb-none q-px-none"
            v-for="(sdata, index) in sheetData"
            v-bind:key="index"
            data-id="dashboard-projectdetails"
          >
            <hr />
            <div class="row">
              <div
                class="col-md-9 col-sm-8 col-xs-8 q-pr-sm text-subtitle2 text-left capitalize"
                data-id="dashboard-projectname"
              >
                {{ sdata.name }}
              </div>
              <div
                class="col-md-3 col-sm-4 col-xs-4 q-pr-sm text-subtitle2 text-right"
                data-id="dashboard-projecttime"
              >
                {{ convertTime(sdata.time) + " hours" }}
              </div>
            </div>
            <div
              class="row"
              v-for="(sheet, index) in sdata.sheets"
              :key="index"
            >
              <div
                class="col-md-9 col-sm-8 col-xs-8 q-pr-sm text-subtitle3 text-left"
                data-id="dashboard-taskname"
              >
                {{ sheet.description }}
              </div>
              <div
                class="col-md-3 col-sm-4 col-xs-4 q-pr-sm text-subtitle3 text-right"
                data-id="dashboard-tasktime"
              >
                {{ convertTime(sheet.time) + " hours" }}
              </div>
            </div>
          </q-card-section>
        </div>
        <AddTimeSheet
          :layoutTimeSheet="card"
          :fromCalender="fromCalender"
          @layoutTimeSheet="close"
          :selectedDatefromDashboard="selectedDate"
          :open="open"
          @open="getOpen"
          @close="getOpen"
        />
        <ApplyForLeave
          :layout="layout"
          @close="ApplayLeavePopClose"
          :selectedDatefromDashboard="selectedDate"
        />
      </q-card>
    </div>
    <q-dialog
      v-model="errorLayout"
      persistent
      transition-show="scale"
      transition-hide="scale"
      class="q-px-md"
    >
      <q-card class="text-black login-error q-px-md">
        <q-card-section>
          <div
            class="text-h6"
            data-id="dashboard-calendar-cancelleave-areyousure?"
          >
            Are you Sure?
          </div>
        </q-card-section>

        <q-card-section
          class="q-pt-none q-mr-lg"
          data-id="cancelleavewarningtext"
        >
          Would you like to cancel
          {{ onBtnCancelLeave ? "leave" : "leave request" }} of
          {{ convertDate(selectedDate) }}.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            color="negative"
            label="No"
            @click="errorLayout = false"
            data-id="dashboard-calendar-cancelleave-no"
          />
          <q-btn
            flat
            color="primary"
            label="YES"
            @click="onCancelLeaveR"
            v-if="onBtnCancelLeaveR"
            data-id="dashboard-calendar-cancelleave-yes"
          />
          <q-btn
            flat
            label="YES"
            color="primary"
            @click="onCancelLeave"
            v-if="onBtnCancelLeave"
            class="q-ml-lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import moment from "moment";
import ApplyForLeave from "../components/Leaves/ApplyForLeave.vue";
import * as eventsService from "../services/events.service";
import * as functions from "../services/functions";
import * as leavesService from "../services/leaves.service";
import * as TimesheetsService from "../services/timesheets.service";
import AddTimeSheet from "./AddTimeSheet.vue";
import Notify from "./Notify.vue";

export default {
  name: "Calendar",
  components: {
    AddTimeSheet,
    ApplyForLeave,
    Notify,
  },
  data() {
    return {
      layout: false,
      open: false,
      splitterModel: "",
      today: moment(),
      lastDateToFillSheet: false,
      showPopup: false,
      selectedTarget: null,
      date: "",
      data: null,
      doj: "",
      doj1: "",
      events: [],
      sheetData: [],
      existDate: [],
      pendingDate: [],
      rejectedDate: [],
      appliedLeaves: [],
      appliedLeavesRequests: [],
      holidays: [],
      errorLayout: false,
      selectedDate: "",
      totalProjectTimeByCurrentDate: "",
      card: false,
      fromCalender: false,
      skip: 0,
      serverDate: new Date(),
      denoteColors: [
        {
          text: "Approved",
          color: "#93BE3B ",
        },
        {
          text: "Approval Pending",
          color: "#F2C037 ",
        },
        {
          text: "Rejected",
          color: "#000080",
        },
        {
          text: "Not Submitted",
          color: "#ff5722",
        },
        {
          text: "Leave Applied",
          color: "#9c27b0",
        },
        {
          text: "Holiday",
          color: "#31CCEC",
        },
      ],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datesOfCompOff: [],
      datesOfMarkedWorkingDays: [],
      onBtnCancelLeaveR: false,
      onBtnCancelLeave: false,
      successMsg: "",
    };
  },
  created() {
    this.dateCalc();
    this.fetchServerDate();
    this.getLeavesRequests();
    this.getLeavesDate();
    this.getHolidays();
    this.fetchMyTimeSheets();
    this.fetchAllTimeSheetsByUserIdByDay();
    this.doj = new Date(
      this.$store.getters.user.dates.dateOfJoin,
    ).setMilliseconds(0);
    this.doj1 = new Date(this.$store.getters.user.dates.dateOfJoin).setHours(
      0,
      0,
      0,
      0,
    );
  },
  watch: {
    date: async function (newVal) {
      var dateofvisit = moment(newVal, "YYYY/MM/DD");
      if (
        this.today.diff(dateofvisit, "days") > 7 ||
        isNaN(this.today.diff(dateofvisit, "days"))
      ) {
        this.lastDateToFillSheet = true;
      } else {
        this.lastDateToFillSheet = false;
      }
      await this.fetchAllTimeSheetsByUserIdByDay();
    },
  },
  methods: {
    calculateStartDateOfCurrentFinancialYear() {
      let currentDate = new Date(this.serverDate);
      currentDate = new Date(new Date(currentDate.setMonth(3)).setDate(1));
      const startDate = new Date(
        new Date(currentDate).setFullYear(new Date(currentDate).getFullYear()),
      );
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1; // months are zero-indexed, so add 1
      const day = "01"; // set day to 01
      return `${year}/${month.toString().padStart(2, "0")}/${day}`;
    },
    calculateCurrentDate(date) {
      let currentDate = new Date(date);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // months are zero-indexed, so add 1
      const day =
        currentDate.getDate() < 10
          ? "0" + currentDate.getDate()
          : currentDate.getDate(); // set day to 01
      return `${year}/${month.toString().padStart(2, "0")}/${day}`;
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    async fetchServerDate() {
      const result = await eventsService.fetchAllWorkingDays();
      if (result.data.length > 0) {
        result.data.forEach((element) => {
          this.datesOfMarkedWorkingDays.push(
            String(new Date(new Date(element.date).setHours(0, 0, 0))),
          );
        });
      }

      const res = await TimesheetsService.getServerDate();
      this.serverDate = new Date(res.data);
      var dayIndex =
        this.serverDate.getDay() == 0 ? 7 : this.serverDate.getDay();

      if (dayIndex != 1) {
        const lastSundayDate = new Date(
          moment(this.serverDate).subtract(dayIndex, "days"),
        );
        const lastSaturdayDate = new Date(
          moment(this.serverDate).subtract(dayIndex + 1, "days"),
        );
        if (
          !this.datesOfMarkedWorkingDays.includes(
            String(new Date(new Date(lastSundayDate).setHours(0, 0, 0))),
          )
        ) {
          this.datesOfCompOff.push(this.dateConvert(lastSundayDate));
        }
        if (
          !this.datesOfMarkedWorkingDays.includes(
            String(new Date(new Date(lastSaturdayDate).setHours(0, 0, 0))),
          )
        ) {
          this.datesOfCompOff.push(this.dateConvert(lastSaturdayDate));
        }
      }
    },
    dateConvert(value) {
      var date = functions.convertUTCToDate(value);
      this.datesOfCompOff.push(date.split("/").reverse().join("/"));
      return date;
    },
    dateCalc() {
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      if (month < 10) {
        month = "0" + month;
      }

      if (date < 10) {
        date = "0" + date;
      }
      this.date = year + "/" + month + "/" + date;
    },
    addSheet() {
      this.open = true;
    },
    ApplayLeavePopClose() {
      this.layout = false;
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
      this.getHolidays();
      this.getLeavesRequests();
      this.getLeavesDate();
    },
    applyLeave() {
      this.showPopup = false;
      this.layout = true;
    },
    async getLeavesDate() {
      const res = await leavesService.fetchMyLeaves(
        this.$store.getters.userId,
        this.skip,
      );
      this.appliedLeaves = [];
      if (res.data.length > 0) {
        res.data.forEach((leave) => {
          if (
            leave.isShortfall != true &&
            (leave.status == "approved" ||
              leave.status == "autoApproved" ||
              (leave.status == "rejected" && leave.leaveType == "lwp"))
          ) {
            this.appliedLeaves.push(
              this.convertDateInCalenderFormat(leave.leaveDate),
            );
          }
        });
      }
    },
    async getLeavesRequests() {
      this.$q.loading.show();
      const res = await leavesService.leaveRequestsByUserId(
        this.$store.getters.userId,
      );
      this.appliedLeavesRequests = [];
      if (res.data.length > 0) {
        res.data.forEach((leave) => {
          if (leave.status != "cancelled" && leave.status != "rejected") {
            leave.leaveDates.map((date) => {
              this.appliedLeavesRequests.push(
                this.convertDateInCalenderFormat(date),
              );
            });
          }
        });
      }
      this.$q.loading.hide();
    },
    async getHolidays() {
      const res = await eventsService.fetchAllHolidays();
      this.holidayDate = [];
      res.data.forEach((holiday) => {
        if (holiday.status) {
          this.holidays.push(
            this.convertDateInCalenderFormat(holiday.holidayDate),
          );
        }
      });
    },
    async fetchMyTimeSheets() {
      const response = await TimesheetsService.fetchMyTimeSheetsForCalender(
        this.$store.getters.userId,
      );

      response.data.forEach((ele) => {
        let day = new Date(ele.reportDate).getDay();
        if (day == 0 || day == 6) {
          if (
            !this.existDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.existDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }
          if (
            (ele.CompoffStatus == "Rejected" || ele.isLapsed) &&
            !this.rejectedDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.rejectedDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }

          if (
            ele.CompoffStatus == "Approved" &&
            !this.pendingDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.pendingDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }
        } else {
          if (
            !this.existDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.existDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }

          if (
            ele.isApproved &&
            !this.pendingDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.pendingDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }
          if (
            ele.isRejected &&
            !this.rejectedDate.includes(
              this.convertDateInCalenderFormat(ele.reportDate),
            )
          ) {
            this.rejectedDate.push(
              this.convertDateInCalenderFormat(ele.reportDate),
            );
          }
        }
      });
    },
    async fetchAllTimeSheetsByUserIdByDay() {
      var changedDate = new Date(this.date).toDateString();
      const response = await TimesheetsService.fetchAllTimeSheetsByUserIdByDay(
        this.$store.getters.userId,
        changedDate,
      );
      this.sheetData = [];
      response.data.forEach((ele) => {
        if (
          moment(new Date(ele.reportDate)).diff(
            moment(new Date(this.date)),
            "days",
          ) == 0
        )
          this.timeSheets = this.addToArrayIfNotExist(this.sheetData, ele);
      });
      this.totalProjectTimeByCurrentDate = this.TotalTimePerDay();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    addToArrayIfNotExist(arr, project) {
      var sheet = [];
      var totalProjectSpentTime = 0;
      if (project.sheets.length === 0) {
        project.time = 0;
        sheet.push({
          description: "No Data Available.",
          time: 0,
        });
      } else {
        project.sheets.forEach((elesheet) => {
          totalProjectSpentTime += elesheet.timeSpent;
          sheet.push({
            description: elesheet.description,
            time: elesheet.timeSpent,
          });
        });
      }

      arr.push({
        name: project.project.name,
        time: project.time ? project.time : totalProjectSpentTime,
        actualTime: project.actualHours,
        sheets: sheet,
      });
      return arr;
    },
    eventsFn(date) {
      if (
        !this.existDate.includes(date) &&
        date <= this.convertDateInCalenderFormat(new Date())
      ) {
        return true;
      } else {
        return true;
      }
    },
    dateRightClick(event) {
      var eventValue =
        event.path || (event.composedPath && event.composedPath());
      var month =
        this.months.indexOf(
          document.querySelectorAll(".q-date__navigation .q-btn__content")[1]
            .innerText,
        ) + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var year = document.querySelectorAll(
        ".q-date__navigation .q-btn__content",
      )[4].innerText;
      if (
        Number(eventValue[0].innerText) <= 31 &&
        Number(eventValue[0].innerText) >= 1
      ) {
        let date = "";
        if (eventValue[0].innerText < 10) {
          date = "0" + eventValue[0].innerText;
        } else {
          date = eventValue[0].innerText;
        }
        this.selectedTarget = eventValue[0];
        this.selectedDate = year + "/" + month + "/" + date;
        this.showPopup = true;
      }
      event.preventDefault();
    },
    colorFn(date) {
      let color = "deep-orange";
      const d = new Date(date);
      if (d.getDay() == 0 || d.getDay() == 6) {
        color = "white";
      }
      if (this.existDate.includes(date)) {
        color = "warning";
      }
      if (d.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)) {
        color = "white";
      }
      if (this.holidays.includes(date)) {
        color = "blue";
      }
      if (this.pendingDate.includes(date)) {
        color = "primary";
      }
      if (this.rejectedDate.includes(date)) {
        color = "rejected";
      }
      if (this.appliedLeaves.includes(date)) {
        color = "purple";
      }
      if (this.appliedLeavesRequests.includes(date)) {
        color = "purple";
      }
      if (
        new Date(new Date(this.doj).setHours(0, 0, 0, 0)).getTime() >
        d.setHours(0, 0, 0, 0)
      ) {
        color = "white";
      }
      return color;
    },
    optionsFn(date) {
      return true;
    },
    openAddTimesheet() {
      this.showPopup = false;
      this.card = true;
      this.fromCalender = true;
      this.open = true;
    },
    close() {
      this.card = false;
      this.fromCalender = false;
      this.open = false;
      this.eventsFn(this.date);
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
      this.getHolidays();
      this.getLeavesRequests();
      this.getLeavesDate();
    },
    getOpen(value) {
      this.open = false;
      this.fromCalender = false;
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
      this.getHolidays();
      this.getLeavesRequests();
      this.getLeavesDate();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertDateInCalenderFormat(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
      var sdate = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
      return year + "/" + month + "/" + sdate;
    },
    TotalTimePerDay() {
      var totalTime = 0;
      if (this.sheetData[0]?.actualTime > 0) {
        totalTime += this.sheetData[0]?.actualTime;
      } else {
        this.sheetData.forEach((eleWork) => {
          totalTime += eleWork.time;
        });
      }
      return this.convertTime(totalTime);
    },
    convertTime(time) {
      let hour =
        time / 60 < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60);
      let minute = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      return hour + ":" + minute;
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    cancelLeave(val) {
      this.errorLayout = true;
      this.onBtnCancelLeave = false;
      this.onBtnCancelLeaveR = false;
      if (val == "leave") {
        this.onBtnCancelLeave = true;
      } else if (val == "leaveRequest") {
        this.onBtnCancelLeaveR = true;
      }
    },

    async onCancelLeaveR() {
      this.$q.loading.show();
      var str = this.selectedDate.split("/").reverse().join("/");
      var date = functions.convertDateToUTC(str);
      // finding leave id for the date
      const res = await leavesService.leaveRequestsByUserLeavesDate({
        userId: this.$store.getters.userId,
        date: date,
      });
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
      this.getHolidays();
      this.getLeavesRequests();
      this.getLeavesDate();
      this.errorLayout = false;
      this.successMsg = "Leave Request Cancelled!!";
      this.$q.loading.hide();
    },
    async onCancelLeave() {
      this.$q.loading.show();
      var str = this.selectedDate.split("/").reverse().join("/");
      var date = functions.convertDateToUTC(str);
      // // finding leave id for the date
      const res = await leavesService.fetchMyLeaves(this.$store.getters.userId);

      var leaveId = [];
      if (res.data.length > 0) {
        res.data.forEach((leave) => {
          if (
            new Date(date).setHours(0, 0, 0, 0) ==
            new Date(leave.leaveDate).setHours(0, 0, 0, 0)
          ) {
            leaveId.push(leave);
          }
        });

        // cancelling leave
        await leavesService.updateCancelledLeaveByUser({
          leaveId: leaveId[leaveId.length - 1]._id,
          leaveType: leaveId[leaveId.length - 1].leaveType,
          settled: true,
          status: "cancelled",
        });
      }
      this.fetchMyTimeSheets();
      this.fetchAllTimeSheetsByUserIdByDay();
      this.getHolidays();
      this.getLeavesRequests();
      this.getLeavesDate();
      this.errorLayout = false;
      this.successMsg = "Leave Cancelled!!";
      this.$q.loading.hide();
    },
    dateLeftClick() {
      this.showPopup = false;
    },
  },
};
</script>

<style>
.calendar-text {
  min-height: 376px;
  box-shadow: none;
}
.dashboard-calendar .q-date {
  width: 290px;
  height: 250px;
  min-height: 250px;
  max-height: 100%;
  display: block;
}
.dashboard-calendar .q-date__view {
  padding-right: 0px;
  height: 250px;
  width: 100%;
  min-height: 250px;
  padding: 5px;
}
.dashboard-calendar .q-date__view .q-date__calendar-days-container {
  min-height: 180px;
}
.dashboard-calendar-text {
  width: calc(100% - 340px);
}
.calendar-scroll-area {
  height: 118px;
}

.dashboard-calendar-text .calendar-text .text-h6 {
  padding-bottom: 0px;
}
.dashboard-calendar-text .q-card {
  height: 250px;
  min-height: 250px;
  max-height: 100%;
  background: none;
}
.calendar-text-content {
  overflow: auto;
  height: 250px;
}

.q-btn:has(.q-focus-helper) {
  /* color: green; */
}

.calendar-banner-options {
  padding: 8px;
  overflow: hidden;
}

.calendar-banner-list {
  padding: 0px;
  width: 40px;
  min-width: 40px;
  cursor: pointer;
  display: -webkit-inline-box;
}

.calendar-banner-list-section {
  padding: 0px;
  min-width: 40px;
}

@media (max-width: 700px) {
  .dashboard-calendar {
    width: 100%;
  }
  .dashboard-calendar-text {
    margin-top: 2%;
    width: 100%;
  }
  .calendar-scroll-area {
    height: 118px;
  }
}
</style>
