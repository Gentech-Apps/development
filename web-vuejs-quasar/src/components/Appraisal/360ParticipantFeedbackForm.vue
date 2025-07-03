<template>
  <div>
    <q-dialog
      v-model="layoutValue"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        class="q-pb-sm"
        id="scrolled"
        @scroll="scrolled('scrolled')"
        style="width: 100%; min-height: 100%; min-width: 100%"
      >
        <q-form @submit="onSubmit()">
          <q-card-section
            class="shadow-3 q-py-xs"
            style="
              color: red;
              width: -webkit-fill-available;
              background-color: #ffffff;
              margin-top: 0px;
              box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
              padding-bottom: 10px !important;
            "
          >
            <div class="row justify-between">
              <div class="row" style="gap: 40px">
                <div class="q-mr-md">
                  <q-input
                    dense
                    v-model="getParticipantName"
                    :label="'Participant Name'"
                    lazy-rules
                    readonly
                    :borderless="true"
                  />
                </div>
              </div>
              <div class="text-h6 row-md-12 text-center q-mt-xs">
                {{
                  user360AppraisalData.user.firstName +
                  " " +
                  user360AppraisalData.user.lastName +
                  "'s 360 Feedback Form"
                }}
              </div>
              <div class="q-gutter-xs" style="margin-bottom: -7px">
                <q-card-actions class="justify-end">
                  <q-btn
                    v-if="statusValue != feedbackStatus.SUBMITTED"
                    :disable="draftbtnStatus"
                    flat
                    label="Draft"
                    color="warning"
                    @click="saveAsDraft()"
                    data-id="360feedback-draftbutton"
                  />
                  <q-btn
                    v-if="statusValue != feedbackStatus.SUBMITTED"
                    flat
                    label="Submit"
                    type="submit"
                    color="primary"
                    data-id="360feedback-submitbutton"
                  />
                  <q-btn
                    v-if="statusValue == feedbackStatus.SUBMITTED"
                    flat
                    label="Reopen"
                    @click="onReopen"
                    color="primary"
                    data-id="360feedback-reopenbutton"
                  />
                  <q-btn
                    flat
                    label="Close"
                    color="red"
                    @click="closeDialog()"
                    data-id="360feedback-closebutton"
                  />
                </q-card-actions>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="prev-table-container">
              <div
                class="q-mx-md prevTablePosition"
                style="
                  position: sticky;
                  top: 0px;
                  z-index: 11;
                  border-collapse: collapse;
                  margin-left: 14px !important;
                  margin-right: 14px !important;
                "
              >
                <q-expansion-item
                  expand-separator
                  class="text-center rounded-borders"
                  header-class="text-bold"
                  label="Feedback Preview Table"
                  :model-value="expanded"
                  @show="expanded = true"
                  @hide="expanded = false"
                  style="background: lightgrey"
                  dense
                >
                  <q-card>
                    <q-card-section style="padding: 12px 0px !important">
                      <PrevTable
                        :openPrevForm="openPrevForm"
                        :tableData="displayPrevTableData"
                        :categoryData="user360AppraisalData.activeParameters"
                        :reopen="formReopened"
                      />
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </div>
            </div>
            <div
              :class="
                !(displayPrevTableData.length > 1) && expanded
                  ? 'removeTop'
                  : !expanded
                  ? 'addMarginToTop'
                  : 'removeMarginToTop'
              "
              v-if="!view360Form"
            >
              <FormTable
                :openPrevForm="openFeedbackTable"
                :tableData="displayFeeddbackTableData"
                :categoryData="user360AppraisalData.activeParameters"
                :status="getFeedbackStatus"
                :participantName="participantNameForTable"
                @saveFeedbackForm="saveFeedbackForm"
                @draftStatus="handleDraftStatus"
                :expanded="expanded"
              />
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
  <q-dialog
    v-model="confirmSubmit"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-primary text-white">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning" class="text-white" style="font-size: 2rem" />
          {{
            "Are you sure, you want to " +
            (isSubmit ? "submit" : "reopen") +
            " the form?"
          }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          flat
          color="negative"
          label="Cancel"
          @click="confirmSubmit = false"
          data-id="360reopenconfirmation-cancel"
        />
        <q-btn
          flat
          color="primary"
          :label="isSubmit ? 'submit' : 'reopen'"
          @click="updateFeedbackStatus()"
          data-id="360reopenconfirmation-reopen"
        />
      </q-card-actions>
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
          <q-icon name="warning" class="text-white" style="font-size: 2rem" />
          Error
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none"> {{ errorMessage }} </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat color="negative" label="OK" @click="errorLayout = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
</template>

<script>
import * as categoryService from "../../services/360Categories.service";
import { QuillEditor } from "@vueup/vue-quill";
import Notify from "../Notify.vue";
import { ref } from "vue";
import PrevTable from "../../components/Appraisal/360PrevTable.vue";
import FormTable from "../../components/Appraisal/360FeedbackFormTable.vue";
import { FeedbackStatus } from "src/constants/feedbackConstants";

export default {
  components: { Notify, QuillEditor, PrevTable, FormTable },
  data() {
    return {
      participantNameForTable: "",
      openFeedbackTable: false,
      displayFeeddbackTableData: [],
      displayPrevTableData: [],
      totalParticipants: 0,
      confirmSubmit: false,
      openPrevForm: false,
      statusValue: "started",
      ratingvalue: "",
      answerValue: "",
      feedbackForm: {
        initiate360Id: "",
        participantId: "",
        status: "",
        participantAnswer: [],
      },
      successMsg: "",
      layoutValue: false,
      ratingOptions: [
        { label: "Good", value: "good", color: "green" },
        { label: "Average", value: "average", color: "warning" },
        { label: "Bad", value: "bad", color: "red" },
        { label: "NA", value: "", color: "grey" },
      ],
      rating: "",
      AppraisalRef: null,
      feedback: [],
      feedbackCompleted: false,
      editorOptions: {
        debug: "error",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "link"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
        placeholder: "Type your text here...",
        theme: "snow",
      },
      expanded: false,
      draftbtnStatus: true,
      isSubmit: false,
      errorMessage: "",
      errorLayout: false,
      feedbackStatus: FeedbackStatus,
      closeFeedBackFormEvent: "closeFeedBackForm",
      formReopened: false,
    };
  },
  props: ["model", "user360AppraisalData", "participant", "view360Form"],
  watch: {
    model: async function (value) {
      this.layoutValue = value;
      this.participantNameForTable =
        this.participant.firstName + " " + this.participant.lastName;
      this.totalParticipants = this.user360AppraisalData?.participants?.length;
      if (value) {
        document.getElementById("main-layout-logo").style.display = "none";
        await this.getFeedBackDataByParticipantId({
          initiate360Id: this.user360AppraisalData._id,
          participantId: this.participant._id,
        });
        await this.getAllFeedbackForUser({
          initiate360Id: this.user360AppraisalData._id,
        });
        if (this.feedbackForm.status == "started") {
          this.displayFeeddbackTableData = this.displayPrevTableData;
          this.openFeedbackTable = true;
        } else {
          this.openFeedbackTable = true;
        }
      }
    },
    user360AppraisalData: function (appraisal360Data) {
      this.renderCategoryData();
    },
    view360Form: function (newVal) {
      if (newVal) {
        this.layoutValue = false;
      }
    },
  },
  methods: {
    handleDraftStatus($event) {
      this.draftbtnStatus = $event;
    },
    async updateFeedbackStatus() {
      if (this.isSubmit) {
        this.feedbackForm.status = FeedbackStatus.SUBMITTED;
        this.feedbackForm.totalParticipants = this.totalParticipants;
      } else {
        this.feedbackForm.status = FeedbackStatus.INPROGRESS;
      }
      await categoryService
        .saveParticipantFeedBack(this.feedbackForm)
        .then((res) => {
          if (res.status == 200) {
            if (this.isSubmit) {
              this.successMsg = "Feedback submitted successfully";
              this.$emit(this.closeFeedBackFormEvent);
              this.closeDialog();
            } else {
              this.getAllFeedbackForUser({
                initiate360Id: this.user360AppraisalData._id,
              }).then(() => (this.formReopened = true));
              this.successMsg = "Feedback reopened successfully";
              this.confirmSubmit = false;
              this.statusValue = FeedbackStatus.INPROGRESS;
            }
          }
        })
        .catch((err) => {
          this.errorMessage =
            "Feedback cannot not be " +
            (this.isSubmit ? "submitted!" : "reopened!");
          this.errorLayout = true;
          this.confirmSubmit = false;
          console.error(err);
        });
    },
    saveFeedbackForm(data) {
      this.feedbackForm.participantAnswer = data;
    },
    closeDialog() {
      document.getElementById("main-layout-logo").style.display = "unset";
      this.confirmSubmit = false;
      this.layoutValue = false;
      this.openPrevForm = false;
      this.openFeedbackTable = false;
      this.expanded = false;
      this.$emit("close", {
        status: this.feedbackForm.status,
        initiate360Id: this.user360AppraisalData._id,
        participantId: this.participant._id,
      });
    },
    AllFieldValidationCheck() {
      var bool = false;
      this.$refs.AppraisalRef.forEach((val) => {
        var data =
          val.modelValue?.label
            ?.toString()
            ?.replace(/(<([^>]+)>)/gi, " ")
            ?.trim() ??
          val.modelValue
            .toString()
            .replace(/(<([^>]+)>)/gi, " ")
            .trim();
        var removespace = data.replace(/&nbsp;/g, " ").trim();
        if ((removespace == "" || removespace == 0) && !bool) {
          val.$el.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
          bool = true;
          val.foused = true;
          val.validate();
        }
      });
    },
    renderCategoryData() {
      this.feedback = [];
      let categoryParameter = { _id: "", name: "", parameters: [] };
      if (this.user360AppraisalData.category.length > 0) {
        this.user360AppraisalData.category.forEach((c) => {
          categoryParameter._id = c._id;
          categoryParameter.name = c.name;
          categoryParameter.feedbackCompleted = false;
          if (c.parameters.length > 0) {
            c.parameters.forEach((p) => {
              categoryParameter.parameters.push({
                _id: p._id,
                name: p.name,
                rating: "",
                comment: "",
              });
            });
          }
          this.feedback.push(categoryParameter);
        });
      }
    },
    updateCommentEditor(evt, index, zIndex, pIndex) {
      if (this.$store.getters.userId == this.user360AppraisalData.user._id) {
        this.feedback[index].parameters[zIndex].comment = evt.target.innerHTML;
      }
    },
    async onSubmit() {
      this.isSubmit = true;
      this.confirmSubmit = true;
    },
    async onReopen() {
      this.isSubmit = false;
      this.confirmSubmit = true;
    },
    async saveAsDraft() {
      this.feedbackForm.status = FeedbackStatus.INPROGRESS;
      const result = categoryService.saveParticipantFeedBack(this.feedbackForm);
      this.closeDialog();
    },
    async getFeedBackDataByParticipantId(data) {
      const result = await categoryService.getFeedBackDataByParticipantId(data);
      const item = result.data;
      for (let index = 0; index < item.participantAnswer.length; index++) {
        let element = item.participantAnswer[index];
        for (
          let index = 0;
          index < element.category.parameters.length;
          index++
        ) {
          let ele = element.category.parameters[index];
          element.parameterAnswers.map((data) => {
            if (String(data.parameter) == String(ele._id)) {
              data.name = ele.name;
            }
          });
        }
      }
      this.feedbackForm.initiate360Id = item.initiate360Id;
      this.feedbackForm.participantId = item.participantId;
      this.feedbackForm.status = item.status;
      this.feedbackForm.participantAnswer = item.participantAnswer;
      this.statusValue = item.status;
      this.feedbackForm.participantName =
        this.participant.firstName + " " + this.participant.lastName;
      this.displayFeeddbackTableData = this.feedbackForm.participantAnswer;
    },
    async getAllFeedbackForUser(data) {
      const result = await categoryService.getAllFeedbackForUser(data);
      let previewTableData = [];
      this.displayFeeddbackTableData.forEach((item) => {
        item.parameterAnswers.forEach((ans) => {
          result?.data.forEach((res) => {
            if (res._id == ans.parameter) previewTableData.push(res);
          });
        });
      });
      this.displayPrevTableData = previewTableData;
      this.openPrevForm = true;
    },
  },
  computed: {
    getParticipantName: function () {
      return this.participant.firstName + " " + this.participant.lastName;
    },
    getClientsName: function () {},
    getFeedbackStatus: function () {
      return this.feedbackForm.status;
    },
  },
  setup() {
    return {
      comment: ref(""),
    };
  },
};
</script>

<style lang="scss">
.box {
  height: 20px;
  width: 30px;
  margin-bottom: 15px;
  border: 1px solid black;
  border-radius: 5px;
  margin-right: 5px;
}
.green {
  background: #4caf4f;
}
.yellow {
  background: #f2c037;
}
.red {
  background: red;
}
.grey {
  background: grey;
}
.pointer-event-none {
  pointer-events: none;
}
.feedbackTable {
  .participant-name {
    z-index: 10 !important;
    border-collapse: collapse;
    padding: 7px !important;
  }
  thead {
    z-index: 10 !important;
  }
}
.removeMarginToTop {
  margin-top: 0px !important;
  .feedbackTable {
    .participant-name {
      top: 48.4% !important;
    }
    thead {
      top: 57.8% !important;
    }
  }
}
.addMarginToTop {
  .feedbackTable {
    .participant-name {
      top: 5% !important;
    }
    thead {
      top: 9.3% !important;
    }
  }
}
.removeTop {
  .feedbackTable {
    .participant-name {
      top: 13.4% !important;
    }
    thead {
      top: 22.8% !important;
    }
  }
}
.setTableWidth {
  height: 221px !important;
}
.prev-table-container {
  width: 100%;
  background-color: white;
}
</style>
