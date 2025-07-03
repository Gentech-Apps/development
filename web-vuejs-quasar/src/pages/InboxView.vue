<template>
  <div class="container">
    <div
      v-if="subTabName == 'Missing Timesheet'"
      class="card"
      style="height: 78vh !important"
      @scroll="scrolled('MyTimesheet')"
      id="MyTimesheet"
    >
      <MissingTimesheetCount
        v-for="(timesheet, index) in timeSheetsToDisplay"
        :key="index"
        :timesheet="timesheet"
        :subTab="subTabName"
        @reloadTimesheetCard="reloadApiData"
      />
    </div>
    <div
      v-else-if="subTabName == 'Apply IR'"
      class="card"
      style="height: 78vh !important"
    >
      <MissingTimesheetCount :ApplyDate="ApplyDate" />
    </div>
    <div
      v-else-if="
        subTabName == 'Timesheet Approval' || subTabName == 'Comp-Off Mentees'
      "
      class="scroll_timesheet row wrap justify-start items-start content-start full-width card"
      style="height: 78vh !important"
      @scroll="scrolled('MenteeSheets')"
      id="MenteeSheets"
    >
      <TimeSheet
        userType="mentor"
        v-for="(timesheet, index) in timeSheetsToDisplay"
        :key="String(timesheet.date) + index"
        :timesheet="timesheet"
        @approveUserTimeSheetData="approveUsersTmeSheet"
      />
    </div>
    <div
      v-else-if="subTabName == 'Rejected Timesheet'"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width card"
      style="height: 78vh !important"
      @scroll="scrolled('ProjectSheets')"
      id="ProjectSheets"
    >
      <TimeSheet
        userType="user"
        tabType="My TimeSheets"
        v-for="(timesheet, index) in timeSheetsToDisplay"
        :key="String(timesheet.date) + index"
        :timesheet="timesheet"
        v-on:resetData="reloadApiData"
      />
    </div>
    <div
      v-else-if="subTabName == 'Leave Approval'"
      class="scroll_timesheet leave-separator card"
      style="height: 78vh !important"
      @scroll="scrolled('menteesLeaveRequests')"
      id="menteesLeaveRequests"
    >
      <LeaveRequestsCard
        v-for="(leaveRequest, index) in leaveRequests"
        :key="index"
        :leaveRequest="leaveRequest"
        :tab="tab"
        @userID="ApproveStatus($event)"
      />
    </div>
    <div
      v-else-if="subTabName == 'All LWPs'"
      class="scroll_timesheet leave-separator heightSet"
      style="height: 78vh !important"
      @scroll="scrolled('LeavesSattled')"
      id="LeavesSattled"
    >
      <AccrualsCard
        class="float-left"
        v-for="(Accruals, index) in unsettledLeaves"
        :key="index"
        :Accruals="Accruals"
        :tab="subTabName"
        @reloadLeaves="removeSettledLwps"
      />
    </div>
    <div
      v-else-if="
        subTabName == 'Comp-Off Approval' || subTabName == 'Sat/Sun Working Day'
      "
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
      style="height: 78vh"
      @scroll="scrolled('menteesCompOff')"
      id="menteesCompOff"
    >
      <CompoffTimesheet
        v-for="(timesheet, index) in timeSheetsToDisplay"
        :key="String(timesheet.date) + index"
        :timesheet="timesheet"
        @approveCompoffSheet="onApproveCompoffSheet"
      />
    </div>

    <div
      v-else-if="
        subTabName == 'Lead Appraisal' || subTabName == 'Reviewer Appraisal'
      "
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <LeadAppraisalCard
        v-for="(appraisal, index) in appraisalsToDisplay"
        :key="index"
        :appraisal="appraisal"
        @refreshAppraisal="reloadApiData"
      />
    </div>

    <div
      v-else-if="
        subTabName == 'Initiate Appraisal' || subTabName == 'In360 Appraisal'
      "
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
      @scroll="scrolled()"
    >
      <CurrentAppraisal
        v-for="(appraisal, index) in appraisalsToDisplay"
        :key="index"
        :appraisalData="appraisal"
        :tab="tab1"
        @reloadAppraisal="reloadApiData"
      />
    </div>

    <div v-else-if="subTabName == 'In Conclusion'" class="leave_tab_width">
      <div class="row">
        <div class="text-primary text-weight-medium text-center col-6">
          APPRAISAL FORM
        </div>
        <div
          class="text-weight-medium text-center col-6"
          style="color: rgb(242, 192, 55); width: 50% !important"
        >
          CONCLUSION FORM
        </div>
      </div>
      <q-splitter v-model="inboxSplitter" class="full-width">
        <template v-slot:before>
          <div
            class="scroll_timesheet item-section"
            @scroll="scrolled()"
            style="height: 76vh !important"
          >
            <CurrentAppraisal
              v-for="(appraisal, index) in appraisalsToDisplay1"
              :key="index"
              :appraisalData="appraisal"
              :tab="tab1"
              @reloadAppraisal="reloadApiData"
            />
          </div>
        </template>
        <template v-slot:after>
          <div
            class="scroll_timesheet item-section"
            @scroll="scrolled()"
            style="height: 76vh !important"
          >
            <FormCard
              v-for="(appraisal, index) in appraisalsToDisplay"
              :key="index"
              :appraisal="appraisal"
              style="height: 200px !important"
              @refreshAnnoucements="reloadApiData"
            />
          </div>
        </template>
      </q-splitter>
    </div>

    <div
      v-else-if="subTabName == 'Self Appraisal'"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <SelfAppraisalCard
        v-for="(appraisal, index) in appraisalsToDisplay"
        :key="index"
        :appraisal="appraisal"
        @refreshAppraisal="reloadAppraisals"
      />
    </div>

    <div
      v-else-if="subTabName == 'IR To Be Settled'"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <UnsettledIR
        v-for="(unsettledIR, index) in irRequests"
        :key="index"
        :UnsettledIr="unsettledIR"
      />
    </div>

    <div
      v-else-if="subTabName == 'IR Approval'"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <q-card
        v-for="(item, index) in irRequests"
        class="leave-card bg-white text-secondary q-ma-sm"
        style="width: 200px; min-height: 180px; padding: 5px"
        :class="
          item.status.approved
            ? 'border-primary'
            : item.status.pending
            ? 'border-warning'
            : 'border-danger'
        "
      >
        <div class="q-pt-xs">
          <div class="text-subtitle2 text-center">
            {{
              (item?.userId?.firstName !== undefined
                ? item.userId.firstName
                : "") +
              " " +
              (item?.userId?.lastName !== undefined ? item.userId.lastName : "")
            }}
          </div>
          <div class="fs--10 text-center">
            <span>{{
              item.selectedMonths !== undefined
                ? item.selectedMonths[0] +
                  " - " +
                  item.selectedMonths[item.selectedMonths.length - 1]
                : "Undefined"
            }}</span>
            <div class="q-px-md fs--10 text-center q-pt-sm">
              <b class="">Applied On: </b>
              <span>{{ convertDate(item?.requestedDate) }}</span>
              <div v-if="item.status.approved ? true : false">
                <b class="">Approved Amount: </b>
                <span>{{ item?.approvedAmount }}</span>
              </div>
              <q-separator light inset />
              <b class="">Reim Amount: </b>
              <span>{{ item?.reimAmount }}</span>
              <div v-if="item.status.rejected ? true : false">
                <b class="">Comments: </b>
                <span style="cursor: pointer"
                  >{{ (item?.comments).substring(0, 35) }}
                  <q-tooltip
                    v-if="item?.comments.length > 35"
                    anchor="center right"
                    self="center left"
                    style="width: 50%"
                    class="bg-tip bg-tip-full-width-announce shadow-1"
                    :offset="[10, 10]"
                  >
                    {{ item?.comments }}
                  </q-tooltip>
                </span>
              </div>
              <div v-if="item?.status.approved ? true : false">
                <b class="">Approved Amount: </b>
                <span>{{ item?.approvedAmount }}</span>
              </div>

              <q-separator light inset />
            </div>
          </div>
        </div>
        <div>
          <q-card-actions class="justify-center card-bottom">
            <q-btn
              v-if="item.status.pending"
              icon-right="o_check"
              color="primary"
              class="fs--10"
              flat
              @click="onApproveClick(item._id, true)"
              :disable="item?.userId._id == $store.getters.userId"
            ></q-btn>
            <q-btn
              v-if="item.status.pending"
              icon-right="o_cancel"
              color="negative"
              class="fs--10"
              flat
              @click="rejectDialog(item._id)"
              :disable="item?.userId._id == $store.getters.userId"
            ></q-btn>
            <q-btn
              flat
              v-if="item.status.pending"
              class="fs--10"
              :color="'warning'"
              @click="onAdminViewIRRequest(item._id)"
            >
              View Details
            </q-btn>
            <q-btn
              flat
              v-if="!item.status.pending"
              class="fs--10"
              :color="
                item.status.approved
                  ? 'primary'
                  : item.status.pending
                  ? 'warning'
                  : item.status.rejected
                  ? 'negative'
                  : 'white'
              "
              @click="
                showViewDetails({
                  requestId: item._id,
                  callingFrom: 'requestAdmin',
                })
              "
            >
              View Details
            </q-btn>
          </q-card-actions>
        </div>
      </q-card>
      <q-dialog v-model="showRejectionDialog">
        <q-card style="min-width: 350px">
          <q-form @submit="oCancelClick">
            <q-card-section>
              <div class="text-h6">Comments</div>
              <div class="text-h10 text-negative">
                *Required in case of request rejection.
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                v-model="comments"
                outlined
                dense
                lazy-rules
                style="max-width: 350px"
                class="q-ml-auto"
                type="text"
                :rules="[
                  (bill) =>
                    (bill && bill.length > 0 && !!bill.trim()) ||
                    ' * Comments Required',
                ]"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" @click="onCloseReject" />
              <q-btn flat type="submit" label="Ok" />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
      <ViewRequest
        v-if="viewAdminRequestModal"
        :viewModal="viewAdminRequestModal"
        :inputData="selectedDocument"
        @onApproveClick="onApproveClick"
        @closeModal="closeViewRequest"
      />
      <ViewDetails
        :IrTabName="'adminRequestUser'"
        v-if="viewDetailsAdminRequest"
        :viewModal="viewDetailsAdminRequest"
        :inputData="selectedDocument"
        @closeModal="closeViewDetails()"
      />
    </div>
    <div v-else-if="subTabName == 'My Team Leaves'">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
        "
      >
        <div
          class="fit row wrap justify-start items-start content-start full-width"
        >
          <q-input
            outlined
            v-model="nameFilter"
            v-if="!showActiveCards"
            class="template-search q-px-sm col-4"
            label="Search by Name"
            lazy-rules
            clearable
            dense
            @clear="filter()"
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer"> </q-icon>
            </template>
          </q-input>
          <q-select
            v-if="!showActiveCards"
            outlined
            class="q-px-sm col-4"
            v-model="statusFilterAllSheets"
            :options="optionClients"
            label="Search by Clients"
            lazy-rules
            clearable
            @clear="filter()"
            @keydown.enter="filter()"
            input-debounce="0"
            emit-value
            map-options
            option-label="label"
            dense
          >
            <template v-slot:append>
              <q-icon name="search" class="cursor-pointer"> </q-icon>
            </template>
          </q-select>
        </div>
        <div>
          <div
            style="
              width: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              transform: scale(2);
              position: relative;
              right: 35px;
            "
          >
            <img
              style="width: 100%; cursor: pointer"
              @click="showActiveOnly(false)"
              v-if="showActiveCards"
              src="../assets/images/group_work.svg"
            />
            <img
              style="width: 100%; cursor: pointer"
              @click="showActiveOnly(true)"
              v-else
              src="../assets/images/workspaces.svg"
            />
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              class="bg-tip shadow-1"
              :offset="[10, 10]"
            >
              {{ showActiveCards ? "Group By User" : "Group By Date" }}
            </q-tooltip>
          </div>
        </div>
      </div>
      <div
        style="height: 75vh !important"
        @scroll="scrolled('MyTimesheet')"
        id="MyTimesheet"
        class="scroll_timesheet row wrap justify-start items-start content-start full-width card"
      >
        <MissingTimesheetCount
          v-if="!showActiveCards"
          v-for="(timesheet, index) in timeSheetsToDisplay"
          :key="index"
          :timesheet="timesheet"
          :subTab="subTabName"
          :activeCards="showActiveCards"
          @reloadTimesheetCard="reloadApiData"
        />
        <MissingTimesheetCount
          v-else
          v-for="(timesheet, index) in leavesToDisplay"
          :timesheet="timesheet"
          :subTab="subTabName"
          :activeCards="showActiveCards"
          @reloadTimesheetCard="reloadApiData"
        />
      </div>
    </div>
    <div
      v-else-if="subTabName == 'Birthday Template Approval'"
      @scroll="scrolled('MyTimesheet')"
      id="MyTimesheet"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <BirthDayTemplate
        v-for="(template, index) in timeSheetsToDisplay"
        :key="index"
        :template="template"
        @onApprovedTemplates="onApprovedTemplates"
        @onClosedTemplates="onClosedTemplates"
      />
    </div>

    <div
      v-else-if="subTabName == 'Mediclaim Approvals'"
      @scroll="scrolled('MediclaimApprovals')"
      id="MediclaimApprovals"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <MediclaimCard
        v-for="(claim, index) in mediclaims"
        :key="index"
        :mediclaimData="claim"
        :tab="mediclaimTabs.REQUEST_ADMIN"
        @reloadClaims="reloadApiData"
        data-id="mediclaimCard_{{claim._id}}"
      >
      </MediclaimCard>
    </div>

    <div
      v-else-if="subTabName == todoNotification.PENDING_LOAN_APPROVALS"
      @scroll="scrolled('loanRequests')"
      id="loanRequests"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <LoanRequestCard
        v-for="loan in loanRequests"
        :key="loan._id"
        :loanData="loan"
        :secretKey="secretKey"
        :tab="subTabName"
        @approve="reloadApiData"
      >
      </LoanRequestCard>
    </div>

    <div
      v-else-if="subTabName == todoNotification.PENDING_FULL_SETTLEMENTS"
      @scroll="scrolled('fullSettlementRequests')"
      id="fullSettlementRequests"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <FullSettlementCard
        v-for="fullSettlement in fullSettlementRequests"
        :key="fullSettlement._id"
        :fullSettlementRequest="fullSettlement"
        :tab="subTabName"
        @close="fetchPendingFullSettlementRequests"
      >
      </FullSettlementCard>
    </div>

    <div
      v-else-if="subTabName == todoNotification.TO_BE_DISBURSED"
      @scroll="scrolled('toBeSettled')"
      id="toBeSettled"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <LoanRequestCard
        v-for="toBeSettleLoanRequest in toBeSettleLoanRequests"
        :key="toBeSettleLoanRequest._id"
        :loanData="toBeSettleLoanRequest"
        :secretKey="secretKey"
        :tab="subTabName"
        @approve="reloadApiData"
      >
      </LoanRequestCard>
    </div>

    <div
      v-else-if="subTabName == todoNotification.PAYROLL_MONTH_EMIS"
      @scroll="scrolled('emisRequests')"
      id="emisRequests"
      style="height: 78vh !important"
      class="scroll_timesheet row wrap justify-start items-start content-start full-width"
    >
      <LoanCard
        v-for="emi in currentMonthEMIs"
        :key="emi._id"
        :emisData="emi"
        :tab="subTabName"
        @emisStatusUpdated="stateUpdate($event)"
        @errorHandling="errorHandling($event)"
      >
      </LoanCard>
    </div>

    <div
      v-else-if="subTabName == todoNotification.OPEN_VOUCHER"
      @scroll="scrolled('openVouchers')"
      id="openVouchers"
      class="open-voucher-container"
    >
      <div data-id="cancel-vouchers-actions" class="cancel-vouchers-actions">
        <q-checkbox
          v-model="multipleCancelCheck"
          label="Select All"
          color="primary"
          data-id="select-all-checkbox"
          @click="updateAllVoucherSelection"
        />

        <q-btn
          flat
          label="Cancel selected"
          color="primary"
          class="q-ml-20 cancel-button"
          data-id="cancel-selected-button"
          @click="onClickCancel"
          :disable="selectedVouchers.length <= 0"
        />
      </div>
      <div
        class="scroll_timesheet wrap row justify-start items-start content-start full-width"
      >
        <VoucherCard
          v-for="voucher in openVouchers"
          :key="voucher._id"
          :voucherData="voucher"
          :tab="subTabName"
          :isCancelChecked="hasSelectedAll"
          :selectedVouchers="selectedVouchers"
          @deselectAll="deSelectAllVouchers"
          @updateSelection="updateVoucherSelection"
          @close="getOpenVouchers"
        >
        </VoucherCard>
      </div>
    </div>
    <div
      v-else-if="subTabName == todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS"
      @scroll="scrolled('pendingVoucherRequests')"
      id="pendingVoucherRequests"
      class="pending_voucher_requests"
    >
      <div
        class="scroll_timesheet wrap row justify-start items-start content-start full-width"
      >
        <VoucherChangeRequestCard
          v-for="request in pendingVoucherRequests"
          :key="request._id"
          :tab="subTabName"
          :requestData="request"
          @close="getPendingVouchersChangeRequests"
          @reloadRequests="reloadPendingVoucherChangeRequests"
        >
        </VoucherChangeRequestCard>
      </div>
    </div>
    <ValidateKeyForm
      :tabName="todoNotification.PENDING_FULL_SETTLEMENTS"
      :modal="openValidationPopup"
      @onClose="closeValidationPopup"
      @oncloseNotFound="onClose"
    />

    <DialogForIRApproval
      v-if="openAdjustPayrollMonthDialog"
      :minPayrollMonth="minPayrollMonth"
      :payrollSelector="payrollMonth"
      :payrollMonthDialog="openAdjustPayrollMonthDialog"
      @showApprovalConfirmation="showApprovalConfirmation"
      @closeModel="closePayrollModel"
    >
    </DialogForIRApproval>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
    <CancelVoucher
      :cancellationDialog="openCancelVoucherDialog"
      @cancelVoucher="showCancellationConfirmation"
      @closeDialog="closeCancellationDialog"
    />
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
            Invalid Data
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errorMsg }}
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
</template>

<script>
const moment = require("moment");
import CurrentAppraisal from "src/components/Appraisal/CurrentAppraisal.vue";
import FormCard from "src/components/Appraisal/FormCard.vue";
import SelfAppraisalCard from "src/components/Appraisal/SelfAppraisalCard.vue";
import DialogForIRApproval from "src/components/InternetReimbursement/DialogForIRApproval.vue";
import UnsettledIR from "src/components/InternetReimbursement/UnsettledIR.vue";
import AccrualsCard from "src/components/Leaves/AccrualsCard.vue";
import LeaveRequestsCard from "src/components/Leaves/LeaveRequestsCard.vue";
import MissingTimesheetCount from "src/components/MissingTimesheetCount.vue";
import TimeSheet from "src/components/TimeSheet.vue";
import LeadAppraisalCard from "../components/Appraisal/LeadAppraisalCard.vue";
import BirthDayTemplate from "../components/BirthdayTemplatesApproval.vue";
import CompoffTimesheet from "../components/CompoffTimesheet.vue";
import ViewDetails from "../components/InternetReimbursement/ViewDetails.vue";
import ViewRequest from "../components/InternetReimbursement/ViewRequest.vue";
import FullSettlementCard from "../components/Loan/FullSettlementCard.vue";
import LoanCard from "../components/Loan/LoanCard.vue";
import LoanRequestCard from "../components/Loan/LoanRequestCard.vue";
import MediclaimCard from "../components/Mediclaim/MediclaimCard.vue";
import CancelVoucher from "../components/PettyCash/CancelVoucher.vue";
import VoucherCard from "../components/PettyCash/VoucherCard.vue";
import ValidateKeyForm from "../components/ValidateKeyForm.vue";
import { TodoNotificationConstants } from "../constants/dashboard";
import { EMIsStatus } from "../constants/loan";
import { MediclaimTabs } from "../constants/mediclaimConstants.js";
import { Constants, ValidationMessages } from "../constants/pettyCash";
import * as irServices from "../services/IR.service";
import { getLastLockedPayrollDetails } from "../services/IRHelperService";
import * as appraisalService from "../services/appraisals.service";
import * as functions from "../services/functions";
import * as loanService from "../services/loan.service";
import * as mediclaimService from "../services/mediclaims.service";
import * as inboxservice from "../services/myinboxtabs.service";
import * as pettyCashService from "../services/pettyCash.service";
import * as projectsService from "../services/projects.service";
import * as timsheetService from "../services/timesheets.service";
import VoucherChangeRequestCard from "../components/PettyCash/VoucherChangeRequestCard.vue";

export default {
  name: "InboxView",
  components: {
    MissingTimesheetCount,
    LeaveRequestsCard,
    TimeSheet,
    CompoffTimesheet,
    LeadAppraisalCard,
    CurrentAppraisal,
    FormCard,
    SelfAppraisalCard,
    ViewDetails,
    ViewRequest,
    AccrualsCard,
    UnsettledIR,
    BirthDayTemplate,
    DialogForIRApproval,
    MediclaimCard,
    LoanRequestCard,
    FullSettlementCard,
    ValidateKeyForm,
    LoanCard,
    VoucherCard,
    CancelVoucher,
    VoucherChangeRequestCard,
  },
  data() {
    return {
      unsettledLeaves: [],
      inboxSplitter: 50,
      appraisals: [],
      appraisalsToDisplay: [],
      appraisalsToDisplay1: [],
      skip: 0,
      successMsg: "",
      comments: "",
      tab: "Mentees Leave Requests",
      tab1: "Current",
      tabvalue: "",
      tabType: "My TimeSheets",
      subTabName: "",
      missingTimesheetdates: [],
      timeSheetsToDisplay: [],
      leavesToDisplay: [],
      leavesToDisplay2: [],
      leaveRequests: [],
      mediclaims: [],
      loanRequests: [],
      currentMonthEMIs: [],
      fullSettlementRequests: [],
      openValidationPopup: false,
      secretKey: "",
      timeSheets: [
        {
          date: null,
          user: "",
          data: [],
          color: "",
          border: "",
        },
      ],
      irRequests: [],
      viewAdminRequestModal: false,
      viewDetailsAdminRequest: false,
      ApplyDate: "",
      showRejectionDialog: false,
      showActiveCards: false,
      errorLayout: false,
      errorMsg: "",
      nameFilter: "",
      timeSheetsToDisplay2: "",
      statusFilterAllSheets: "",
      optionClients: [],
      IRRequestData: null,
      mediclaimTabs: MediclaimTabs,
      todoNotification: TodoNotificationConstants,
      changeTabName: "changeTabName",
      toBeSettleLoanRequests: [],
      openVouchers: [],
      multipleCancelCheck: false,
      hasSelectedAll: false,
      selectedVouchers: [],
      openCancelVoucherDialog: false,
      pendingVoucherRequests: [],
    };
  },
  watch: {
    nameFilter: function (newVal) {
      this.filter();
    },
    statusFilterAllSheets: function (newVal) {
      this.filter();
    },
  },
  methods: {
    errorHandling(msg) {
      this.errMsg = msg;
      this.errorLayout = true;
    },
    onClose() {
      this.openValidationPopup = false;
    },
    async closeValidationPopup(data) {
      this.secretKey = data.secretKey;
      this.openValidationPopup = false;
      await this.fetchPendingLoans();
      this.$store.commit(this.changeTabName, this.subTabName);
    },
    async onApprovedTemplates(message) {
      this.successMsg = message;
      await this.reloadApiData();
    },
    async onClosedTemplates() {
      await this.reloadApiData();
    },
    filter() {
      this.timeSheetsToDisplay = this.timeSheetsToDisplay2;
      this.filterByTemplateName();
      this.filterByStatus();
    },
    filterByTemplateName() {
      if (this.nameFilter != null) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) => {
            return timesheet.userName
              .toLowerCase()
              .includes(this.nameFilter.toLowerCase());
          },
        );
      }
    },
    filterByStatus() {
      if (this.statusFilterAllSheets) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter((event) => {
          return event.client.includes(this.statusFilterAllSheets.id);
        });
      }
    },
    async showActiveOnly(val) {
      this.showActiveCards = val;
      this.nameFilter = "";
      this.statusFilterAllSheets = "";
      if (this.showActiveCards) {
        const leavesDates = [];
        const data = this.leavesToDisplay2;
        for (let index = 0; index < data?.length; index++) {
          for (let i = 0; i < data[index].leaveDate.length; i++) {
            const leaveStatus = data[index].leaveDate[i].status;
            if (
              this.leavesToDisplay <= 0 ||
              !leavesDates.includes(data[index].leaveDate[i].leaveDate)
            ) {
              leavesDates.push(data[index].leaveDate[i].leaveDate);
              this.leavesToDisplay.push({
                date: data[index].leaveDate[i].leaveDate,
                userNames: [
                  {
                    username: data[index].userName,
                    status:
                      leaveStatus === "autoApproved" ? "approved" : leaveStatus,
                  },
                ],
              });
            } else {
              var index1 = this.leavesToDisplay.findIndex(
                (x) =>
                  x.date.toString() ==
                  data[index].leaveDate[i].leaveDate.toString(),
              );
              this.leavesToDisplay[index1].userNames.push({
                username: data[index].userName,
                status:
                  leaveStatus === "autoApproved" ? "approved" : leaveStatus,
              });
            }
          }
        }
        this.leavesToDisplay.sort(
          (a, b) => new Date(a.date) - new Date(b.date),
        );
      } else {
        this.leavesToDisplay = [];
      }
    },
    onCloseReject() {
      this.comments = "";
      this.showRejectionDialog = false;
    },
    async getAllMissingTimesheet() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.timesheetRecord?.length > 0) {
          res.data.timesheetRecord.forEach((element) => {
            let date = functions.convertUTCToDate(element);
            this.timeSheetsToDisplay.push(date);
          });
        } else {
          this.$router.replace("/");
        }

        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    async getAllPendingTimesheetApprovals() {
      this.$q.loading.show();
      let result = await inboxservice.fetchMyInboxTabsData({
        userId: this.$store.getters.userId,
        userType: this.$store.getters.user.userType,
        subTab: this.tabvalue,
        skip: this.skip,
      });
      this.skip += 50;
      if (result?.data?.length > 0) {
        result.data.forEach((element) => {
          element.reportDate = element.date;
        });
        this.timeSheetsToDisplay = result?.data;
      }
      if (this.timeSheetsToDisplay.length == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },
    async approveUsersTmeSheet(objectData) {
      this.$q.loading.show();
      this.dontClearFilters = true;
      const sheetIndex = this.timeSheetsToDisplay.findIndex(
        (sheet) =>
          sheet.user.user_id === objectData.userId &&
          sheet.date === objectData.sheetsDate,
      );
      this.timeSheetsToDisplay.splice(sheetIndex, 1);
      let res = await timsheetService.approveTimeSheetForDay(objectData);
      this.$q.loading.hide();

      if (objectData.userId != this.$store.getters.userId) {
        if (objectData.isApprove) {
          this.successMsg = "Timesheet Approved!!";
          this.timeSheetsToDisplay.filter((data) => {
            if (
              data.date == objectData.sheetsDate &&
              data.user.user_id == objectData.userId
            ) {
              (data.color = "primary"),
                (data.border = "border-primary"),
                (data.status = "Approved");
            }
          });
        } else {
          this.successMsg = "Timesheet Rejected.";
          this.timeSheetsToDisplay.filter((data) => {
            if (
              data.date == objectData.sheetsDate &&
              data.user.user_id == objectData.userId
            ) {
              (data.color = "negative"),
                (data.border = "border-danger"),
                (data.status = "Rejected");
            }
          });
        }
      } else {
        this.successMsg = "Access Denied.";
      }

      if (this.timeSheetsToDisplay.length == 0) {
        this.$router.replace("/");
      }
    },

    async ApproveStatus(data) {
      this.$q.loading.show();
      this.dontClearFilters = true;
      const sheetIndex = this.leaveRequests.findIndex(
        (sheet) => sheet._id === data,
      );
      this.leaveRequests.splice(sheetIndex, 1);
      if (this.leaveRequests?.length == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },
    addToArrayIfNotExist2(arr, project) {
      let sheet = [];
      let totalProjectSpentTime = 0;
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

      for (let index in arr) {
        if (
          this.convertDate(project.reportDate) ==
            this.convertDate(arr[index].date) &&
          project.user._id == arr[index].user.user_id
        ) {
          arr[index].data.push({
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          });
          return arr;
        }
      }

      arr.push({
        date: project.reportDate,
        mentor: {
          name: project.mentor
            ? project.mentor.firstName + " " + project.mentor.lastName
            : "NO MENTOR",
        },
        user: {
          user_id: project.user._id,
          user_name: project.user.firstName + " " + project.user.lastName,
        },
        data: [
          {
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          },
        ],
        color: project.isApproved
          ? "primary"
          : project.isRejected
          ? "negative"
          : "warning",
        border: project.isApproved
          ? "border-primary"
          : project.isRejected
          ? "border-danger"
          : "border-warning",
        status: project.isApproved
          ? "Approved"
          : project.isRejected
          ? "Rejected"
          : "Pending",
      });
      return arr;
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },

    async getPendingLeaveRequestsApproval() {
      this.$q.loading.show();
      const res = await inboxservice.fetchMyInboxTabsData({
        userId: this.$store.getters.userId,
        userType: this.$store.getters.user.userType,
        subTab: this.tabvalue,
        skip: this.skip,
      });
      res?.data?.forEach((element) => {
        let data = [];
        element.cancelledLeaveDates.forEach((ele) => {
          data.push(functions.convertDateToDate(ele));
        });
        element.cancelledLeaveDatesArray = data.join(", ");
        data = [];
        element.rejectedLeaveDates.forEach((ele) => {
          data.push(functions.convertDateToDate(ele));
        });
        element.rejectedLeaveDatesArray = data.join(", ");
      });
      this.skip += 50;
      if (res?.data?.length > 0) {
        this.leaveRequests = [...this.leaveRequests, ...res.data];
      }
      this.$q.loading.hide();
    },
    async getPendingLeadAppraisals() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.length > 0) {
          this.appraisalsToDisplay = [...res.data];
        }
        if (this.appraisalsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getPendingReviewAppraisals() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.length > 0) {
          this.appraisalsToDisplay = [...res.data];
        }
        if (this.appraisalsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getPendingAppraisalInitiation() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.length > 0) {
          this.appraisalsToDisplay = [...res.data];
        }
        if (this.appraisalsToDisplay == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getPendingIn360Appraisals() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.length > 0) {
          this.appraisalsToDisplay = [...res.data];
        }
        if (this.appraisalsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getPendingAllIRApprovals() {
      try {
        this.irRequests = [];
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        if (res?.data?.length > 0) {
          res.data.forEach((element) => {
            this.irRequests.push(element);
          });
        }
        const payrollData = await getLastLockedPayrollDetails();
        this.lastLockedPayrollMonth = payrollData.lastLockedPayrollMonth;
        this.minPayrollMonth = payrollData.minPayrollMonth;
        if (this.irRequests.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (err) {
        this.$q.loading.hide();
      }
    },
    showApplyIR() {
      this.getPendingAllIRApprovals();
      this.visibilityApplyIR = true;
    },
    async closeApplyIR() {
      this.visibilityApplyIR = false;
      this.getPendingAllIRApprovals();
    },
    closeViewDetails() {
      this.viewDetailsAdminApprove = false;
      this.viewDetailsAdminRequest = false;
      this.viewDetailsUserApproved = false;
      this.viewDetailsUserRequest = false;
      this.selectedDocument = "";
      this.getPendingAllIRApprovals();
    },
    closeViewRequest() {
      this.getPendingAllIRApprovals();
      this.viewAdminRequestModal = false;
    },
    rejectDialog(requestId) {
      this.selectedRequestId = requestId;
      this.showRejectionDialog = true;
    },
    async getAdminIrByFilter() {
      if (this.subTabName == "IR Approval")
        await this.getPendingAllIRApprovals();
    },
    async oCancelClick() {
      let submission = {
        requestId: this.selectedRequestId,
        status: {
          pending: "false",
          approved: "false",
          rejected: "true",
        },
        comments: this.comments,
      };
      await irServices.rejectRequest(submission).then((uploadResponse) => {
        if (uploadResponse.data.reqStatus === "error") {
        }
      });
      this.showRejectionDialog = false;
      this.comments = "";
      this.selectedRequestId = "";
      await this.getPendingAllIRApprovals();
    },
    async getPendinselfAppraisals() {
      try {
        this.$q.loading.show();

        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (res?.data?.length > 0) {
          this.appraisalsToDisplay = [...res.data];
        }
        if (this.appraisalsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        this.$q.loading.hide();
      }
    },
    async getPendingInConclusionAppraisals() {
      try {
        this.appraisalsToDisplay1 = [];
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        var arrayIds = [];
        let data = [];
        if (res.data.length > 0) {
          this.appraisalsToDisplay1 = [...res.data];
          res.data.forEach((element) => {
            arrayIds.push({
              userId: element.user._id,
              appraisalId: element._id,
            });
            data.push({
              appraisalId: element._id,
              type: "conclusions",
              user: element.user,
              previousDate: element.dates.lastAppraisalDate,
              currentDate: element.dates.currentAppraisalDate,
              lwp: element.lwp,
              shortFall: element.shortFall,
              totalleaves: element.totalleaves,
              totalworkinghours: element.totalworkinghours,
              text: "",
              reportId: "",
              strength: "",
              performance: "",
              conclusionDate: "",
              status: "due",
            });
          });
          let res1 = await appraisalService.fetchImrpovementOpps(arrayIds);
          data.forEach((ele1) => {
            if (res1.data.length > 0) {
              res1.data.forEach((ele2) => {
                if (
                  ele2.user == ele1.user._id &&
                  ele2.appraisal_id == ele1.appraisalId
                ) {
                  ele1.text = ele2.improvementOpportunity;
                  ele1.reportId = ele2._id;
                  ele1.strength = ele2.strengths;
                  ele1.performance = ele2.performance;
                  ele1.conclusionDate = ele2.conclusionDate;
                  ele1.status = ele2.status;
                }
              });
            }
          });
        }
        this.appraisals = data;
        this.appraisalsToDisplay = this.appraisals;
        // this.$store.commit("changeTabName", 'Conclusion History');
        if (this.appraisalsToDisplay1.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getPendingCompOffApproval() {
      try {
        this.$q.loading.show();
        let result = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        this.skip += 50;
        if (result?.data?.length > 0) {
          result?.data?.forEach((element) => {
            element.status =
              element.CompoffStatus == "Pending" ? "Approved" : element.status;
          });

          this.timeSheetsToDisplay = result?.data;
        }
        if (this.timeSheetsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async fetchMyTeamLeavesCard() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
        });
        this.timeSheetsToDisplay = res?.data?.groupLeaveData
          ? res?.data?.groupLeaveData
          : [];
        this.timeSheetsToDisplay = await this.prepareMonthArrayData(
          this.timeSheetsToDisplay,
        );
        this.timeSheetsToDisplay2 = res?.data?.groupLeaveData
          ? res?.data?.groupLeaveData
          : [];
        this.leavesToDisplay2 = res?.data?.groupLeaveData
          ? res?.data?.groupLeaveData
          : [];
        if (this.timeSheetsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (err) {
        this.errorLayout = true;
        this.errorMsg = err;
        this.$q.loading.hide();
      }
    },
    prepareMonthArrayData(array) {
      array?.forEach((ele) => {
        const uniqueMonths = [];
        ele.monthData = [];
        ele?.leaveDate?.filter((dateString) => {
          const date = moment(dateString.leaveDate, "YYYY-MM-DD");
          if (!uniqueMonths.includes(date.format("MMM"))) {
            uniqueMonths.push(date.format("MMM"));
            ele.monthData.push({
              monthName: date.format("MMM"),
              monthDates: date.format("DD"),
            });
          } else {
            var index1 = uniqueMonths.findIndex(
              (x) => x.toString() == date.format("MMM").toString(),
            );
            ele.monthData[index1].monthDates += ", " + date.format("DD");
          }
        });
      });
      return array;
    },
    async fetchMyClients() {
      try {
        const res = await projectsService.getMyProject(
          this.$store.getters.userId,
        );
        this.optionClients = [];
        res?.data[0]?.clientsAndProjects.map((ele) => {
          if (!ele.client.isLeaveShow) {
            this.optionClients.push({
              id: ele.client._id,
              label: ele.client.name,
            });
          }
        });
      } catch (err) {
        this.errorLayout = true;
        this.errorMsg = err;
      }
    },
    async getPendingSatSunTimesheetApproval() {
      try {
        this.$q.loading.show();
        let result = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        console.log("result", result);
        this.skip += 50;
        if (result?.data?.length > 0) {
          result?.data?.forEach((element) => {
            element.status =
              element.CompoffStatus == "Pending" ? "Approved" : element.status;
          });

          this.timeSheetsToDisplay = result?.data;
        }
        if (this.timeSheetsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async getPendingCompOffApprovalByMentor() {
      try {
        this.$q.loading.show();
        let result = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
        });
        if (result?.data?.length > 0) {
          result.data.forEach((element) => {
            element.reportDate = element.date;
          });
          this.timeSheetsToDisplay = result?.data;
        }
        if (this.timeSheetsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    addToArrayIfNotExist23(arr, project) {
      let sheet = [];
      let totalProjectSpentTime = 0;
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

      for (let index in arr) {
        if (
          this.convertDate(project.reportDate) ==
            this.convertDate(arr[index].date) &&
          project.user._id == arr[index].user.user_id
        ) {
          arr[index].data.push({
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          });
          return arr;
        }
      }

      arr.push({
        date: project.reportDate,
        CompoffStatus: project.CompoffStatus,
        isLapsed: project.isLapsed,
        mentor: {
          name: project.mentor
            ? project.mentor.firstName + " " + project.mentor.lastName
            : "NO MENTOR",
        },
        user: {
          user_id: project?.user?._id,
          user_name: project.user
            ? project?.user?.firstName + " " + project?.user?.lastName
            : "NO USER",
        },
        data: [
          {
            name: project.project.name,
            time: project.time ? project.time : totalProjectSpentTime,
            sheets: sheet,
          },
        ],
        color: project.isApproved
          ? "primary"
          : project.isRejected
          ? "negative"
          : "warning",
        border: project.isApproved
          ? "border-primary"
          : project.isRejected
          ? "border-danger"
          : "border-warning",
        status: project.isApproved
          ? "Approved"
          : project.isRejected
          ? "Rejected"
          : "Pending",
      });
      return arr;
    },
    async onApproveCompoffSheet(value) {
      this.$q.loading.show();
      const sheetIndex = this.timeSheetsToDisplay.findIndex(
        (sheet) =>
          sheet.user.user_id === value.user && sheet.date === value.date,
      );
      this.timeSheetsToDisplay.splice(sheetIndex, 1);
      let result = await timsheetService.updateCompoffStatus(value);
      this.successMsg = "CompOff Status Updated!!";
      if (this.timeSheetsToDisplay == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },
    showCancellationConfirmation(cancellationReason) {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Would you like to cancel voucher?",
          cancel: true,
          persistent: true,
          ok: "Yes",
          cancel: {
            color: "negative",
            label: "No",
            flat: true,
          },
        })
        .onOk(() => {
          this.onSubmitCancel(cancellationReason);
        })
        .onCancel(() => {
          return false;
        });
    },
    async onSubmitCancel(cancellationReason) {
      try {
        const vouchersToCancel = this.selectedVouchers.map((voucher) => {
          const invoiceAmount = 0;
          const settlementAmount = parseInt(voucher.amount);
          return {
            id: voucher._id,
            invoiceAmount: invoiceAmount,
            settlementAmount: settlementAmount,
            closedBy: this.$store.getters.userId,
            openingDate: voucher?.openingDate,
            closingDate: new Date(),
            isCancel: true,
            cancellationReason: cancellationReason,
          };
        });
        const res = await pettyCashService.cancelTransactions(vouchersToCancel);
        this.$q.notify({
          type: Constants.POSITIVE,
          message: Constants.TRANSACTION_CANCEL_SUCCESSFULLY,
          timeout: 3000,
          color: Constants.NOTIFY_COLOR,
          position: Constants.BOTTOM_LEFT,
        });
        this.selectedVouchers = [];
        this.closeCancellationDialog();
        this.getOpenVouchers();
      } catch (error) {
        console.log("error::", error);
        this.errorMessage = ValidationMessages.ERROR_WHILE_CANCELING;
        this.errorLayout = true;
      }
    },
    scrolled(val) {
      var elmnt = document.getElementById(val);
      var scrollHeight = elmnt.scrollHeight;
      var divHeight = elmnt.offsetHeight;
      var scrollerEndPoint = scrollHeight - divHeight;
      var divScrollerTop = elmnt.scrollTop;
      if (
        (parseInt(divScrollerTop) === scrollerEndPoint && divScrollerTop > 0) ||
        parseInt(divScrollerTop) + 1 === scrollerEndPoint ||
        parseInt(divScrollerTop) + 2 === scrollerEndPoint
      ) {
        if (this.subTabName == this.todoNotification.LEAVE_APPROVAL) {
          this.getPendingLeaveRequestsApproval();
        } else if (
          this.subTabName == this.todoNotification.TIMESHEET_APPROVAL
        ) {
          this.getAllPendingTimesheetApprovals();
        } else if (this.subTabName == this.todoNotification.COMPOFF_APPROVAL) {
          this.getPendingCompOffApproval();
        }
      }
    },
    async onApproveClick(data, cardClick) {
      this.IRRequestData = cardClick
        ? this.irRequests.find((request) => request._id === data)
        : data;
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: "Would you like to approve the request?",
          cancel: true,
          ok: "Confirm",
          persistent: true,
        })
        .onOk(() => {
          this.onConfirmApprove();
        });
    },
    async onConfirmApprove() {
      const submission = {
        requestId: this.IRRequestData._id,
        approvedAmount: this.IRRequestData.reimAmount,
        approvedMonths: this.IRRequestData.selectedMonths,
        approvalDate: Date.now(),
        status: {
          pending: "false",
          approved: "true",
          rejected: "false",
        },
        adjustedPayrollMonth: this.payrollMonth,
      };
      await irServices
        .approveRequest(submission)
        .then(() => {
          this.successMsg = "IR approved successfully!";
        })
        .catch((error) => {
          this.errorMessage = "IR could not be approved!";
          this.errorLayout = true;
        });
      this.onLoad();
      this.showRejectionDialog = false;
      this.getPendingAllIRApprovals();
    },

    closePayrollModel() {
      this.openAdjustPayrollMonthDialog = false;
    },
    rejectDialog(requestId) {
      this.selectedRequestId = requestId;
      this.showRejectionDialog = true;
      this.getPendingAllIRApprovals();
    },
    onAdminViewIRRequest(requestId) {
      this.selectedDocument = this.irRequests.find(
        (request) => request._id === requestId,
      );
      this.viewAdminRequestModal = true;
    },
    async onLoad() {},
    async createRequestForIR() {
      try {
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        if (res?.data?.length <= 0) {
          let formatedDate = moment(new Date()).format("MMM YY");
          this.ApplyDate = formatedDate;
        } else {
          this.ApplyDate = null;
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    async getAllRejectedTimesheet() {
      this.$q.loading.show();
      let result = await inboxservice.fetchMyInboxTabsData({
        userId: this.$store.getters.userId,
        userType: this.$store.getters.user.userType,
        subTab: this.tabvalue,
        skip: this.skip,
      });
      this.skip += 50;
      if (result?.data?.length > 0) {
        result.data.forEach((element) => {
          element.reportDate = element.date;
        });
        this.timeSheetsToDisplay = result?.data;
      }
      if (this.timeSheetsToDisplay.length == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },
    async getPendingLeavesToBeSettled() {
      this.$q.loading.show();
      let result = await inboxservice.fetchMyInboxTabsData({
        userId: this.$store.getters.userId,
        userType: this.$store.getters.user.userType,
        subTab: this.tabvalue,
        skip: this.skip,
      });
      this.skip += 50;
      if (result.data.length > 0) {
        result.data.forEach((element) => {
          this.unsettledLeaves.push(element);
        });
      }
      this.$store.commit(this.changeTabName, "All Accruals");
      if (this.unsettledLeaves.length == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },
    removeSettledLwps(data) {
      this.$q.loading.show();
      const sheetIndex = this.unsettledLeaves.findIndex(
        (sheet) => sheet._id === data._id,
      );
      this.unsettledLeaves.splice(sheetIndex, 1);
      if (this.unsettledLeaves.length == 0) {
        this.$router.replace("/");
      }
      this.$q.loading.hide();
    },

    async getPendingIRToBeSettled() {
      try {
        this.irRequests = [];
        this.$q.loading.show();
        const res = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
          skip: this.skip,
        });
        if (res?.data?.length > 0) {
          this.irRequests = [...res.data];
        }
        if (this.irRequests.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (err) {
        this.$q.loading.hide();
      }
    },
    async getPendingBirthDayWishMessagesApproval() {
      try {
        this.$q.loading.show();
        let result = await inboxservice.fetchMyInboxTabsData({
          userId: this.$store.getters.userId,
          userType: this.$store.getters.user.userType,
          subTab: this.tabvalue,
        });
        this.timeSheetsToDisplay = result?.data;
        if (this.timeSheetsToDisplay.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async fetchPendingLoans() {
      try {
        this.$q.loading.show();
        let result = await loanService.fetchPendingLoans();
        this.loanRequests = result?.data?.result.filter(
          (ele) => ele.userId != this.$store.getters.user._id,
        );
        if (this.loanRequests.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async fetchPendingFullSettlementRequests() {
      try {
        this.$q.loading.show();
        const result = await loanService.fetchPendingFullSettlementRequests();
        this.fullSettlementRequests = result?.data?.result.filter(
          (ele) => ele.userId != this.$store.getters.user._id,
        );
        if (this.fullSettlementRequests.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async getAllToBeDisbursedLoanRequest() {
      try {
        this.$q.loading.show();
        const result = await loanService.getAllToBeDisbursedLoanRequest();
        this.toBeSettleLoanRequests = result?.data?.result.filter(
          (ele) => ele.userId != this.$store.getters.user._id,
        );
        if (this.toBeSettleLoanRequests.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    async listAllEMIForCurrentMonth() {
      try {
        this.$q.loading.show();
        let result = await loanService.listAllEMIForCurrentMonth();
        this.currentMonthEMIs = result?.data?.result;
        if (this.currentMonthEMIs.length == 0) {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (e) {
        this.$q.loading.hide();
      }
    },
    stateUpdate(data) {
      const index = this.currentMonthEMIs.findIndex(
        (array) => array._id == data.emiId,
      );
      this.currentMonthEMIs[index].status = data?.status;
      this.currentMonthEMIs[index].updatedBy = data?.updatedBy;
      this.currentMonthEMIs[index].updatedUserFullName =
        data?.updatedUserFullName;
      if (data.status == EMIsStatus.PENDING) {
        this.currentMonthEMIs[index].payrollMonth = data?.payrollMonth;
      }
    },
    async getAllMediclaims() {
      const query = new URLSearchParams();
      query.append("status", "pending");
      let res = await mediclaimService.fetchAllClaims(`?${query.toString()}`);
      console.log("console.log()", res);
      if (res.status == 200) {
        this.mediclaims = res.data;
      } else this.showError(res.data.message);
    },
    async getOpenVouchers() {
      const res = await pettyCashService.getOpenVouchers();
      if (res.status == 200) {
        this.openVouchers = res.data;
      } else this.showError(res?.data?.message);
    },
    async getPendingVouchersChangeRequests() {
      const res = await pettyCashService.getAllVoucherChangeRequest({
        status: EMIsStatus.PENDING,
        skip: 0,
        limit: Number.MAX_SAFE_INTEGER,
      });
      if (res.status == 200) {
        this.pendingVoucherRequests = res.data?.voucherChangeRequests;
      } else {
        this.showError(res?.data?.message);
      }
    },
    reloadPendingVoucherChangeRequests(response) {
      if (response.status) {
        this.pendingVoucherRequests = [];
        this.getPendingVouchersChangeRequests();
        this.successMessage = response.message;
      } else {
        this.errorMessage = response.message;
        this.errorLayout = true;
      }
    },
    async reloadAppraisals(flag) {
      if (flag && this.subTabName == this.todoNotification.SELF_APPRAISAL)
        return;
      this.$q.loading.show();
      this.appraisalsToDisplay = [];
      if (this.subTabName == this.todoNotification.SELF_APPRAISAL)
        await this.getPendinselfAppraisals();
      if (this.subTabName == this.todoNotification.LEAD_APPRAISAL)
        await this.getPendingLeadAppraisals();
      if (this.subTabName == this.todoNotification.REVIEWER_APPRAISAL)
        await this.getPendingReviewAppraisals();
      this.$q.loading.hide();
    },

    async reloadApiData() {
      this.$q.loading.show();
      this.leaveRequests = [];
      this.appraisalsToDisplay = [];
      this.timeSheetsToDisplay = [];
      this.unsettledLeaves = [];
      this.skip = 0;
      if (this.subTabName == this.todoNotification.LEAD_APPRAISAL)
        await this.getPendingLeadAppraisals();
      if (this.subTabName == this.todoNotification.REVIEWER_APPRAISAL)
        await this.getPendingReviewAppraisals();
      if (this.subTabName == this.todoNotification.INITIATE_APPRAISAL)
        await this.getPendingAppraisalInitiation();
      if (this.subTabName == this.todoNotification.IN_CONCLUSION)
        await this.getPendingInConclusionAppraisals();
      if (this.subTabName == this.todoNotification.SELF_APPRAISAL)
        await this.getPendinselfAppraisals();
      if (this.subTabName == this.todoNotification.MISSING_TIMESHEET)
        await this.getAllMissingTimesheet();
      if (this.subTabName == this.todoNotification.IR_APPROVAL)
        await this.getPendingAllIRApprovals();
      if (this.subTabName == this.todoNotification.TIMESHEET_APPROVAL)
        await this.getAllPendingTimesheetApprovals();
      if (this.subTabName == this.todoNotification.REJECTED_TIMESHEET)
        await this.getAllRejectedTimesheet();
      if (this.subTabName == this.todoNotification.LEAVE_APPROVAL)
        await this.getPendingLeaveRequestsApproval();
      if (this.subTabName == this.todoNotification.COMPOFF_APPROVAL)
        await this.getPendingCompOffApproval();
      if (this.subTabName == this.todoNotification.COMPOFF_MENTEES)
        await this.getPendingCompOffApprovalByMentor();
      if (this.subTabName == this.todoNotification.IN_360_APPRAISAL)
        await this.getPendingIn360Appraisals();
      if (this.subTabName == "All LWPs")
        await this.getPendingLeavesToBeSettled();
      if (this.subTabName == this.todoNotification.IR_TO_BE_SETTLED)
        await this.getPendingLeavesToBeSettled();
      if (this.subTabName == this.todoNotification.PENDING_LOAN_APPROVALS)
        await this.fetchPendingLoans();
      if (this.subTabName == this.todoNotification.PENDING_FULL_SETTLEMENTS)
        await this.fetchPendingFullSettlementRequests();
      if (this.subTabName == this.todoNotification.MEDICLAIM_APPROVALS)
        await this.getAllMediclaims();
      if (this.subTabName == this.todoNotification.PAYROLL_MONTH_EMIS)
        await this.listAllEMIForCurrentMonth();
      if (this.subTabName == this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL)
        await this.getPendingBirthDayWishMessagesApproval();
      if (this.subTabName == this.todoNotification.TO_BE_DISBURSED)
        await this.getAllToBeDisbursedLoanRequest();
      if (this.subTabName == this.todoNotification.OPEN_VOUCHER)
        await this.getOpenVouchers();
      if (
        this.subTabName == this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS
      )
        this.getPendingVouchersChangeRequests();
      this.$q.loading.hide();
    },
    updateAllVoucherSelection() {
      this.hasSelectedAll = !this.hasSelectedAll;
      this.selectedVouchers = this.hasSelectedAll ? [...this.openVouchers] : [];
    },
    updateVoucherSelection(voucher) {
      const index = this.selectedVouchers?.findIndex((selectedVoucher) => {
        return selectedVoucher?._id == voucher?._id;
      });
      if (index > -1) {
        this.selectedVouchers.splice(index, 1);
      } else {
        this.selectedVouchers.push(voucher);
      }
      this.hasSelectedAll =
        this.selectedVouchers.length > 0 &&
        this.selectedVouchers.length == this.openVouchers.length;
    },
    onClickCancel() {
      this.openCancelVoucherDialog = true;
    },
    closeCancellationDialog() {
      this.openCancelVoucherDialog = false;
    },
    deSelectAllVouchers() {
      this.selectedVouchers = [];
      this.hasSelectedAll = false;
    },
  },
  computed: {
    multipleCancelCheck: function () {
      return (
        this.selectedVouchers.length > 0 &&
        this.openVouchers.length == this.selectedVouchers.length
      );
    },
  },
  async mounted() {
    this.appraisalsToDisplay1 = [];
    this.leaveRequests = [];
    this.appraisalsToDisplay = [];
    this.timeSheetsToDisplay = [];
    this.skip = 0;
    switch (this.subTabName) {
      case this.todoNotification.MISSING_TIMESHEET:
        await this.getAllMissingTimesheet();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.TIMESHEET_APPROVAL:
        await this.getAllPendingTimesheetApprovals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.LEAVE_APPROVAL:
        await this.getPendingLeaveRequestsApproval();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.COMPOFF_APPROVAL:
        await this.getPendingCompOffApproval();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.COMPOFF_MENTEES:
        await this.getPendingCompOffApprovalByMentor();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.LEAD_APPRAISAL:
        this.$store.commit(this.changeTabName, this.subTabName);
        await this.getPendingLeadAppraisals();
        break;
      case this.todoNotification.REVIEWER_APPRAISAL:
        await this.getPendingReviewAppraisals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.INITIATE_APPRAISAL:
        await this.getPendingAppraisalInitiation();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.IN_360_APPRAISAL:
        await this.getPendingIn360Appraisals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.IN_CONCLUSION:
        await this.getPendingInConclusionAppraisals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.SELF_APPRAISAL:
        await this.getPendinselfAppraisals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.IR_APPROVAL:
        await this.getPendingAllIRApprovals();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.APPLY_IR:
        await this.createRequestForIR();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.REJECTED_TIMESHEET:
        await this.getAllRejectedTimesheet();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case "All LWPs":
        await this.getPendingLeavesToBeSettled();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.IR_TO_BE_SETTLED:
        await this.getPendingIRToBeSettled();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.SAT_SUN_WORKING_DAY:
        await this.getPendingSatSunTimesheetApproval();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.MY_TEAM_LEAVES:
        await this.fetchMyTeamLeavesCard();
        await this.fetchMyClients();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.PENDING_LOAN_APPROVALS:
        this.openValidationPopup = true;
        break;
      case this.todoNotification.PENDING_FULL_SETTLEMENTS:
        await this.fetchPendingFullSettlementRequests();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.PAYROLL_MONTH_EMIS:
        await this.listAllEMIForCurrentMonth();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.BIRTHDAY_TEMPLATE_APPROVAL:
        await this.getPendingBirthDayWishMessagesApproval();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.MEDICLAIM_APPROVALS:
        await this.getAllMediclaims();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.TO_BE_DISBURSED:
        await this.getAllToBeDisbursedLoanRequest();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.OPEN_VOUCHER:
        await this.getOpenVouchers();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      case this.todoNotification.PENDING_VOUCHER_CHANGE_REQUESTS:
        await this.getPendingVouchersChangeRequests();
        this.$store.commit(this.changeTabName, this.subTabName);
        break;
      default:
        console.log("invalid tabs");
    }
  },
  beforeMount() {
    this.tabvalue = localStorage.getItem("myinbox");
    this.subTabName = localStorage.getItem("subtabname");
  },
};
</script>

<style>
#card-height {
  height: 68vh !important;
}

.card {
  display: flex;
  flex-wrap: wrap;
  width: 100% !important;
}

.container {
  margin-top: 55px;
}

.heading {
  margin-left: 10px;
  border: 1px solid black;
  border-radius: 10px;
  width: fit-content;
  margin-top: 0px;
}

.item-section {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.card-bottom {
  bottom: 5%;
  position: absolute;
  left: 0;
  right: 0;
}
.cancel-vouchers-actions {
  float: right;
}
.open-voucher-container,
.pending_voucher_requests {
  height: 78vh !important;
}
.cancel-button {
  margin-left: 20px;
}
</style>
