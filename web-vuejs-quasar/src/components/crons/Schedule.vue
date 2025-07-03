<template>
  <div>
    <q-dialog v-model="layoutVal" persistent>
      <q-card :style="!descLayout ? 'min-width: 80vw;' : 'min-width: 40vw;'">
        <q-card-section>
          <div class="text-h6 text-center q-px-sm q-pb-md">
            {{
              descLayout
                ? "Edit Description"
                : reschedule
                ? "Reschedule Cron"
                : "Schedule Cron"
            }}
          </div>
          <div class="row">
            <div :class="descLayout ? 'col-12' : 'col-6'">
              <q-input
                readonly
                outlined
                v-model="cronName"
                class="text-capitalize q-ma-sm"
                label="Cron Name"
              />
              <q-select
                v-if="!descLayout"
                outlined
                v-model="recurrence"
                :options="recurrenceOptions"
                label="Recurrence"
                class="q-ma-sm"
              />
              <p class="q-ma-sm" v-if="emptyRecurrence" style="color: red">
                Please select recurrence.
              </p>
              <q-input
                v-model="description"
                type="textarea"
                label="Description"
                outlined
                class="q-ma-sm"
              />
              <p class="q-ma-sm" v-if="emptyDescp" style="color: red">
                Description should not be empty.
              </p>
            </div>
            <div v-if="!descLayout" class="col-6">
              <!-- <q-select outlined multiple v-model="months" :options="monthOptions" class="q-ma-sm" label="Select Months"/> -->
              <div>
                <div v-if="recurrence == 'Yearly'" class="q-ma-sm">
                  <span class="row text-weight-medium">Months: </span>
                  <q-checkbox
                    style="width: 65px"
                    v-for="(month, index) in monthOptions"
                    v-model="monthSelected"
                    :val="index + 1"
                    :label="month"
                  />
                </div>

                <div
                  v-if="recurrence == 'Monthly' || recurrence == 'Yearly'"
                  class="q-ma-sm"
                >
                  <span class="row text-weight-medium">Dates: </span>
                  <q-checkbox
                    style="width: 50px"
                    v-for="day in dates"
                    v-model="dateSelected"
                    :val="day"
                    :label="String(day)"
                  />
                </div>
                <div v-if="recurrence == 'Weekly'" class="q-ma-sm">
                  <span class="row text-weight-medium">Days of Week: </span>
                  <q-checkbox
                    style="width: 65px"
                    v-for="day in days"
                    v-model="daysSelected"
                    :val="day"
                    :label="day"
                  />
                </div>
                <div v-if="recurrence != null" class="row q-ma-sm">
                  <div class="flex justify-center relative-position">
                    <q-input
                      v-model="time"
                      outlined
                      label="Time"
                      placeholder="hh:mm"
                      mask="##:##"
                      class="time-input"
                      :rules="[validateTime]"
                      stack-label
                    >
                    </q-input>
                    <q-select
                      v-model="meridiem"
                      :options="[meridiemStauts.AM, meridiemStauts.PM]"
                      color="primary"
                      borderless
                      class="meridiem-select"
                    />
                  </div>
                  <p
                    class="q-ma-sm"
                    v-if="yearlyRecurrenceValidation"
                    style="color: red"
                  >
                    Months, Dates and Time field should not be empty for yearly
                    recurrence.
                  </p>
                  <p
                    class="q-ma-sm"
                    v-if="monthlyRecurrenceValidation"
                    style="color: red"
                  >
                    Dates and Time field should not be empty for monthly
                    recurrence.
                  </p>
                  <p
                    class="q-ma-sm"
                    v-if="weeklyRecurrenceValidation"
                    style="color: red"
                  >
                    Days and Time field should not be empty for weekly
                    recurrence.
                  </p>
                  <p
                    class="q-ma-sm"
                    v-if="dailyRecurrenceValidation"
                    style="color: red"
                  >
                    Time field should not be empty for daily recurrence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="row justify-end q-pr-xl q-pb-lg">
          <q-btn color="negative" flat label="Cancel" @click="close" />
          <q-btn
            v-if="descLayout"
            color="primary"
            flat
            label="Submit"
            @click="updateDescription"
          />
          <q-btn
            v-else
            color="primary"
            flat
            label="Submit"
            :disable="timeValidation"
            @click="submit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  scheduleCron,
  rescheduleCron,
  updateDescription,
} from "src/services/cron.service";
import { TimeValidations, MeridiemStauts } from "../../constants/cron";

export default {
  props: ["cronData", "layout", "reschedule", "updateDesc"],
  components: {},
  data() {
    return {
      prevRecurrence: "",
      layoutVal: false,
      descLayout: false,
      recurrenceOptions: ["Daily", "Weekly", "Monthly", "Yearly"],
      monthOptions: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      dates: [],
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      cronName: null,
      description: null,
      recurrence: null,
      time: null,
      emptyRecurrence: false,
      yearlyRecurrenceValidation: false,
      monthlyRecurrenceValidation: false,
      weeklyRecurrenceValidation: false,
      dailyRecurrenceValidation: false,
      emptyDescp: false,
      meridiem: "",
      timeValidation: false,
      meridiemStauts: MeridiemStauts,
    };
  },
  setup() {
    const monthSelected = ref([]);
    const dateSelected = ref([]);
    const daysSelected = ref([]);
    return {
      monthSelected,
      dateSelected,
      daysSelected,
    };
  },
  beforeMount() {
    this.dates = [];
    for (let i = 1; i <= 31; i++) {
      this.dates.push(i);
    }
  },
  methods: {
    close() {
      (this.emptyRecurrence = false),
        (this.yearlyRecurrenceValidation = false),
        (this.monthlyRecurrenceValidation = false),
        (this.weeklyRecurrenceValidation = false),
        (this.dailyRecurrenceValidation = false),
        (this.emptyDescp = false),
        (this.monthSelected = []);
      this.prevRecurrence = "";
      this.dateSelected = [];
      this.daysSelected = [];
      this.cronName = null;
      this.recurrence = null;
      this.time = null;
      this.description = null;
      this.timeValidation = false;
      this.$emit("close");
    },
    closeOnRecurrenceChange() {
      this.monthSelected = [];
      this.dateSelected = [];
      this.daysSelected = [];
      this.time = null;
    },
    checkAllValidation() {
      if (this.recurrence == null) {
        this.emptyRecurrence = true;
        return false;
      } else if (this.recurrence == "Yearly") {
        if (
          this.monthSelected.length == 0 ||
          this.dateSelected.length == 0 ||
          this.time == null ||
          this.time == ""
        ) {
          this.yearlyRecurrenceValidation = true;
          return false;
        }
      } else if (this.recurrence == "Monthly") {
        if (
          this.dateSelected.length == 0 ||
          this.time == null ||
          this.time == ""
        ) {
          this.monthlyRecurrenceValidation = true;
          return false;
        }
      } else if (this.recurrence == "Weekly") {
        if (
          this.daysSelected.length == 0 ||
          this.time == null ||
          this.time == ""
        ) {
          this.weeklyRecurrenceValidation = true;
          return false;
        }
      } else if (this.recurrence == "Daily") {
        if (this.time == null || this.time == "") {
          this.dailyRecurrenceValidation = true;
          return false;
        }
      }

      if (this.description == null || this.description.length == 0) {
        this.emptyDescp = true;
        return false;
      }

      return true;
    },
    getScheduleString() {
      const scheduleArray = [];

      if (this.time != null) {
        const timeArray = this.time.split(":");
        let hours = parseInt(timeArray[0], 10);
        let minutes = timeArray[1];
        if (this.meridiem == this.meridiemStauts.PM && hours != 12) {
          hours += 12;
        } else if (this.meridiem == this.meridiemStauts.AM && hours == 12) {
          hours = 0;
        }
        scheduleArray.push(minutes.toString().padStart(2, "0"));
        scheduleArray.push(hours.toString().padStart(2, "0"));
      }

      if (this.dateSelected.length == 0) {
        scheduleArray.push("*");
      } else {
        scheduleArray.push(this.dateSelected.join(","));
      }

      if (this.monthSelected.length == 0) {
        scheduleArray.push("*");
      } else {
        scheduleArray.push(this.monthSelected.join(","));
      }

      if (this.daysSelected.length == 0) {
        scheduleArray.push("*");
      } else {
        scheduleArray.push(this.daysSelected.join(","));
      }

      return scheduleArray.join(" ");
    },
    async submit() {
      if (this.checkAllValidation()) {
        this.$q.loading.show();
        try {
          if (this.reschedule) {
            await rescheduleCron({
              cronName: this.cronName.replaceAll(" ", "-"),
              schedule: this.getScheduleString(),
              description: this.description,
              recurrence: this.recurrence,
            });
          } else {
            await scheduleCron({
              cronName: this.cronName.replaceAll(" ", "-"),
              description: this.description,
              schedule: this.getScheduleString(),
              recurrence: this.recurrence,
            });
          }
        } catch (error) {
          this.$emit("handleError", error);
        }
        this.close();
        this.$q.loading.hide();
      }
    },
    async updateDescription() {
      this.$q.loading.show();
      await updateDescription({
        cronName: this.cronName.replaceAll(" ", "-"),
        description: this.description,
      });
      this.close();
      this.$q.loading.hide();
    },
    validateTime(value) {
      if (!value) return true;
      const [hh, mm] = value.split(":");
      if (hh == "00") {
        this.timeValidation = true;
        return TimeValidations.HOURS_MORE;
      } else if (hh > 12) {
        this.timeValidation = true;
        return TimeValidations.HOURS_LESS;
      } else if (mm > 59) {
        this.timeValidation = true;
        return TimeValidations.MINUTES_LESS;
      } else {
        this.timeValidation = false;
        return true;
      }
    },
    setTimeFormat(val) {
      const scheduleArray = val.schedule.split(" ");
      const hours = parseInt(scheduleArray[1], 10);
      const minutes = scheduleArray[0].toString().padStart(2, "0");
      let meridiem = this.meridiemStauts.AM;
      let formattedHours = hours;

      if (hours >= 12) {
        meridiem = this.meridiemStauts.PM;
        formattedHours = hours > 12 ? hours - 12 : 12;
      } else if (hours === 0) {
        formattedHours = 12;
      }
      this.time = formattedHours.toString().padStart(2, "0") + ":" + minutes;
      this.meridiem = meridiem;
    },
  },
  watch: {
    cronData: {
      handler: function (val) {
        this.recurrence = val.recurrence;
        this.prevRecurrence = this.recurrence;
        this.cronName = val.name.replaceAll("-", " ");
        this.description = val.description;

        if (this.reschedule) {
          const scheduleArray = val.schedule.split(" ");
          this.setTimeFormat(val);
          this.dateSelected =
            scheduleArray[2] != "*"
              ? ref(scheduleArray[2].split(",").map((value) => Number(value)))
              : ref([]);
          this.monthSelected =
            scheduleArray[3] != "*"
              ? ref(scheduleArray[3].split(",").map((value) => Number(value)))
              : ref([]);
          this.daysSelected =
            scheduleArray[4] != "*"
              ? ref(scheduleArray[4].split(","))
              : ref([]);
        }
      },
      deep: true,
    },
    layout(val) {
      this.layoutVal = val;
    },
    updateDesc(val) {
      this.descLayout = val;
    },
    recurrence: function (newVal) {
      if (this.prevRecurrence != newVal) {
        if (this.emptyRecurrence && newVal != null) {
          this.emptyRecurrence = false;
        } else if (
          this.yearlyRecurrenceValidation == true &&
          newVal != "Yearly"
        ) {
          this.yearlyRecurrenceValidation = false;
          this.closeOnRecurrenceChange();
        } else if (
          this.monthlyRecurrenceValidation == true &&
          newVal != "Monthly"
        ) {
          this.monthlyRecurrenceValidation = false;
          this.closeOnRecurrenceChange();
        } else if (
          this.weeklyRecurrenceValidation == true &&
          newVal != "Weekly"
        ) {
          this.weeklyRecurrenceValidation = false;
          this.closeOnRecurrenceChange();
        } else if (
          this.dailyRecurrenceValidation == true &&
          newVal != "daily"
        ) {
          this.dailyRecurrenceValidation = false;
          this.closeOnRecurrenceChange();
        } else {
          this.closeOnRecurrenceChange();
        }
      }
    },
    monthSelected: function (val) {
      if (
        this.recurrence == "Yearly" &&
        this.dateSelected.length > 0 &&
        (this.time != null || this.time != "") &&
        val
      ) {
        this.yearlyRecurrenceValidation = false;
      }
    },
    dateSelected: function (val) {
      if (
        this.recurrence == "Yearly" &&
        this.monthSelected.length > 0 &&
        (this.time != null || this.time != "") &&
        val
      ) {
        this.yearlyRecurrenceValidation = false;
      } else if (
        this.recurrence == "Monthly" &&
        (this.time != null || this.time != "") &&
        val
      ) {
        this.monthlyRecurrenceValidation = false;
      }
    },
    daysSelected: function (val) {
      if ((this.time != null || this.time != "") && val) {
        this.weeklyRecurrenceValidation = false;
      }
    },
    time: function (val) {
      if (
        this.recurrence == "Yearly" &&
        this.dateSelected.length > 0 &&
        this.monthSelected.length > 0 &&
        val
      ) {
        this.yearlyRecurrenceValidation = false;
      } else if (
        this.recurrence == "Monthly" &&
        this.dateSelected.length > 0 &&
        val
      ) {
        this.monthlyRecurrenceValidation = false;
      } else if (
        this.recurrence == "Weekly" &&
        this.daysSelected.length > 0 &&
        val
      ) {
        this.weeklyRecurrenceValidation = false;
      } else if (this.recurrence == "Daily" && val) {
        this.dailyRecurrenceValidation = false;
      }
    },
    description: function (val) {
      if (this.emptyDescp == true && (val != "" || val != null)) {
        this.emptyDescp = false;
      }
    },
  },
};
</script>

<style lang="sass">
[aria-label="Description"]
    height: 183px
.meridiem-select
  width: 48px
  position: absolute
  margin: unset
  transform: translate(28px, 7px)
  border:unset
.time-input
  width: 130px
  .q-field__append
    display: none
</style>
