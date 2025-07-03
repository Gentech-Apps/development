<template>
  <div style="width: 90vw; height: 88vh">
    <div class="row" style="height: 60px">
      <div></div>
      <div class="oldToggledButton q-ml-auto text-primary">
        <q-toggle
          v-model="skypeNotificationEnabled"
          :class="skypeNotificationEnabled ? 'text-green' : 'text-red'"
          @update:model-value="updateSkypeNotification"
        />
        <span
          style="padding-top: 0.7%; font-weight: 500; text-transform: uppercase"
        >
          Skype Notification
        </span>
      </div>
    </div>
    <div class="row">
      <q-table
        class="tableScroller"
        title="Crons"
        :rows="sortedRows"
        :columns="columns"
        row-key="name"
        hide-bottom
        :rows-per-page-options="[0]"
        style="height: 78vh"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'Actions'">
                <q-btn
                  v-if="props.row.status != 'scheduled'"
                  @click="scheduleCron(getCronData(props.row))"
                  icon="schedule"
                  flat
                  round
                  class="q-mx-xs text-primary"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Schedule</q-tooltip
                  >
                </q-btn>
                <q-btn
                  v-if="props.row.status == 'scheduled'"
                  @click="rescheduleCron(getCronData(props.row))"
                  icon="update"
                  flat
                  round
                  class="q-mx-xs text-primary"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Reschedule</q-tooltip
                  >
                </q-btn>
                <q-btn
                  v-if="props.row.status == 'stopped'"
                  @click="
                    updateCronStatus({
                      status: 'scheduled',
                      cronName: props.row.name,
                    })
                  "
                  flat
                  round
                  icon="play_circle"
                  class="q-mx-xs text-primary"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Reinstate</q-tooltip
                  >
                </q-btn>
                <q-btn
                  v-if="props.row.status == 'scheduled'"
                  @click="
                    updateCronStatus({
                      status: 'stopped',
                      cronName: props.row.name,
                    })
                  "
                  flat
                  round
                  icon="stop_circle"
                  class="q-mx-xs text-negative"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Suspend</q-tooltip
                  >
                </q-btn>
                <q-btn
                  v-if="
                    props.row.status == 'scheduled' ||
                    props.row.status == 'stopped'
                  "
                  @click="updateDescription(getCronData(props.row))"
                  icon="edit_note"
                  flat
                  round
                  class="q-mx-xs text-primary"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Edit Description</q-tooltip
                  >
                </q-btn>
                <q-btn
                  @click="instantRun({ cronName: props.row.name })"
                  icon="published_with_changes"
                  flat
                  round
                  class="q-mx-xs text-primary"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                    >Run Now</q-tooltip
                  >
                </q-btn>
              </div>
              <div
                v-else-if="col.name == 'Description'"
                class="description-content"
              >
                {{ col.value }}
              </div>
              <div
                v-else
                :class="col.name == 'Status' ? 'text-capitalize' : ''"
              >
                {{ col.value }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
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
    <Schedule
      :cronData="cronData"
      :layout="scheduleLayout"
      @handleError="handleError"
      @close="closeSchedulePopup"
      :reschedule="reschedule"
      :updateDesc="descLayout"
    />
  </div>
  <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
</template>

<script>
import moment from "moment";
import {
  getAllCrons,
  instantRunCron,
  updateCronStatus,
  getSkypeNotification,
  updateSkypeNotification,
} from "src/services/cron.service";
import Schedule from "../components/crons/Schedule.vue";
import cronstrue from "cronstrue";
import Notify from "../components/Notify.vue";

export default {
  components: {
    Notify,
    Schedule,
  },
  data() {
    return {
      columns: [
        {
          name: "name",
          required: true,
          label: "Cron Name",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "Description",
          align: "left",
          label: "Description",
          field: "description",
        },
        {
          name: "Schedule",
          label: "Schedule",
          field: "schedule",
          align: "left",
        },
        {
          name: "Last Run At",
          label: "Last Run At",
          align: "left",
          field: "lastRunAt",
        },
        {
          name: "Next Run At",
          label: "Next Run At",
          align: "left",
          field: "nextExecutionAt",
        },
        {
          name: "Last Execution Status",
          label: "Last Execution Status",
          align: "left",
          field: "lastExecutionStatus",
        },
        { name: "Status", label: "Status", align: "left", field: "status" },
        { name: "Actions", label: "Actions", align: "left" },
      ],
      rows: [],
      descLayout: false,
      scheduleLayout: false,
      reschedule: false,
      cronData: null,
      errorLayout: false,
      errorMsg: "",
      allCronsData: null,
      skypeNotificationEnabled: false,
      successMsg: "",
      sortState: {
        sortBy: "name",
        descending: false,
      },
    };
  },
  beforeMount() {
    this.getAllCronDetails();
    this.getSkypeNotification();
  },
  computed: {
    sortedRows() {
      return [...this.rows].sort((a, b) => {
        const sortValue = a[this.sortState.sortBy]?.localeCompare(
          b[this.sortState.sortBy],
        );
        return this.sortState.descending ? -sortValue : sortValue;
      });
    },
  },
  methods: {
    clearSuccessMsg() {
      this.successMsg = "";
    },
    handleError(error) {
      this.errorLayout = true;
      this.errorMsg = error;
    },
    closeSchedulePopup() {
      this.scheduleLayout = false;
      this.reschedule = false;
      this.descLayout = false;
      this.getAllCronDetails();
      this.getSkypeNotification();
    },
    getFormattedSchedule(schedule) {
      return schedule ? cronstrue.toString(schedule) : "";
    },
    scheduleCron(data) {
      this.cronData = data;
      this.reschedule = false;
      this.scheduleLayout = true;
    },
    rescheduleCron(data) {
      this.cronData = data;
      this.reschedule = true;
      this.scheduleLayout = true;
    },
    async updateCronStatus({ status, cronName }) {
      this.$q.loading.show();
      await updateCronStatus({
        cronName: cronName.replaceAll(" ", "-"),
        status,
      });
      this.getAllCronDetails();
      this.$q.loading.hide();
    },
    updateDescription(data) {
      this.cronData = data;
      this.scheduleLayout = true;
      this.reschedule = false;
      this.descLayout = true;
    },
    async getSkypeNotification() {
      await getSkypeNotification().then((res) => {
        this.skypeNotificationEnabled = res.data.isEnabled;
      });
    },
    async updateSkypeNotification() {
      this.$q.loading.show();
      try {
        const res = await updateSkypeNotification({
          isEnabled: this.skypeNotificationEnabled,
        });
        if (res.data.ok) {
          this.successMsg = res.data.message;
        } else {
          this.handleError(res.data.message);
        }
      } catch (e) {
        console.error(e);
      }
      this.$q.loading.hide();
    },
    getAllCronDetails() {
      getAllCrons().then((res) => {
        this.allCronsData = res.data;
        this.rows = res.data?.map((cron) => {
          return {
            name: cron.name?.replaceAll("-", " "),
            recurrence: cron?.recurrence,
            schedule: this.getFormattedSchedule(cron.schedule),
            lastRunAt: cron.lastRunAt
              ? moment(new Date(cron.lastRunAt)).format("LLL")
              : "",
            nextExecutionAt: cron.nextExecutionAt
              ? moment(new Date(cron.nextExecutionAt)).format("LLL")
              : "",
            status: cron.status ?? "",
            description: cron.description ?? "",
            lastExecutionStatus:
              cron.lastExecutionStatus == true
                ? "Success"
                : cron.lastExecutionStatus == false
                ? "Failed"
                : "",
          };
        });
      });
    },
    getCronData(data) {
      return this.allCronsData?.find(
        (cron) => cron.name.replaceAll("-", " ") == data.name,
      );
    },
    async instantRun({ cronName }) {
      this.$q.loading.show();
      await instantRunCron({ cronName: cronName.replaceAll(" ", "-") });
      this.getAllCronDetails();
      this.$q.loading.hide();
    },
  },
};
</script>

<style lang="sass">
::-webkit-scrollbar
    width: 7px !important
    height: 7px !important
.tableScroller
    width: 90vw
    height: 70vh
    thead tr:first-child th:first-child
        position: sticky
        z-index: 4
        left: 0px
    tbody tr td:first-child
        position: sticky
        z-index: 3
        left: 0px
        background-color : white
    tr th
        font-weight : bold
        font-size : 14px
    td:first-child
        text-transform : capitalize
    .description-content
        width: 250px
        text-wrap: auto
        text-align: left
</style>
