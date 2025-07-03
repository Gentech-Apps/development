<template>
  <div>
    <q-item-label
      header
      class="text-h6 text-weight-medium headtext q-pa-none q-ml-sm"
      ><span class="material-icons-outlined common-icons"
        >playlist_add_check</span
      >&nbsp;To Do</q-item-label
    >
    <div class="myinbox q-mt-sm q-ml-sm row">
      <div class="col-4 announcement-col">
        <div
          class="column-heading text-weight-bolder"
          data-id="todo-timesheet-and-leaves"
        >
          Timesheet & Leaves
        </div>
        <div class="overflow-auto max-height">
          <div v-for="iterator in ArrayTabs" :key="iterator.id">
            <div
              v-if="
                iterator[1] != 0 &&
                (iterator[0] == this.todoNotification.MISSING_TIMESHEET ||
                  iterator[0] == this.todoNotification.REJECTED_TIMESHEET ||
                  iterator[0] == this.todoNotification.TIMESHEET_APPROVAL ||
                  iterator[0] == this.todoNotification.LEAVE_APPROVAL ||
                  iterator[0] == this.todoNotification.COMPOFF_APPROVAL ||
                  iterator[0] == this.todoNotification.COMPOFF_MENTEES ||
                  iterator[0] == this.todoNotification.LWP_TO_BE_SETTLED ||
                  iterator[0] == this.todoNotification.SAT_SUN_WORKING_DAY ||
                  iterator[0] == this.todoNotification.MY_TEAM_LEAVES)
              "
            >
              <q-item
                clickable
                class="row item-size"
                @click="setAllTabData(iterator[0])"
                :class="
                  timesheetAlert == true && iterator[0] == 'Missing Timesheet'
                    ? 'text-red'
                    : ''
                "
              >
                <q-item-section
                  clickable
                  class="col=10 text-size"
                  :data-id="iterator[0]"
                >
                  {{ iterator[0] }}
                </q-item-section>
                <q-item-section
                  clickable
                  class="col-2"
                  style="text-align: right"
                >
                  {{ iterator[1] }}
                </q-item-section>
              </q-item>
              <q-separator class="q-mx-auto change-separator" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-4 announcement-col">
        <div
          class="column-heading text-weight-bolder"
          data-id="todo-appraisals"
        >
          Appraisals
        </div>
        <div class="overflow-auto max-height">
          <div v-for="iterator in ArrayTabs" :key="iterator.id">
            <div
              v-if="
                iterator[1] != 0 &&
                (iterator[0] == this.todoNotification.SELF_APPRAISAL ||
                  iterator[0] == this.todoNotification.LEAD_APPRAISAL ||
                  iterator[0] == this.todoNotification.REVIEWER_APPRAISAL ||
                  iterator[0] == this.todoNotification.INITIATE_APPRAISAL ||
                  iterator[0] == this.todoNotification.IN_360_APPRAISAL ||
                  iterator[0] == this.todoNotification.IN_CONCLUSION)
              "
            >
              <q-item
                clickable
                v-ripple
                class="row item-size"
                @click="setAllTabData(iterator[0])"
              >
                <q-item-section class="col=10 text-size" :data-id="iterator[0]">
                  {{ iterator[0] }}
                </q-item-section>
                <q-item-section class="col-2" style="text-align: right">
                  {{ iterator[1] }}
                </q-item-section>
              </q-item>
              <q-separator class="q-mx-auto change-separator" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-4 announcement-col">
        <div class="column-heading text-weight-bolder" data-id="todo-others">
          Others
        </div>
        <div class="overflow-auto max-height">
          <div v-for="iterator in ArrayTabs" :key="iterator.id">
            <div
              v-if="
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.IR_APPROVAL) ||
                (iterator[1] == 0 &&
                  iterator[0] == this.todoNotification.APPLY_IR) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.IR_TO_BE_SETTLED) ||
                (iterator[1] != 0 &&
                  iterator[0] ==
                    this.todoNotification.PENDING_LOAN_APPROVALS) ||
                (iterator[1] != 0 &&
                  iterator[0] ==
                    this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.UPLOAD_BIRTHDAY_IMAGE) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.APPLY_FOR_MEDICLAIM) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.MEDICLAIM_APPROVALS) ||
                (iterator[1] != 0 &&
                  iterator[0] ==
                    this.todoNotification.PENDING_FULL_SETTLEMENTS) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.PAYROLL_MONTH_EMIS) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.TO_BE_DISBURSED) ||
                (iterator[1] != -1 &&
                  iterator[0] ==
                    this.todoNotification.LOW_PETTYCASH_WALLET_AMOUNT) ||
                (iterator[1] != 0 &&
                  iterator[0] == this.todoNotification.OPEN_VOUCHER) ||
                (iterator[1] != 0 &&
                  iterator[0] ==
                    this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS)
              "
            >
              <q-item
                clickable
                v-ripple
                class="row item-size"
                @click="setAllTabData(iterator[0])"
                :class="toDoClass(iterator[0], iterator[1])"
              >
                <q-item-section class="col=10 text-size" :data-id="iterator[0]">
                  {{ iterator[0] }}
                </q-item-section>
                <q-item-section
                  v-if="iterator[1] > 0"
                  class="col-2"
                  style="text-align: right"
                >
                  {{ iterator[1] }}
                </q-item-section>
                <q-item-section
                  v-if="
                    iterator[1] == 0 &&
                    iterator[0] != todoNotification.LOW_PETTYCASH_WALLET_AMOUNT
                  "
                  class="col-2"
                  style="text-align: right"
                >
                  {{ iterator[1] + 1 }}
                </q-item-section>
                <q-item-section
                  v-else-if="iterator[1] == 0"
                  class="col-2"
                  style="text-align: right"
                >
                  {{ iterator[1] }}
                </q-item-section>
              </q-item>
              <q-separator class="q-mx-auto change-separator" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddCash v-if="isOpenAddCash" @close="addCashPopupClose" />
    <ErrorLayout :layoutModel="errorLayout" :message="errorMessage">
    </ErrorLayout>
  </div>
</template>

<script>
import moment from "moment";
import { TodoNotificationConstants } from "../constants/dashboard";
import { Constants } from "../constants/pettyCash";
import * as pettyCashService from "../services/pettyCash.service";
import ErrorLayout from "./ErrorLayout.vue";
import AddCash from "./PettyCash/AddCash.vue";
import NewTransaction from "./PettyCash/NewTransaction.vue";

export default {
  name: "InboxView",
  components: {
    AddCash,
    NewTransaction,
    ErrorLayout,
  },
  props: ["ArrayTabs"],
  watch: {
    ArrayTabs: function (val) {
      for (let i = 0; i < val.length; i++) {
        if (val[i][0] == "AlertApplyMediclaim") {
          this.mediclaimAlert = val[i][1];
        }
      }
      this.timesheetAlert = val[1][1];
      this.birthdayAlert = true;
      val.forEach((element) => {
        if (element[0] == "Apply IR" && element[1] == 0) {
          var date = new Date();
          var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          if (
            moment(lastDay).format("MM/DD/YYYY") ==
            moment(new Date()).format("MM/DD/YYYY")
          ) {
            this.irAlert = true;
          }
        }
      });
    },
  },
  data() {
    return {
      timesheetAlert: false,
      irAlert: false,
      birthdayAlert: false,
      mediclaimAlert: false,
      todoNotification: TodoNotificationConstants,
      subTabName: "subtabname",
      myInbox: "myinbox",
      isOpenAddCash: false,
      errorLayout: false,
      errorMessage: "",
      isLastFinacialYearOpenVouchersAvailable: false,
      previousFinancialYearRemainingAmount: 0,
    };
  },
  async mounted() {
    const res = await pettyCashService.getIsLastFinancialYearOpenVoucherCount();
    this.isLastFinacialYearOpenVouchersAvailable =
      res.data.isOpenVoucherInLastFinancialYear;
    this.previousFinancialYearRemainingAmount =
      res.data.previousFinancialYearRemainingAmount;
  },

  methods: {
    toDoClass: function (iteratorZero, iteratorOne) {
      return (this.irAlert == true &&
        iteratorZero == this.todoNotification.APPLY_IR) ||
        (this.mediclaimAlert &&
          iteratorZero == this.todoNotification.APPLY_FOR_MEDICLAIM) ||
        (iteratorZero == this.todoNotification.LOW_PETTYCASH_WALLET_AMOUNT &&
          iteratorOne < 1000)
        ? "text-red"
        : "";
    },
    addCashPopupClose() {
      this.isOpenAddCash = false;
      this.$emit("close");
    },
    showErrorPopuop(message) {
      this.errorLayout = false;
      this.$nextTick(() => {
        this.errorMessage = message;
        this.errorLayout = true;
      });
    },
    setAllTabData(it) {
      if (it == this.todoNotification.MISSING_TIMESHEET) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Mine");
      } else if (it == this.todoNotification.TIMESHEET_APPROVAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Timesheets");
      } else if (it == this.todoNotification.LEAVE_APPROVAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Leaves");
      } else if (it == this.todoNotification.COMPOFF_APPROVAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Comp-Off");
      } else if (it == this.todoNotification.COMPOFF_MENTEES) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Comp-Off-Mentor");
      } else if (it == this.todoNotification.LEAD_APPRAISAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Lead");
      } else if (it == this.todoNotification.REVIEWER_APPRAISAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Reviewer");
      } else if (it == this.todoNotification.INITIATE_APPRAISAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Appraisal Initiate");
      } else if (it == this.todoNotification.IN_360_APPRAISAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "360Appraisal");
      } else if (it == this.todoNotification.IN_CONCLUSION) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "inConclusion");
      } else if (it == this.todoNotification.SELF_APPRAISAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "selfAppraisal");
      } else if (it == this.todoNotification.IR_APPROVAL) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, this.todoNotification.IR_APPROVAL);
      } else if (it == this.todoNotification.APPLY_IR) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "IR Users");
      } else if (it == this.todoNotification.REJECTED_TIMESHEET) {
        localStorage.setItem(this.subTabName, it);
        localStorage.setItem(this.myInbox, "Rejected");
      } else if (it == this.todoNotification.LWP_TO_BE_SETTLED) {
        localStorage.setItem(this.subTabName, "All LWPs");
        localStorage.setItem(this.myInbox, "Lwp");
      } else if (it == this.todoNotification.IR_TO_BE_SETTLED) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.IR_TO_BE_SETTLED,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.IR_TO_BE_SETTLED,
        );
      } else if (it == this.todoNotification.SAT_SUN_WORKING_DAY) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.SAT_SUN_WORKING_DAY,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.SAT_SUN_WORKING_DAY,
        );
      } else if (it == this.todoNotification.MY_TEAM_LEAVES) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.MY_TEAM_LEAVES,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.MY_TEAM_LEAVES,
        );
      } else if (it == this.todoNotification.PENDING_LOAN_APPROVALS) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.PENDING_LOAN_APPROVALS,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.PENDING_LOAN_APPROVALS,
        );
      } else if (it == this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL,
        );
      } else if (it == this.todoNotification.MEDICLAIM_APPROVALS) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.MEDICLAIM_APPROVALS,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.MEDICLAIM_APPROVALS,
        );
      } else if (it == this.todoNotification.PENDING_FULL_SETTLEMENTS) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.PENDING_FULL_SETTLEMENTS,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.PENDING_FULL_SETTLEMENTS,
        );
      } else if (it == this.todoNotification.PAYROLL_MONTH_EMIS) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.PAYROLL_MONTH_EMIS,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.PAYROLL_MONTH_EMIS,
        );
      } else if (it == this.todoNotification.TO_BE_DISBURSED) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.TO_BE_DISBURSED,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.TO_BE_DISBURSED,
        );
      } else if (it == this.todoNotification.OPEN_VOUCHER) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.OPEN_VOUCHER,
        );
        localStorage.setItem(this.myInbox, this.todoNotification.OPEN_VOUCHER);
      } else if (it == this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS) {
        localStorage.setItem(
          this.subTabName,
          this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS,
        );
        localStorage.setItem(
          this.myInbox,
          this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS,
        );
      } else {
        console.log("field not match......");
      }
      let value = localStorage.getItem(this.myInbox);
      if (it == this.todoNotification.UPLOAD_BIRTHDAY_IMAGE) {
        this.$router.push("/profile/" + this.$store.getters.userId);
      } else if (it == this.todoNotification.APPLY_FOR_MEDICLAIM) {
        this.$router.push("/mediclaims");
      } else if (it == this.todoNotification.LOW_PETTYCASH_WALLET_AMOUNT) {
        if (this.isLastFinacialYearOpenVouchersAvailable) {
          this.showErrorPopuop(
            Constants.LAST_FINANCIAL_YEAR_OPEN_VOUCHERS_MESSAGE,
          );
        } else if (
          this.previousFinancialYearRemainingAmount != 0 &&
          !this.isLastFinacialYearOpenVouchersAvailable
        ) {
          this.showErrorPopuop("Please settle previos financial year first");
        } else {
          this.isOpenAddCash = true;
        }
      } else {
        this.$router.push("/inboxpage");
      }
    },
  },
};
</script>

<style scoped>
.column-heading {
  text-align: center;
  border-bottom: 2px solid #dadada;
  margin-top: 3px;
  justify-content: center;
  align-items: center;
  height: 35px;
  padding-top: 5px;
}

.announcement-col {
  border: 2px solid #dadada;
  border-left: hidden;
  border-top: hidden;
  border-bottom: hidden;
  outline: none;
}

.myinbox {
  border: 2px solid #dadada;
  border-right: hidden;
  border-radius: 10px;
  outline: none;
}

.see-more-announcement {
  height: 10%;
}

.change-announcement-separator {
  width: 2px;
}

.bg-tip-full-width-announce {
  width: 35%;
}

.count-setting {
  margin-left: 120px;
}

.change-separator {
  width: 90%;
}

.item-size {
  min-height: 25px !important;
  max-height: 35px !important;
}

.text-size {
  font-size: 13px;
}

.text-red {
  color: red;
}

.max-height {
  height: 220px !important;
}
</style>
