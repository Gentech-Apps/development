<template>
  <div>
    <q-card
      class="leave-card bg-white text-secondary q-ma-sm"
      data-id="birthday-card"
      :class="
        templateDatatoDisplay.isApproved ? 'border-primary' : 'border-warning'
      "
      style="width: 200px; min-height: 110px"
    >
      <div class="q-pt-md">
        <div
          class="text-subtitle2 text-center"
          style="margin-top: -7px"
          data-id="birthdaycard-title"
        >
          {{ capitalizeFirst(templateDatatoDisplay.user.firstName) }}
          {{ capitalizeFirst(templateDatatoDisplay.user.lastName) }}
        </div>
      </div>
      <q-separator light inset class="q-mt-sm" />
      <div
        class="q-px-md fs--12 text-center q-pt-sm"
        data-id="birthdaycard-date"
      >
        <p class="q-mb-none">
          <span class="fs--10"> Birthday Date: </span><br />
          <b>{{ convertDate(templateDatatoDisplay.currentBirthDate) }}</b>
        </p>
      </div>
      <div class="q-px-md fs--12 text-center q-pt-sm">
        <q-btn
          flat
          color="primary"
          class="viewButton"
          label="view"
          @click="openTemplateView()"
          data-id="birthdaycard-view"
        />
      </div>
      <div class="q-px-md fs--12 text-center q-pt-sm"></div>
    </q-card>
    <BirthDayTemplateView
      @onApproved="onApproved"
      :layout="openTemplateViewModel"
      @close="close"
      :data="templateDatatoDisplay"
    ></BirthDayTemplateView>
  </div>
</template>

<script>
import * as functions from "../services/functions";
import BirthDayTemplateView from "./BirthdayTemplates/BirthdayTemplateViewModel.vue";

export default {
  components: {
    BirthDayTemplateView,
  },
  data() {
    return {
      templateDatatoDisplay: {},
      openTemplateViewModel: false,
      savedTemplateNumberArray: [],
    };
  },
  methods: {
    openTemplateView() {
      this.openTemplateViewModel = true;
    },
    onApproved(message) {
      this.$emit("onApprovedTemplates", message);
    },
    close() {
      this.openTemplateViewModel = false;
      this.$emit("onClosedTemplates");
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
  },
  mounted() {},
  props: ["template"],
  watch: {
    template: {
      immediate: true,
      handler: function (val) {
        this.templateDatatoDisplay = {};
        this.templateDatatoDisplay = val;
      },
      deep: true,
    },
  },
};
</script>

<style>
.leave_table_scroller .q-table {
  table-layout: fixed;
}
.leave_table_scroller .q-table__middle.scroll {
  overflow-x: hidden;
}
.viewButton {
  cursor: pointer;
}
</style>
