<template>
  <q-card
    class="leave-card bg-white text-secondary q-ma-sm border-primary"
    style="width: 200px; min-height: 110px"
  >
    <div class="q-pt-md">
      <div class="text-subtitle2 text-center" style="margin-top: -7px">
        {{ capitalizeFirst(leavesDatatoDisplay.user.firstName) }}
        {{ capitalizeFirst(leavesDatatoDisplay.user.lastName) }}
      </div>
    </div>
    <div class="q-px-md fs--10 text-center">
      <p class="q-mb-none">
        <b>Mentor:</b>
        {{ leavesDatatoDisplay.mentor.firstName }}
        {{ leavesDatatoDisplay.mentor.lastName }}
      </p>
    </div>
    <q-separator light inset class="q-mt-sm" />
    <div class="q-px-md fs--12 text-center q-pt-sm">
      <p class="q-mb-none">
        <span class="fs--10"> Missing Sheet Date: </span><br />
        <b>{{ convertDate(leavesDatatoDisplay.reportDate) }}</b>
      </p>
    </div>
  </q-card>
</template>

<script>
import * as functions from "../../services/functions";

export default {
  components: {},
  data() {
    return {
      leavesDatatoDisplay: [],
    };
  },
  methods: {
    onEdit() {
      this.$emit("editLayout", this.leavesDatatoDisplay);
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    convertToHours(mins) {
      var hours = mins / 60;
      return hours;
    },
    capitalizeFirst: function (val) {
      return functions.capitalizeFirstLetter(val);
    },
  },
  props: {
    eventData: {
      default: {},
    },
  },
  watch: {
    eventData: {
      immediate: true,
      handler: function (val) {
        this.leavesDatatoDisplay = [];
        this.leavesDatatoDisplay = val;
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
</style>
