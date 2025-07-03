<template>
  <div
    v-bind:class="{
      'add-timesheet-scroll': $route.path != '/',
      'add-timesheet-dashboard q-ml-md q-mt-sm': $route.path == '/',
    }"
  >
    <q-btn
      v-if="this.$route.path === '/daily-reports'"
      flat
      label="Add Timesheet"
      color="primary"
      @click="layoutTrue"
      data-id="dailyreport-addtimesheet"
    />

    <div>
      <q-dialog :persistent="true" v-model="layoutTimeSheet">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div class="col-md-7 col-sm-7 col-xs-12 text-h6">
                    Add Timesheet
                  </div>
                  <div class="col-md-5 col-sm-5 col-xs-12 text-h6">
                    <q-input
                      outlined
                      label="Select Date"
                      v-model="dateDisplay"
                      lazy-rules
                      dense
                      :rules="TDRequired"
                      readonly
                      @click="
                        !disableDatePicker && existDate
                          ? $refs.qDateProxy.show()
                          : null
                      "
                    >
                      <template v-slot:append>
                        <q-icon
                          name="insert_invitation"
                          class="cursor-pointer"
                          @click="
                            !disableDatePicker && existDate
                              ? $refs.qDateProxy.show()
                              : null
                          "
                        >
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                            v-if="existDate"
                          >
                            <q-date
                              v-model="date"
                              minimal
                              :options="optionsFn"
                              mask="DD/MM/YYYY"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Ok"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
    </div>

    <div>
      <q-dialog :persistent="true" v-model="layoutTimeSheet">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div
                    class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-md"
                  >
                    Add Timesheet
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="$store.getters.mentorName"
                      label="Mentor name"
                      readonly
                      lazy-rules
                      dense
                      style="max-width: 300px; margin-left: 7px"
                      data-id="addtimesheet-mentorname"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="dateDisplay"
                      lazy-rules
                      label="Select Date"
                      dense
                      :rules="TDRequired"
                      readonly
                      @click="
                        !disableDatePicker && existDate
                          ? $refs.qDateProxy.show()
                          : null
                      "
                      data-id="addtimesheet-selectdate"
                    >
                      <template v-slot:append v-if="!disableDatePicker">
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                          data-id="calendar-icon"
                        >
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-if="!open"
                              v-model="date"
                              minimal
                              :options="optionsFn"
                              data-id="timesheet-calendar"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Ok"
                                  color="primary"
                                  flat
                                  data-id="addtimesheet-ok"
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>
            <div class="row q-mx-md q-mysm">
              <div class="col-md-6 col-sm-6 col-xs-12" style="margin-left: 7px">
                <SelectProject class="col-md-6" v-on:projects="getProjects" />
              </div>
              <div
                v-if="totalTime > 0"
                class="col-md-6 col-sm-6 col-xs-12 q-pt-sm"
              >
                <label
                  class="float-right text-h6"
                  data-id="addtimesheet-totaltime"
                >
                  {{ hours }}:{{ minutes }} Hours
                </label>
              </div>
            </div>
            <div style="max-height: 250px; overflow-y: auto">
              <q-card
                v-for="project in formData"
                :key="project.label"
                class="q-mx-lg q-my-md"
                style="border-radius: 15px"
                data-id="project-section"
              >
                <q-card-section>
                  <div
                    class="fs--16"
                    data-id="project-name"
                    style="text-transform: capitalize"
                  >
                    {{ project.label }}
                  </div>
                  <div
                    class="row"
                    v-for="(detail, idx) in project.detail"
                    :key="detail.detailId"
                  >
                    <div class="col-8">
                      <div class="q-pr-md q-py-md resize-textarea">
                        <q-input
                          style="margin-top: -15px; height: 120px"
                          v-model="detail.description"
                          outlined
                          type="textarea"
                          placeholder="Description"
                          :rules="[
                            (val) =>
                              (val && val.length > 0) ||
                              'Please type something',
                          ]"
                          data-id="addtimesheet-description"
                        />
                      </div>
                    </div>
                    <div class="col-4">
                      <div>
                        <q-input
                          outlined
                          placeholder="hh:mm"
                          v-model="detail.timeSpent"
                          mask="time"
                          :rules="timeSpentRules()"
                          data-id="addtimesheet-time"
                          ref="myTimesheetRef"
                        >
                        </q-input>
                      </div>

                      <div class="q-pb-sm" style="float: right">
                        <q-btn
                          flat
                          v-if="idx > 0"
                          round
                          color="negative"
                          icon="delete"
                          @click="remove(project.projectId, detail.detailId)"
                          data-id="addtimesheet-remove"
                        >
                          <q-tooltip
                            anchor="top middle"
                            self="bottom middle"
                            class="bg-tip shadow-1"
                            :offset="[10, 10]"
                          >
                            Remove
                          </q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          color="primary"
                          v-if="project.detail.length - 1 == idx"
                          icon="add"
                          class="q-ml-md"
                          @click="add(project.projectId)"
                          data-id="addtimesheet-adddescription"
                        >
                          <q-tooltip
                            anchor="top middle"
                            self="bottom middle"
                            class="bg-tip shadow-1"
                            :offset="[10, 10]"
                          >
                            Add
                          </q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div>
              <div id="errMsg">
                <p
                  class="error"
                  v-if="offset"
                  style="color: red; margin-left: 20px"
                >
                  Please set Time Zone as per india time
                </p>
              </div>
              <q-card-actions class="justify-end">
                <q-btn
                  color="negative"
                  flat
                  v-close-popup
                  label="cancel"
                  @click="onClose"
                  data-id="addtimesheet-cancel"
                />
                <q-btn
                  flat
                  v-if="formData.length > 0"
                  type="submit"
                  color="primary"
                  label="Submit"
                  data-id="addtimesheet-submit"
                />
              </q-card-actions>
            </div>
          </q-form>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="errorLayout"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-negative text-white login-error">
          <q-card-section>
            <div class="text-h6">
              <q-icon
                name="warning"
                class="text-white"
                style="font-size: 2rem"
              />
              Invalid Date
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
    </div>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import moment from "moment";
import { TimeValidationRules } from "../constants/timesheet";
import { ErrorValidationMessages } from "../constants/usersConstant";
import * as eventsService from "../services/events.service";
import * as functions from "../services/functions";
import * as leavesService from "../services/leaves.service";
import * as timesheetsService from "../services/timesheets.service";
import Notify from "./Notify.vue";
import SelectProject from "./TimeSheets/SelectProject.vue";

var detailId = 0;

export default {
  components: {
    SelectProject,
    Notify,
  },
  props: [
    "selectedDatefromDashboard",
    "open",
    "layoutTimeSheet",
    "timesheetModal",
    "fromCalender",
  ],
  data() {
    return {
      path: "",
      hours: "",
      minutes: "",
      existDate: [],
      dateValidation: [],
      projectDescription: [],
      today: new Date(),
      requestDate: "",
      index: 0,
      preDate: "",
      totalTime: 0,
      timeSpent: "",
      selectedOptions: [],
      serverDate: new Date(),
      date: new Date(),
      dateDisplay: "",
      formData: [],
      disableDatePicker: false,
      successMsg: "",
      appliedLeaves: [],
      offset: false,
      layoutTimeSheet: false,
      datesOfCompOff: [],
      appliedLeavesRequests: [],
      datesOfMarkedWorkingDays: [],
      errorLayout: false,
      errMsg: "",
      myTimesheetRef: null,
      ErrorValidationMessages: ErrorValidationMessages,
    };
  },
  watch: {
    open: function (value) {
      //if (value) {
      this.date = this.selectedDatefromDashboard;
      this.layoutTimeSheet = value;
      //}
    },
    selectedDatefromDashboard: function (newVal) {
      this.date = newVal;
    },
    fromCalender: function (newVal) {
      if (newVal) {
        this.disableDatePicker = true;
      } else {
        this.disableDatePicker = false;
      }
    },
    timesheetModal: async function (value) {
      if (value) {
        const result = await eventsService.fetchAllWorkingDays();
        if (result.data.length > 0) {
          result.data.forEach((element) => {
            this.datesOfMarkedWorkingDays.push(
              String(new Date(new Date(element.date).setHours(0, 0, 0))),
            );
          });
        }

        this.layoutTimeSheet = true;
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
      } else if (!value) {
        this.layoutTimeSheet = false;
      }
    },
    selectedOptions: function (value) {},
    formData: {
      handler: function (newValue) {
        this.totalTime = 0;
        newValue.forEach((data) => {
          data.detail.forEach((detailData) => {
            const hours = detailData.timeSpent.substring(0, 2);
            const minutes = detailData.timeSpent.substring(3, 5);

            this.totalTime += Number(hours) * 60 + Number(minutes);
            this.renderValidationRulesForTime();
            this.hours =
              Math.floor(Number(this.totalTime) / 60) > 9
                ? Math.floor(Number(this.totalTime) / 60)
                : "0" + Math.floor(Number(this.totalTime) / 60);
            this.minutes =
              Math.floor(Number(this.totalTime) % 60) > 9
                ? Math.floor(Number(this.totalTime) % 60)
                : "0" + Math.floor(Number(this.totalTime) % 60);
          });
        });
      },
      deep: true,
    },

    date: function (value) {
      this.dateDisplay = value.split("/").reverse().join("/");
      var d = value.split("/").reverse();
      var x = d[0];
      d[0] = d[1];
      d[1] = x;
      this.requestDate = d.join("/");
    },
  },
  computed: {
    TDRequired() {
      return [(v) => !!v || "Date is required."];
    },
  },
  methods: {
    timeSpentRules() {
      return [
        (val) =>
          val != "00:00" || TimeValidationRules.TIME_SHOULD_MORE_THAN_ZERO,
        (val) =>
          this.totalTime < 1440 ||
          TimeValidationRules.TIME_SHOULD_LESS_THAN_24_HOURS,
        (val) => !!val || TimeValidationRules.PLEASE_ENTER_TIME_SPENT_ON_TASK,
        (val) =>
          /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val) ||
          TimeValidationRules.PLEASE_ENTER_VALID_TIME,
      ];
    },
    async fillTimesheetOnZoneBase() {
      var date =
        this.requestDate.split("/")[1] +
        "/" +
        this.requestDate.split("/")[0] +
        "/" +
        this.requestDate.split("/")[2];
      this.$q.loading.show();
      var user = this.$store.getters.userId;
      var userdata = this.$store.getters.user;

      const requestData = [];

      this.formData.forEach((data) => {
        this.projectDescription = [];
        let timeSpentOnProject = 0;
        data.detail.forEach((detail) => {
          this.timeConvert(detail.timeSpent, detail);
          const hours = detail.timeSpent.substring(0, 2);
          const minutes = detail.timeSpent.substring(3, 5);
          timeSpentOnProject += Number(hours) * 60 + Number(minutes);
        });
        requestData.push({
          user: user,
          reportDate: functions.convertDateToUTC(date),
          deleted: false,
          mentor: userdata.mentor,
          project: data.projectId,
          sheets: this.projectDescription,
          time: timeSpentOnProject,
        });
      });
      const response = await timesheetsService.addTimeSheets(requestData);
      if (response.data == "Invalid Token") {
        alert("Invalid Token");
      }
      if (response.data == "Invalid Report Date") {
        this.errMsg =
          "Can't add the timesheets of date is " +
          functions.convertUTCToDate(requestData[0].reportDate) +
          " please make sure your machine time is up to date";
        this.errorLayout = true;
      } else {
        this.successMsg = "Timesheet Added Successfully!!";
        this.onClose();
      }
      this.$q.loading.hide();
    },

    async fetchServerDate() {
      const res = await timesheetsService.getServerDate();
      this.serverDate = new Date(res.data);
    },
    layoutTrue() {
      this.$emit("openTimesheetModal");
      this.getAllTimesheet();
      this.getLeavesDate();
      this.getLeavesRequests();
      this.dateDisplay = "";
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    timeInput(value) {
      if (this.totalTime > 1440) {
        return [(v) => !!totalTime > 1440 || "Date is required."];
      }
    },
    timeConvert(val, detail) {
      var convertedTime = 0;
      var data = val.toString();

      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);

      convertedTime = Number(hours) * 60 + Number(minutes);
      this.projectDescription.push({
        description: detail.description,
        timeSpent: convertedTime,
      });
    },
    async onSubmit() {
      var timeZoneDate = new Date();
      var timeZone = timeZoneDate.getTimezoneOffset();
      if (timeZone == -330) {
        try {
          await this.fillTimesheetOnZoneBase();
        } catch (error) {
          this.$q.loading.hide();
          if (error.response && error.response.status === 409) {
            this.errMsg = this.ErrorValidationMessages.TIMESHEET_ALREADY_EXIST;
            this.errorLayout = true;
          }
        }
      } else {
        this.offset = true;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    optionsFn(date) {
      var x = (
        this.today.getFullYear() +
        "/" +
        (Number(this.today.getMonth()) + 1) +
        "/" +
        this.today.getDate()
      ).toString();
      var arr = x.split("/");
      if (arr[1] < 10) {
        arr[1] = "0" + arr[1];
      }
      if (arr[2] < 10) {
        arr[2] = "0" + arr[2];
      }

      var currentDate = arr.join("/");
      var doj = functions
        .convertUTCToDate(this.$store.getters.user.dates.dateOfJoin)
        .split("/")
        .reverse()
        .join("/");
      return (
        date >= this.preDate &&
        date <= currentDate &&
        !this.existDate.includes(date) &&
        !this.appliedLeaves.includes(date) &&
        !this.appliedLeavesRequests.includes(date) &&
        date >= doj &&
        !this.datesOfCompOff.includes(date)
      );
    },

    getProjects(value) {
      if (value.length < 1) {
        this.formData = [];
      } else {
        value.forEach((val) => {
          if (value.length > this.formData.length) {
            if (this.formData.length > 0) {
              var b = true;
              this.formData.forEach((fdata) => {
                if (fdata.projectId == val.value) {
                  b = false;
                }
              });
            } else {
              this.formData.push({
                projectId: val.value,
                label: val.label,
                detail: [
                  { detailId: detailId, description: "", timeSpent: "" },
                ],
              });
              detailId++;
            }
            if (b) {
              this.formData.push({
                projectId: val.value,
                label: val.label,
                detail: [
                  { detailId: detailId, description: "", timeSpent: "" },
                ],
              });
              detailId++;
            }
          } else {
            this.formData.forEach((fdata, index) => {
              var b = true;
              value.forEach((val) => {
                if (fdata.projectId == val.value) {
                  b = false;
                }
              });
              if (b) {
                this.formData.splice(index, 1);
              }
            });
          }
        });
      }
    },
    remove(pid, detid) {
      this.formData.forEach((val, index) => {
        if (val.projectId == pid) {
          val.detail.forEach((det, i) => {
            if (det.detailId == detid) {
              if (val.detail.length > 1) {
                val.detail.splice(i, 1);
              } else {
                this.formData.splice(index, 1);
              }
            }
          });
        }
      });
    },

    remove(pid, detid) {
      this.formData.forEach((val, index) => {
        if (val.projectId == pid) {
          val.detail.forEach((det, i) => {
            if (det.detailId == detid) {
              if (val.detail.length > 1) {
                val.detail.splice(i, 1);
              } else {
                this.formData.splice(index, 1);
              }
            }
          });
        }
      });
    },
    add(project) {
      this.formData.forEach((data, index) => {
        if (project == data.projectId) {
          this.formData[index].detail.push({
            detailId: detailId,
            description: "",
            timeSpent: "",
          });
          detailId++;
        }
      });
    },
    onClose() {
      this.disableDatePicker = false;
      this.offset = false;
      this.$emit("layoutTimeSheet");
    },
    todayDate() {
      this.requestDate = functions.convertUTCToDate(new Date());
      var future = new Date(this.serverDate); // get today date
      future.setDate(future.getDate() - 7); // add 7 days
      this.preDate = functions
        .convertUTCToDate(future)
        .split("/")
        .reverse()
        .join("/");
    },
    dateConvert(value) {
      var date = functions.convertUTCToDate(value);
      this.existDate.push(date.split("/").reverse().join("/"));
      return date;
    },
    async getAllTimesheet() {
      this.existDate = [];
      this.dateValidation = [];
      const response = await timesheetsService.fetchMyTimeSheets(
        this.$store.getters.userId,
      );
      response.data.forEach((data) => {
        const date = this.dateConvert(data.reportDate);
        this.dateValidation.push(date);
      });
    },
    async getLeavesDate() {
      this.$q.loading.show();
      const res = await leavesService.fetchMyLeaves(this.$store.getters.userId);
      this.appliedLeaves = [];
      res.data.forEach((leave) => {
        if (
          leave.status == "approved" ||
          (leave.status == "rejected" && leave.leaveType == "lwp")
        ) {
          this.appliedLeaves.push(this.dateConvert(leave.leaveDate));
        }
      });
      this.$q.loading.hide();
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
              this.appliedLeavesRequests.push(this.dateConvert(date));
            });
          }
        });
      }
      this.$q.loading.hide();
    },
    renderValidationRulesForTime() {
      this.$refs.myTimesheetRef?.forEach((val) => {
        if (val.modelValue) {
          const data = this.timeSpentRules();
          if (data) {
            val.focused = true;
            val.validate();
          }
        }
      });
    },
    closeError() {
      this.errorLayout = false;
      this.errMsg = "";
    },
  },

  mounted() {
    this.fetchServerDate();
    this.todayDate();
    this.getAllTimesheet();
    this.getLeavesDate();
    this.getLeavesRequests();
    this.path = this.$route.path.split("/");
    this.path = this.path[this.path.length - 1];
  },
};
</script>

<style scoped>
.add-timesheet-scroll {
  margin-left: auto;
  margin-bottom: -30px;
}
.add-timesheet-dashboard {
  position: relative;
  right: 0px;
}
.q-dialog__inner .add-modal-timesheet {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px !important;
}
.q-dialog__inner .appraisal-modal {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 900px !important;
}
</style>
