<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-dialog
          v-model="layoutValue"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./users">
              <q-card style="width: 560px">
                <q-card-section class="q-pb-none">
                  <div
                    v-if="!isUserComponentVal"
                    class="text-h6 text-center q-px-sm q-pb-md"
                  >
                    Edit Master Salary Data
                  </div>
                  <div
                    v-if="isUserComponentVal"
                    class="text-h6 text-center q-px-sm q-pb-md"
                  >
                    Add Master Salary Data
                  </div>
                </q-card-section>
                <q-card-section class="q-pb-none">
                  <div
                    class="text-h6 q-px-sm q-pb-md"
                    style="padding-left: 25px !important"
                  >
                    {{ user }}
                  </div>
                </q-card-section>
                <div
                  style="
                    max-height: 75vh;
                    overflow-y: auto;
                    margin-top: -30px !important;
                  "
                  @scroll="scrollDropDown"
                >
                  <div class="q-mt-lg row" style="margin-top: 50px !important">
                    <div
                      class="q-gutter-md col-6 q-pl-md"
                      style="max-width: 300px; padding-left: 30px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="grade"
                        :options="['G1', 'G2', 'G3', 'G4']"
                        label="Select Salary Grade"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select Salary Grade.',
                        ]"
                      >
                      </q-select>
                    </div>
                    <div
                      class="q-gutter-md col-6 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="gross"
                        lazy-rules
                        :rules="[
                          (val) => val > 0 || 'Please enter gross Salary',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="Gross Salary"
                      />
                    </div>
                  </div>
                  <div class="q-mt-md row">
                    <div
                      class="q-gutter-md col-6 q-pl-md"
                      style="max-width: 300px; padding-left: 30px"
                    >
                      <q-input
                        outlined
                        v-model="effdatefromupdated"
                        lazy-rules
                        label="Effective Date"
                        dense
                        readonly
                        @click="$refs.qeffdatefrom.show()"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Effective From date.',
                          (val) =>
                            (val && checkPrevDateInNewRecord()) ||
                            'Date should not be same in case of new record.',
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qeffdatefrom"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="effdatefrom"
                                minimal
                                :options="optionsFn"
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
                    <div
                      v-if="!isUserComponentVal"
                      class="q-gutter-md col-6 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="payrollMonth"
                        lazy-rules
                        label="Payroll Month"
                        dense
                        readonly
                        @click="$refs.qpayrollmonth.show()"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Payroll Month.',
                          (val) =>
                            (val && checkPayrollMonthAndEffectiveDate()) ||
                            'Payroll Month can not be less than the month of effective date',
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qpayrollmonth"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="payrollMonth"
                                years-in-month-view
                                default-view="Months"
                                @update:model-value="onUpdateMv"
                                :key="dpKey"
                                emit-immediately
                                minimal
                                mask="MMM YY"
                                :navigation-min-year-month="minPayrollMonth"
                                class="myDate"
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
                  <p
                    v-if="noChangeValidation"
                    style="color: red; margin-top: -8px; margin-left: 30px"
                  >
                    Entered data is already exists, Please enter valid data
                  </p>
                  <div class="q-pl-lg q-mt-md row">
                    <div
                      v-if="!isUserComponentVal"
                      class="q-gutter-md col-6"
                      style="max-width: 300px"
                    >
                      <q-checkbox
                        v-model="valRecord"
                        label="Overwrite This Record"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="negative"
                      flat
                      label="cancel"
                      @click="close"
                    />
                    <q-btn flat type="submit" color="primary" label="Submit" />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
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
                  Invalid data
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
        </q-dialog>
      </div>
    </div>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import * as encryptDecrypt from "../../services/encryptionDecryptionService";
import * as usersService from "../../services/users.service";
import moment from "moment";
import * as salarydetailsService from "../../services/payroll.services";
import * as functions from "../../services/functions";
import * as salaryPeriod from "../../services/masterSalary.service";
import { ref } from "vue";
import Notify from "../Notify.vue";

export default {
  components: { Notify },
  data() {
    return {
      noChangeValidation: false,
      currentResult: {},
      previousEffDateInNewRecord: "",
      usersDateOfJoining: "",
      minPayrollMonth: "",
      newMonthDate: "2023/02/01",
      pastDate: "",
      effdatefromupdated: "",
      dateRestrForNewRecord: "",
      salaryGrade: "",
      isUserComponentVal: false,
      valRecord: ref(false),
      valPayroll: ref(false),
      userPayrollMonth: null,
      payrollMonth: null,
      grade: null,
      recID: null,
      user: null,
      effdatefrom: null,
      gross: null,
      layoutValue: false,
      userID: null,
      successMsg: "",
      clearSuccessMsg: "",
    };
  },
  props: [
    "layout",
    "userId",
    "userName",
    "recordId",
    "secretKey",
    "isUserComponent",
    "salaryGradeCopied",
    "pastAppDate",
  ],
  watch: {
    salaryGradeCopied: function (newVal) {
      this.grade = newVal;
    },
    secretKey: {
      immediate: true,
      handler: function (newVal) {
        if (newVal != "") {
          this.secret = newVal;
        }
      },
      deep: true,
    },
    isUserComponent: async function (newVal) {
      this.isUserComponentVal = newVal;
    },
    layout: function (newVal) {
      this.layoutValue = newVal;
    },
    recordId: async function (newVal) {
      const result = await salarydetailsService.fetchPayRollDetailsByUsers();
      if (result.data.locked.length == 0 && result.data.unlock.length == 0) {
        this.minPayrollMonth = "2023/01";
      } else {
        if (result.data.unlock.length >= 1) {
          this.minPayrollMonth = result.data.unlock[0];
          var newDateObject = functions.getMonthStartAndEndDate(
            this.minPayrollMonth,
          );
          var dateString = moment(newDateObject.MonthStart).format("YYYY/MM");
          this.minPayrollMonth = dateString;
        } else {
          var lastRecord = result.data.locked[result.data.locked.length - 1];
          let dateConverted = functions.getMonthStartAndEndDate(lastRecord);
          let newNextDate = dateConverted?.MonthStart;
          newNextDate.setMonth(newNextDate.getMonth() + 1);
          var newDateObject = functions.getMonthStartAndEndDate(
            this.minPayrollMonth,
          );
          let dateValue = this.convertDateInCalenderFormat(newNextDate);
          this.minPayrollMonth = moment(dateValue).format("YYYY/MM");
        }
      }

      this.recID = newVal;
      if (this.recID) {
        const res = await salaryPeriod.getUserSalaryPeriodById({
          recordId: this.recID,
        });
        res.data.forEach(async (element) => {
          let decryptData = await encryptDecrypt.decryptData(
            element.masterSalary,
            this.secretKey,
          );
          decryptData = JSON.parse(decryptData);
          this.payrollMonth = element.payrollMonth;
          this.grade = decryptData.grade;
          element.dates.effectiveDateFrom =
            element.dates.effectiveDateFrom == null
              ? " "
              : moment(element.dates.effectiveDateFrom).format("DD/MM/YYYY");
          this.previousEffDateInNewRecord = element.dates.effectiveDateFrom;
          var datearray = element.dates.effectiveDateFrom.split("/");
          var newdatemodified =
            datearray[2] + "/" + datearray[1] + "/" + datearray[0];
          this.dateRestrForNewRecord = newdatemodified;
          this.effdatefrom = newdatemodified;
          this.gross = decryptData.grossSalary;
          this.currentResult = {
            effdatefrom: this.effdatefrom,
            gross: this.gross,
            grade: this.grade,
            payrollMonth: this.payrollMonth,
          };
        });
      }
    },
    pastAppDate: function (newVal) {
      this.pastDate = newVal;
    },
    userId: async function (newVal) {
      this.userID = newVal;
      let user;
      const response = await usersService.fetchUserByID(this.userID);
      if (response != undefined) {
        user = response.data[0];
        if (user.dates.dateOfJoin == null || user.dates.dateOfJoin == "") {
          this.usersDateOfJoining = "notAvail";
        } else {
          this.usersDateOfJoining = user.dates.dateOfJoin;
        }
      }
    },
    userName: function (newVal) {
      this.user = newVal;
    },
    effdatefrom: function (newVal) {
      if (newVal != null) {
        var datearray = newVal.split("/");
        var newdatemodified =
          datearray[2] + "/" + datearray[1] + "/" + datearray[0];
        this.effdatefromupdated = newdatemodified;
      }
      if (newVal != this.currentResult.effdatefrom) {
        this.noChangeValidation = false;
      }
    },
    grade: function (newVal) {
      if (newVal != this.currentResult.grade) {
        this.noChangeValidation = false;
      }
    },
    payrollMonth: function (newVal) {
      if (newVal != this.currentResult.payrollMonth) {
        this.noChangeValidation = false;
      }
    },
    gross: function (newVal) {
      if (newVal != this.currentResult.gross) {
        this.noChangeValidation = false;
      }
    },
  },
  setup() {
    const dpKey = ref(Date.now());
    function onUpdateMv(v) {
      dpKey.value = Date.now();
    }
    return {
      dpKey,
      onUpdateMv,
    };
  },
  methods: {
    checkPayrollMonthAndEffectiveDate() {
      if (this.effdatefromupdated && this.payrollMonth) {
        return (
          moment(this.effdatefromupdated, "DD/MM/YYYY").format("x") <=
          moment(this.payrollMonth, "MMM YY").endOf("M").format("x")
        );
      }
      return true;
    },
    checkPrevDateInNewRecord() {
      if (
        !this.valRecord &&
        this.effdatefromupdated &&
        new Date(functions.convertDateToUTC(this.effdatefromupdated)).setHours(
          0,
          0,
          0,
          0,
        ) <=
          new Date(
            functions.convertDateToUTC(this.previousEffDateInNewRecord),
          ).setHours(0, 0, 0, 0)
      ) {
        return false;
      } else {
        return true;
      }
    },

    optionsFn(newDate) {
      if (this.isUserComponent && this.usersDateOfJoining != "notAvail") {
        var d = moment(new Date(this.usersDateOfJoining)).format("YYYY/MM/DD");
        return newDate >= d;
      }
      if (!this.valRecord) {
        return newDate > this.dateRestrForNewRecord;
      } else {
        if (this.pastDate != "notAvailable") {
          var datearray = this.pastDate.split("/");
          var newdatemodified =
            datearray[2] + "/" + datearray[1] + "/" + datearray[0];
          return newDate > newdatemodified;
        } else {
          var newDatenow = new Date();
          var d = newDatenow.setMonth(newDatenow.getMonth() - 6);
          var d = moment(new Date(d)).format("YYYY/MM/DD");
          return newDate > d;
        }
      }
    },
    convertDateInCalenderFormat(date) {
      var d = new Date(date);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
      var sdate = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
      return year + "/" + month + "/" + sdate;
    },
    close() {
      this.usersDateOfJoining = "";
      this.minPayrollMonth = "";
      this.pastDate = "";
      this.effdatefromupdated = "";
      this.dateRestrForNewRecord = "";
      this.userPayrollMonth = null;
      this.payrollMonth = null;
      this.recID = null;
      this.successMsg = "";
      this.clearSuccessMsg = "";
      this.valPayroll = false;
      this.valRecord = false;
      this.gross = null;
      this.salaryGrade = null;
      this.isUserComponentVal = false;
      this.grade = null;
      // this.secret=null;
      this.payrollMonth = null;
      this.user = null;
      this.effdatefrom = null;
      this.layoutValue = false;
      this.userID = null;
      this.$emit("layoutFalse");
    },
    closeAllAndReload() {
      this.close();
      this.successMsg = "User Salary Period Updated Successfully!!";
      this.$emit("reloadUser");
    },
    async onSubmit() {
      const newSalaryDetail = {
        user: this.userID,
        dates: {
          effectiveDateFrom: functions.convertDateToUTC(
            this.effdatefromupdated,
          ),
          endDate: null,
        },
        payrollMonth: this.isUserComponentVal
          ? this.valPayroll
            ? this.userPayrollMonth
            : ""
          : this.payrollMonth,
        masterSalary: {
          grossSalary: this.gross,
          grade: this.grade,
        },
        secretKey: this.secret,
        isUserComponent: this.isUserComponentVal,
      };
      const result = await encryptDecrypt.encryptData(
        JSON.stringify(newSalaryDetail.masterSalary),
        this.secret,
      );
      newSalaryDetail.masterSalary = result;

      if (!this.valRecord || this.isUserComponent) {
        const res = await salaryPeriod.setUserSalaryPeiod(newSalaryDetail);
        if (res.status == 200) {
          this.$emit("addSalLayout", this.userID);
        }
        this.closeAllAndReload();
      } else {
        if (
          !this.currentResult.grade.includes(this.grade) ||
          !this.currentResult.gross.includes(this.gross) ||
          !this.currentResult.payrollMonth.includes(this.payrollMonth) ||
          !this.currentResult.effdatefrom.includes(this.effdatefrom)
        ) {
          const res = await salaryPeriod.setUserSalaryPeriodById(
            this.recID,
            newSalaryDetail,
          );
          this.closeAllAndReload();
        } else {
          this.noChangeValidation = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}
</style>
