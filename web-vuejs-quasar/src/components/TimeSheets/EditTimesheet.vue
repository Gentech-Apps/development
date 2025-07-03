<template>
  <div>
    <div class="q-gutter-sm" style="position: relative">
      <q-dialog :persistent="true" v-model="layoutValue">
        <q-card class="add-modal-timesheet q-py-sm">
          <q-form @submit="onSubmit">
            <div>
              <q-card-section>
                <div class="row">
                  <div
                    class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-md"
                    data-id="edittimesheet-heading"
                  >
                    Edit Timesheet
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="mentor.name"
                      label="Mentor name"
                      readonly
                      lazy-rules
                      dense
                      style="max-width: 300px"
                      data-id="edittimesheet-mentorname"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-6 col-xs-12 text-h6">
                    <q-input
                      outlined
                      v-model="dateDisplay"
                      readonly
                      lazy-rules
                      dense
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </div>

            <div class="row q-mx-md q-mysm">
              <div class="col-md-6 col-sm-6 col-xs-12">
                <SelectProject
                  v-on:projects="getProjects"
                  :gotProject="gotProject"
                  data-id="edittimesheet-selectproject"
                />
              </div>
              <div
                v-if="totalTime > 0"
                class="col-md-6 col-sm-6 col-xs-12 q-pt-sm"
              >
                <label
                  class="float-right text-h6"
                  data-id="edittimesheet-totalhours"
                >
                  {{ hours }}:{{ minutes }} Hours
                </label>
              </div>
            </div>
            <div style="max-height: 250px; overflow-y: auto">
              <q-card
                v-for="project in formData"
                :key="project.projectId"
                class="q-mx-lg q-my-md"
                style="border-radius: 15px"
              >
                <q-card-section>
                  <div class="fs--16" data-id="edittimesheet-projectname">
                    {{ capitalizeFirst(project.label) }}
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
                              'Please enter a description',
                          ]"
                          data-id="edittimesheet-description"
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
                          :rules="[
                            (val) =>
                              val != '00:00' || 'time should be more than 0',
                            (val) =>
                              totalTime <= 1440 ||
                              'Please enter time < 24 hours',
                            (val) => !!val || 'Please enter time spent on task',
                            (val) =>
                              /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val) ||
                              'Please enter valid time',
                          ]"
                          data-id="edittimesheet-time"
                        />
                      </div>

                      <div class="q-pb-sm" style="float: right">
                        <q-btn
                          v-if="idx > 0"
                          flat
                          round
                          color="red"
                          icon="delete"
                          @click="remove(project.projectId, detail.detailId)"
                          data-id="descriptionfield-remove"
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
                          round
                          flat
                          color="primary"
                          v-if="project.detail.length - 1 == idx"
                          icon="add"
                          class="q-ml-md"
                          @click="add(project.projectId)"
                          data-id="descriptionfield-add"
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
            <p
              class="error"
              v-if="timeZoneError"
              style="color: red; margin-left: 20px"
            >
              Please set Time Zone as per india time
            </p>
            <p
              class="error"
              v-if="invalidTimeError"
              style="color: red; margin-left: 20px"
            >
              Timesheet hours can not be more than or less than
              {{ convertMinuteTime(this.actualHours) }} Hours
            </p>
            <div>
              <q-card-actions class="justify-end">
                <q-btn
                  color="negative"
                  flat
                  label="cancel"
                  @click="onClose"
                  data-id="edittimesheet-cancel"
                />
                <q-btn
                  flat
                  v-if="formData.length > 0"
                  type="submit"
                  color="primary"
                  label="Submit"
                  data-id="edittimesheet-submit"
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
import * as functions from "../../services/functions";
import SelectProject from "./SelectProject.vue";
import * as timesheetsService from "../../services/timesheets.service";
import Notify from "../Notify.vue";

let detailId = 0;

export default {
  name: "EditTimesheet",
  components: {
    SelectProject,
    Notify,
  },

  data() {
    return {
      invalidTimeError: false,
      layoutValue: false,
      hours: "",
      minutes: "",
      sheetData: [],
      timeSheets: [],
      descriptionData: [],
      today: new Date(),
      dateSend: "",
      totalTime: 0,
      timeSpent: "",
      hasRun: false,
      dateDisplay: "",
      finalprojects: [],
      mentor: {},
      formData: [],
      projectList: [],
      propData: [],
      selectedProjects: [],
      gotProject: [],
      successMsg: "",
      errorLayout: false,
      errMsg: "",
      timeZoneError: false,
      actualHours: 0,
    };
  },
  watch: {
    layout: function (newVal) {
      this.layoutValue = newVal;
    },
    editTimesheet: {
      handler: async function (value) {
        this.selectedDate = value.date.substring(0, 10);
        let dd = this.selectedDate.split("-");
        this.selectedDate = dd.join("/");
        this.gotProject = [];
        value.data.forEach((data) => {
          const clientName = data?.clientName
            ? " (" + data.clientName + ")"
            : "";
          this.gotProject.push(data.name.toLowerCase() + clientName);
        });
        await this.fetchAllTimeSheetsByUserIdByDay(value.date);
      },
    },
    formData: {
      handler: async function (newValue) {
        this.totalTime = 0;
        newValue.forEach((data) => {
          data.detail.forEach((detailData) => {
            const hours = detailData.timeSpent.substring(0, 2);
            const minutes = detailData.timeSpent.substring(3, 5);

            this.totalTime += Number(hours) * 60 + Number(minutes);
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
  },

  methods: {
    timeCalculation(time) {
      if (time > this.actualHours && time !== this.actualHours) {
        return false;
      } else {
        return true;
      }
    },
    timeCalculationLess(time) {
      if (time < this.actualHours && time !== this.actualHours) {
        return false;
      } else {
        return true;
      }
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
    async fetchAllTimeSheetsByUserIdByDay(date) {
      const response = await timesheetsService.fetchMyTimeSheets(
        this.$store.getters.userId,
      );

      this.timeSheets = [];
      response.data.forEach((ele) => {
        if (
          new Date(ele.reportDate).setHours(0, 0, 0, 0, 0) ==
          new Date(date).setHours(0, 0, 0, 0)
        ) {
          this.actualHours = ele.actualHours;
          this.timeSheets = this.addToArrayIfNotExist(this.timeSheets, ele);
        }
      });
      this.setFormData();
    },

    setFormData() {
      this.formData = [];
      this.timeSheets.forEach((sheet, index) => {
        let date = sheet.reportDate.substring(0, 10).split("-");
        this.dateDisplay = date.reverse().join("/");
        this.mentor = {
          name: sheet.mentor.name,
          _id: sheet.mentor._id,
        };

        this.dateSend = date[1] + "/" + date[0] + "/" + date[2];
        this.formData.push({
          projectId: sheet.projectId,
          label: sheet.name,
          detail: [],
          createdDate: sheet.createdDate,
        });
        sheet.sheets.forEach((data) => {
          let time = this.convertMinuteTime(data.time);
          this.formData[index].detail.push({
            detailId: data.id,
            description: data.description,
            timeSpent: time,
          });
        });
      });
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
            id: elesheet._id,
          });
        });
      }

      arr.push({
        name: project.project.name,
        name: project.project.name + " (" + project.project.client.name + ")",
        time: project.time ? project.time : totalProjectSpentTime,
        mentor: {
          name: project.mentor.firstName + " " + project.mentor.lastName,
          _id: project.mentor._id,
        },
        sheets: sheet,
        projectId: project.project._id,
        reportDate: project.reportDate,
        createdDate: project.createdDate,
      });
      return arr;
    },
    convertMinuteTime(time) {
      let hours = Math.floor(Number(time) / 60);
      hours = hours > 9 ? hours : "0" + hours;
      let minutes = Number(time) % 60;
      minutes = minutes > 9 ? minutes : "0" + minutes;
      return hours + ":" + minutes;
    },

    timeConvert(val, detail) {
      var convertedTime = 0;
      var data = val.toString();

      const hours = data.substring(0, 2);
      const minutes = data.substring(3, 5);

      convertedTime = Number(hours) * 60 + Number(minutes);
      this.descriptionData.push({
        description: detail.description,
        timeSpent: convertedTime,
      });
    },
    async onSubmit() {
      if (
        this.timeCalculation(this.totalTime) &&
        this.timeCalculationLess(this.totalTime)
      ) {
        this.totalTime = 0;
        this.invalidTimeError = false;

        var timeZoneDate = new Date();
        var timeZone = timeZoneDate.getTimezoneOffset();
        if (timeZone == -330) {
          this.$q.loading.show();
          var user = this.$store.getters.userId;

          const requestData = [];

          this.formData.forEach((data) => {
            this.descriptionData = [];
            let timeSpentOnProject = 0;
            data.detail.forEach((detail) => {
              this.timeConvert(detail.timeSpent, detail);
              const hours = detail.timeSpent.substring(0, 2);
              const minutes = detail.timeSpent.substring(3, 5);
              timeSpentOnProject += Number(hours) * 60 + Number(minutes);
            });
            requestData.push({
              user: user,
              reportDate: this.dateSend,
              deleted: false,
              mentor: this.mentor._id,
              project: data.projectId,
              sheets: this.descriptionData,
              time: timeSpentOnProject,
              isApproved: false,
              isRejected: false,
              createdDate: data.createdDate,
              oneTimeRejection: true,
            });
          });
          const response = await timesheetsService.editTimesheet(requestData);
          this.$q.loading.hide();
          if (response.data == "Invalid Report Date") {
            this.errMsg =
              "Can't Update the timesheets of date is " +
              functions.convertUTCToDate(requestData[0].reportDate) +
              " please make sure your machine time is up to date";
            this.errorLayout = true;
          } else {
            this.successMsg = "Timesheet Updated Successfully!!";
            this.onClose();
          }
        } else {
          this.timeZoneError = true;
        }
      } else {
        this.invalidTimeError = true;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
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
                if (fdata.label == val.label) {
                  fdata.projectId = val.value;
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
                if (fdata.label == val.label) {
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
      if (this.formData !== this.propData && !this.hasRun) {
        this.formData = this.propData;
        this.hasRun = true;
      } else this.propData = [];
    },

    filterFn(val, update, abort, index) {
      return this.projectList;
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
      this.$forceUpdate();
      this.timeZoneError = false;
      this.$emit("layoutFalse");
    },
  },
  props: ["layout", "editTimesheet"],
};
</script>

<style scoped>
.q-dialog__inner .add-modal-timesheet {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px !important;
}
</style>
