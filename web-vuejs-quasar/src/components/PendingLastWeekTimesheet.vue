<template>
  <div class="q-pa-md PendingTable">
    <q-card
      class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm border-warning"
      style="width: 200px; min-height: 190px"
      data-id="pendingsheets-card"
    >
      <div class="q-pt-md">
        <div
          class="text-subtitle2 text-center"
          style="margin-top: -7px"
          data-id="pedingsheet-username"
        >
          <q-checkbox
            v-model="checkbox"
            class="q-ml-auto"
            color="warning"
            @input="onSelect"
            data-id="pendingsheets-checkbox"
          />
          {{ timesheet.username }}
        </div>
      </div>
      <div class="q-mx-sm custom_timesheet_table">
        <q-table
          style="height: 112px"
          dense
          flat
          hide-bottom
          :rows="pendingDates"
          data-id="pendingsheets-dates"
        >
        </q-table>
      </div>
      <q-card-actions class="justify-around">
        <q-btn
          flat
          @click="sentSingle"
          class="fs--12"
          color="warning"
          data-id="pendingsheets-notify"
        >
          Notify
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    timesheet: {
      default: {},
    },
    makeAllTrue: {
      default: false,
    },
    index: {
      default: null,
    },
    uncheckAll: {
      default: true,
    },
  },
  watch: {
    timesheet: function (val) {
      this.pendingDates = [];
      val.pendingDates.forEach((data) => {
        this.pendingDates.push({
          pending: data,
        });
      });
    },
    uncheckAll: function (val) {
      if (!val) {
        this.checkbox = false;
      } else {
        this.uncheckAll = true;
      }
    },
    makeAllTrue: function (val) {
      if (val) {
        if (!this.checkbox) {
          this.checkbox = true;
          this.onSelect();
        }
      } else {
        this.checkbox = false;
        this.onSelect();
      }
    },
  },
  data() {
    return {
      pendingDates: [],
      timesheetTableData: [],
      checkbox: false,
    };
  },
  methods: {
    onSelect() {
      if (this.checkbox) {
        this.$emit("sendNotification", "add", this.timesheet);
      } else {
        this.$emit("sendNotification", "remove", this.timesheet);
      }
    },
    sentSingle() {
      this.$emit("notifyToSingle", "add", this.timesheet);
    },
  },
  mounted() {
    this.checkbox = false;
    this.pendingDates = [];
    this.timesheet?.pendingDates?.forEach((data) => {
      this.pendingDates.push({
        pending: data,
      });
    });
  },
};
</script>
