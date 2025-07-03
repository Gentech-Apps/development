<template>
  <q-card
    class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm border-primary"
    style="width: 230px; min-height: 200px"
    :style="isParticipant ? { minHeight: '130px' } : ''"
    :class="
      isParticipant
        ? participant.status == 'inProgress'
          ? 'border-warning'
          : 'border-positive'
        : ''
    "
    rounded
  >
    <div
      v-ripple="!isParticipant && !isAll360Card"
      :class="
        !isParticipant && !isAll360Card ? 'cursor-pointer q-hoverable' : ''
      "
      @click="loadParticipantsCard"
      :id="userAppraisalData ? userAppraisalData._id : ''"
    >
      <div class="q-pt-md q-px-sm">
        <div
          class="text-subtitle2 text-center"
          style="margin-top: -7px; margin-bottom: 15px"
          :class="!isParticipant && !isAll360Card ? 'alignNameAndbar' : ''"
        >
          <div style="font-size: 15px">
            {{
              isParticipant
                ? participant.firstName + " " + participant.lastName
                : user360AppraisalData.user.firstName +
                  " " +
                  user360AppraisalData.user.lastName
            }}
          </div>
          <div
            v-if="!isParticipant && !isAll360Card"
            style="display: flex; justify-content: center"
          >
            <q-circular-progress
              :value="user360AppraisalData.progressBarValue"
              size="35px"
              :thickness="0.5"
              font-size="35px"
              track-color="warning"
              class="q-ma-md progressCircle"
              style="margin: 0px"
            />
          </div>
        </div>
        <div class="row" v-if="!isParticipant">
          <div
            v-if="user360AppraisalData.appraisal.dates.lastAppraisalDate"
            class="col-6 fs--10 text-center"
          >
            <b>Last Appraisal Date</b><br />
            {{
              convertDate(
                user360AppraisalData.appraisal.dates.lastAppraisalDate,
              )
            }}
          </div>
          <div
            class="fs--10 text-center"
            :class="
              user360AppraisalData.appraisal.dates.lastAppraisalDate
                ? 'col-6'
                : 'col-12'
            "
          >
            <b>Current Appraisal Date</b><br />
            {{
              convertDate(
                user360AppraisalData.appraisal.dates.currentAppraisalDate,
              )
            }}
          </div>
        </div>
      </div>
      <q-separator light inset class="q-mt-md q-mb-sm" />
      <div
        class="row"
        v-if="isParticipant"
        style="display: flex; justify-content: center"
      >
        <div class="col-6 fs--12 text-center q-mx-md q-mb-sm">
          <b>Status : </b
          >{{ participant.status == "done" ? "Done" : "In Progress" }}
        </div>
      </div>

      <div
        v-if="
          !isParticipant &&
          (user360AppraisalData.appraisal.supervisor ||
            user360AppraisalData.appraisal.reviewer)
        "
        class="fs--10 text-left q-pb-sm"
        style="padding-left: 16px; padding-right: 8px; min-height: 77px"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
          class="q-my-sm"
        >
          <div v-if="user360AppraisalData.appraisal.supervisor">
            <b>Lead:</b>
            {{ user360AppraisalData.appraisal.supervisor.firstName }}
            {{ user360AppraisalData.appraisal.supervisor.lastName }}
          </div>
        </div>
        <div v-if="isAll360Card" class="q-my-sm text-capitalize">
          <b>Number of participants:</b>
          {{ userAppraisalData.participants.length }}
        </div>
        <div
          v-if="userAppraisalData.appraisal.dates.adjustedAppraisalDate"
          class="q-my-sm"
        >
          <b>Adjusted Appraisal Date:</b>
          {{
            convertDate(userAppraisalData.appraisal.dates.adjustedAppraisalDate)
          }}
        </div>
        <div v-if="isAll360Card" class="q-my-sm text-capitalize">
          <b>360 completed Date:</b>
          {{ convertDate(userAppraisalData.completedDate) }}
        </div>
      </div>
    </div>

    <q-separator
      v-if="isParticipant || isAll360Card"
      light
      inset
      class="q-px-sm"
      :style="!isParticipant ? { marginTop: '-6px' } : ''"
    />
    <div class="flex flex-center">
      <q-btn
        color="primary"
        v-if="isParticipant && !isAll360Card"
        flat
        class="fs--14 q-ml-md"
        @click="openFeedbackForm"
        data
        id="360participantscards-viewbutton"
      >
        View Form
      </q-btn>
    </div>
    <div class="row col-12 q-py-sm" v-if="isAll360Card">
      <q-btn
        color="primary"
        flat
        class="fs--12 col-12 col-5"
        @click="openView360Form"
        data
        id="all360appraisalcards-view360button"
      >
        View 360
      </q-btn>
    </div>
  </q-card>

  <q-dialog
    v-model="view360Form"
    style="width: 100%"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card
      class="dialogWidth justify-center"
      style="width: 1200px; height: 350px; overflow: hidden"
    >
      <q-card-section
        class="shadow-3 justify-center"
        style="
          position: fixed; /* text-align: center; */
          color: red;
          z-index: 99;
          width: 1200px;
          background-color: #ffffff;
          margin-top: 0px;
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
        "
      >
        <div class="">
          <div class="text-h6 row-md-12 text-center" data id="user360formpopup">
            {{
              user360AppraisalData.user.firstName +
              " " +
              user360AppraisalData.user.lastName
            }}
            's 360 Form
          </div>
          <div class="q-gutter-xs" style="margin-top: -50px">
            <q-card-actions class="justify-end" style="margin-bottom: -10px">
              <q-btn
                flat
                label="Close"
                color="red"
                @click="closeDialog()"
                data
                id="user360formpopup-closebutton"
              />
            </q-card-actions>
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="q-pa-md"
        style="margin-top: 75px; overflow-y: auto"
      >
        <PrevFeedbackTable
          :openPrevForm="openPrevForm"
          :tableData="displayPrevTableData"
          :categoryData="displayCategoryData"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
  <Participant360FeedbackForm
    v-if="!view360Form"
    :model="feedbackForm"
    @close="closeFeedBackForm"
    :participant="participant"
    :user360AppraisalData="userInitiate360Data"
  />
</template>

<script>
import * as functions from "../../services/functions";
import * as appraisalsService from "../../services/appraisals.service";
import Participant360FeedbackForm from "./360ParticipantFeedbackForm.vue";
import PrevFeedbackTable from "./360PrevTable.vue";

export default {
  components: { Participant360FeedbackForm, PrevFeedbackTable },
  data() {
    return {
      openPrevForm: false,
      displayPrevTableData: [],
      displayCategoryData: [],
      user360AppraisalData: [],
      Reviewer: {},
      participantsFeedbackStatus: "In progress",
      feedbackForm: false,
      view360Form: false,
      openPrevForm: false,
    };
  },
  props: {
    userAppraisalData: {
      default: {},
    },
    tab: {
      default: "",
    },
    isParticipant: {
      default: false,
    },
    participant: {
      default: {},
    },
    userInitiate360Data: {
      default: {},
    },
    isAll360Card: {
      default: false,
    },
  },
  watch: {
    userAppraisalData: {
      immediate: true,
      handler: function (val) {
        this.user360AppraisalData = [];
        this.user360AppraisalData = val;
        this.Reviewer = this.user360AppraisalData.status;
      },
      deep: true,
    },
    tab: {
      immediate: true,
      handler: function (val) {
        this.tabValue = val;
      },
      deep: true,
    },
    isAll360Card: function (newVal) {
      this.isAll360Card = newVal ? true : false;
    },
  },
  methods: {
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    loadParticipantsCard() {
      this.isLoading = true
    try {
      if (!this.isParticipant)
        this.$emit("loadParticipants", this.user360AppraisalData);
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
      
    },
    openFeedbackForm() {
      this.feedbackForm = true;
    },
    closeFeedBackForm(data) {
      this.feedbackForm = false;
      this.$emit("reloadAppraisal", data);
    },
    openView360Form() {
      if (this.isAll360Card) {
        this.view360Form = true;
        this.get360FeedbackSummaryOfUser();
      }
    },
    async get360FeedbackSummaryOfUser() {
      const res = await appraisalsService.get360FeedbackSummaryOfUser({
        appraisalId: this.userAppraisalData.appraisal._id,
        userId: this.userAppraisalData.user._id,
      });
      this.displayPrevTableData = res.data;
      this.displayCategoryData = [];
      res.data[res.data.length - 1]?.categoryData?.forEach((element) => {
        this.displayCategoryData.push({ _id: element });
      });
      this.openPrevForm = true;
    },
    closeDialog() {
      this.view360Form = false;
      this.openPrevForm = false;
    },
  },
};
</script>

<style scoped>
.alignNameAndbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.progressCircle {
  color: #93be3b;
}
.dialogWidth {
  max-width: 1200px !important;
}
.setTableWidth {
  height: 320px !important;
  overflow-y: auto;
}
</style>
