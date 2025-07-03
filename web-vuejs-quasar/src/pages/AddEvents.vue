<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      class="window-height"
      style="margin-left: -20px; height: 88vh !important"
    >
      <!-- left side tabs -->
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-primary gen_tabs q-pt-xl custom-padding"
        >
          <q-tab
            @click="routeToGetAllEvents"
            name="announcement"
            icon="campaign"
            label="Announcement"
            class="q-mt-md"
            data-id="announcement-tab"
          />
          <q-tab
            @click="routeToGetHolidays"
            name="holidays"
            icon="insert_invitation"
            label="Holidays"
            v-if="
              !this.$store.getters.user.departments?.some(
                (dep) =>
                  dep.name.toLowerCase() === 'admin' ||
                  dep.name?.toLowerCase() === 'human resource',
              ) || this.$store.getters.userType.toLowerCase() === 'admin'
            "
            data-id="holidays-tab"
          />
          <q-tab
            @click="routeToGetMarkedWorkingDays"
            id="working_days"
            name="workingDays"
            label="Working Days"
            icon="calendar_add_on"
            v-if="
              !this.$store.getters.user.departments?.some(
                (dep) =>
                  dep.name.toLowerCase() === 'admin' ||
                  dep.name?.toLowerCase() === 'human resource',
              ) || this.$store.getters.userType.toLowerCase() === 'admin'
            "
            data-id="workingdays-tab"
          />
          <q-tab
            @click="routeToGetCanteenMenu"
            name="canteenMenu"
            label="Food Menu"
            icon="insert_invitation"
            data-id="foodmenu-tab"
          />
          <q-tab
            @click="routeToGetBirthdayTemplates"
            name="birthdayManager"
            label="Birthday Manager"
            icon="cake"
            data-id="birthdaymanager-tab"
          />
        </q-tabs>
      </template>

      <!-- right side main content area -->
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          v-touch-swipe="handler"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="announcement">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Announcement"
                color="primary"
                @click="onApplyLeave"
                class="q-ml-auto"
                data-id="announcement-addannouncementbutton"
              />
              <AddEvent
                :layout="applyLeaveLayout"
                @close="applyLeaveLayout = false"
                @refreshAnnoucements="getAllEvents"
              />
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="nameFilter"
                class="q-px-sm col-4"
                label="Search by Title"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="announcement-searchbytitle"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter"
                :options="statusOption"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="announcement-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
                data-id="announcement-searchbydate"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilter"
                    range
                    data-id="announcement-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="announcementcalender-ok"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
              <div class="denote_color q-mt-sm">
                <ul>
                  <li v-for="data in denoteColors" :key="data">
                    <span
                      class="color_dot"
                      :style="{ backgroundColor: data.color }"
                    ></span>
                    <span> {{ data.text }} </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <Event
                v-for="(event, index) in announcementData"
                :key="index"
                :eventData="event"
                @eventStatus="onStatusChange"
                @updateForm="onUpdateAnnouncement"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="holidays">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Holiday"
                color="primary"
                @click="onApplyLeave"
                class="q-ml-auto"
                data-id="holidays-addholidaybutton"
              />
              <AddHoliday
                :layout="applyLeaveLayout"
                @close="applyLeaveLayout = false"
                @refreshHolidays="getHolidays"
              />
            </div>

            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-input
                outlined
                v-model="holidayNameFilter"
                class="q-px-sm col-4"
                label="Search by Title"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="holidays-searchbytitle"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-input>
              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter"
                :options="statusOption"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="holidays-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
                data-id="holidays-searchbydate"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilter"
                    range
                    data-id="holidays-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="holidayscalender-ok"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
              <div class="denote_color q-mt-sm">
                <ul>
                  <li v-for="data in denoteColors" :key="data">
                    <span
                      class="color_dot"
                      :style="{ backgroundColor: data.color }"
                    ></span>
                    <span> {{ data.text }} </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <Holiday
                v-for="(event, index) in announcementData"
                :key="index"
                :eventData="event"
                @updateForm="onUpdateHolidays"
                @eventStatus="onHolidayStatusChange"
              />
            </div>
          </q-tab-panel>
          <q-tab-panel name="workingDays">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Working Day"
                color="primary"
                @click="onMarkWorkingDay"
                class="q-ml-auto"
                data-id="workingdays-addworkingdaybutton"
              />
              <AddWorkingDay
                :layout="applyLeaveLayout"
                @close="applyLeaveLayout = false"
                @refreshHolidays="getAllWorkingDays"
              />
            </div>

            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <WorkingDays
                v-for="(event, index) in announcementData"
                :key="index"
                :eventData="event"
                @refreshHolidays="getAllWorkingDays"
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="birthdayManager">
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <div class="row" style="width: 100% !important">
                <div
                  class="q-pt-md text-weight-medium text-center"
                  style="color: rgb(242, 192, 55); width: 50% !important"
                >
                  Upcoming Birthdays
                </div>
                <div
                  class="text-primary q-pt-md text-weight-medium text-center"
                  style="width: 50% !important"
                >
                  Approved Templates
                  <div class="oldToggledButton q-ml-auto text-primary">
                    <q-toggle
                      v-model="showOldBirthdays"
                      :class="showOldBirthdays ? 'text-green' : 'text-red'"
                      data-id="oldtemplate-toggle"
                    />
                    <span
                      style="
                        padding-top: 0.7%;
                        font-weight: 500;
                        text-transform: uppercase;
                      "
                    >
                      Old
                    </span>
                  </div>
                </div>
              </div>
              <q-splitter v-model="splitterModelMyLeaves" class="full-width">
                <template v-slot:before>
                  <div
                    class="scroll_birthday leave-separator heightSet"
                    @scroll="scrolled('upcomingBirthdays')"
                    id="upcomingBirthdays"
                  >
                    <BirthDayTemplate
                      v-for="(template, index) in upcomingBirthdays"
                      :key="index"
                      :template="template"
                      @onApprovedTemplates="onApprovedTemplates"
                      @onClosedTemplates="onClosedTemplates"
                    />
                  </div>
                </template>
                <template v-slot:after>
                  <div
                    class="scroll_birthday leave-separator heightSet"
                    @scroll="scrolled('approvedBirthdays')"
                    id="approvedBirthdays"
                  >
                    <BirthDayTemplate
                      v-for="(template, index) in approvedBirthdays"
                      :key="index"
                      :template="template"
                    />
                  </div>
                </template>
              </q-splitter>
            </div>
          </q-tab-panel>

          <q-tab-panel name="canteenMenu">
            <div
              class="q-mb-md justify-between full-width"
              style="display: inline-flex"
            >
              <q-btn
                flat
                label="Add Food Menu"
                color="primary"
                @click="onApplyLeave"
                class="q-ml-auto"
                data-id="foodmenu-addfoodmenubutton"
              />
              <AddCanteenMenu
                :layout="applyLeaveLayout"
                @close="applyLeaveLayout = false"
                @refreshHolidays="getAllCanteenMenus"
                :leavesToDisplay2="leavesToDisplay2"
              />
            </div>
            <div
              class="fit row wrap justify-start items-start content-start full-width"
            >
              <q-select
                outlined
                v-model="nameFilter"
                :options="searchByNameFoodFilterOptions"
                class="q-px-sm col-4"
                label="Search by Name"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="foodmenu-searchbyname"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-select
                outlined
                class="q-px-sm col-4"
                v-model="statusFilter"
                :options="statusOption"
                label="Search by Status"
                lazy-rules
                clearable
                @clear="filter()"
                dense
                data-id="foodmenu-searchbystatus"
              >
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer"> </q-icon>
                </template>
              </q-select>
              <q-input
                outlined
                class="q-px-sm col-4"
                v-model="dateFilterConverted"
                label="Search by Date Range"
                lazy-rules
                dense
                clearable
                @clear="dateFilter = null"
                data-id="foodmenu-searchbydate"
              >
                <template v-slot:append>
                  <q-icon name="insert_invitation" class="cursor-pointer">
                  </q-icon>
                </template>
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateFilter"
                    range
                    data-id="foodmenu-calender"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Ok"
                        color="primary"
                        flat
                        data-id="foodmenucalender-ok"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-input>
              <div class="denote_color q-mt-sm">
                <ul>
                  <li v-for="data in denoteColors" :key="data">
                    <span
                      class="color_dot"
                      :style="{ backgroundColor: data.color }"
                    ></span>
                    <span> {{ data.text }} </span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="scroll_timesheet row wrap justify-start items-start content-start full-width"
            >
              <CanteenMenu
                v-for="(event, index) in announcementData"
                :key="index"
                :eventData="event"
                @updateForm="onUpdateFoodMenu"
                @eventChange="onStatusMenuChange"
                :tab="tab"
                :leavesToDisplay2="leavesToDisplay2"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
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
            Invalid data
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none"> {{ errMsg }} </q-card-section>

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
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import moment from "moment";
import AddWorkingDay from "src/components/Events/AddWorkingDay.vue";
import BirthDayTemplate from "../components/BirthdayTemplatesApproval.vue";
import AddEvent from "../components/Events/AddAnnouncement.vue";
import AddCanteenMenu from "../components/Events/AddCanteenMenu.vue";
import AddHoliday from "../components/Events/AddHoliday.vue";
import CanteenMenu from "../components/Events/CanteenMenu.vue";
import Event from "../components/Events/Event.vue";
import Holiday from "../components/Events/Holiday.vue";
import WorkingDays from "../components/Events/WorkingDay.vue";
import Notify from "../components/Notify.vue";
import * as eventsService from "../services/events.service";
import * as functions from "../services/functions";
import * as timsheetService from "../services/timesheets.service";
import * as usersService from "../services/users.service";

export default {
  components: {
    Event,
    AddHoliday,
    AddEvent,
    Notify,
    Holiday,
    AddWorkingDay,
    WorkingDays,
    AddCanteenMenu,
    CanteenMenu,
    BirthDayTemplate,
  },
  data() {
    return {
      nameFilter: "",
      nameFilterForCompoff: "",
      statusFilterForCompoff: "",
      statusFilter: "",
      dateFilter: null,
      splitterModelMyLeaves: 50,
      showOldBirthdays: false,
      holidayNameFilter: "",
      tab: "announcement",
      applyLeaveLayout: false,
      announcementData: [],
      approvedBirthdays: [],
      upcomingBirthdays: [],
      editLeaveType: false,
      skip: 0,
      errorLayout: false,
      errorMsg: "",
      statusOption: [
        {
          label: "Active",
          value: true,
        },
        {
          label: "InActive",
          value: false,
        },
      ],
      searchByNameFoodFilterOptions: [
        {
          label: "Lunch",
          value: "Lunch",
        },
        {
          label: "Snacks",
          value: "Snacks",
        },
      ],
      events: [],
      successMsg: "",
      leaveTypeData: "",
      setDataForEdit: false,
      timeSheets: [
        {
          date: null,
          user: "",
          data: [],
          color: "",
          border: "",
        },
      ],
      timeSheetsToDisplay: [],
      denoteColors: [
        {
          text: "Events In Past",
          color: "#93BE3B ",
        },
        {
          text: "Upcoming Events",
          color: "#F2C037 ",
        },
      ],
      denoteColorsForLeaveType: [
        {
          text: "Positive Impact",
          color: "#93BE3B ",
        },
        {
          text: "Negative Impact",
          color: "#C10015",
        },
      ],
      denoteColorsForCompOff: [
        {
          text: "Approved",
          color: "#93BE3B ",
        },
        {
          text: "Rejected",
          color: "#C10015",
        },
        {
          text: "Approval Pending",
          color: "#F2C037 ",
        },
      ],
      appliedMenuDate: [],
      leavesToDisplay2: [],
    };
  },
  watch: {
    nameFilter: function (newVal) {
      this.filter();
    },
    nameFilterForCompoff: function (newVal) {
      this.filter();
    },
    statusFilterForCompoff: function (newVal) {
      this.filter();
    },
    statusFilter: function (newVal) {
      this.filter();
    },
    dateFilter: function (newVal) {
      this.$refs.qDateProxy.hide();
      this.filter();
    },
    holidayNameFilter: function (newVal) {
      this.filter();
    },
    tab: function (val) {
      this.skip = 0;
      this.announcementData = [];
      if (val == "announcement") {
        this.getAllEvents();
      } else if (val == "holidays") {
        this.getHolidays();
      } else if (val == "leaveType") {
        this.getLeaveTypes();
      } else if (val == "shortfallSheet") {
        this.getShortfallSheet();
      } else if (val == "compoffSheets") {
        this.loadcompoffTimeSheets();
      }
    },
  },
  computed: {
    approvedBirthdays() {
      if (this.showOldBirthdays) {
        return (
          this.announcementData?.approvedBirthdays?.filter((item) => {
            return new Date(item.currentBirthDate) <= new Date();
          }) || []
        );
      } else {
        return (
          this.announcementData?.approvedBirthdays?.filter((item) => {
            return new Date(item.currentBirthDate) >= new Date();
          }) || []
        );
      }
    },
    dateFilterConverted: {
      get() {
        if (this.dateFilter) {
          if (this.dateFilter.from) {
            return this.dateFilter.from + " - " + this.dateFilter.to;
          } else {
            return this.dateFilter + " - " + this.dateFilter;
          }
        } else {
          return "";
        }
      },
    },
    dateFilterConvertedForCompoff: {
      get() {
        if (this.dateFilter) {
          if (this.dateFilter.from) {
            return this.dateFilter.from + " - " + this.dateFilter.to;
          } else {
            return this.dateFilter + " - " + this.dateFilter;
          }
        } else {
          return "";
        }
      },
    },
  },
  methods: {
    handler() {
      event.preventDefault();
    },
    GetAllEvents() {
      if (this.tab == "announcement") {
        this.announcementData = [];
        this.getAllEvents();
      }
    },
    routeToGetHolidays() {
      if (this.tab == "holidays") {
        this.announcementData = [];
        this.getHolidays();
      }
    },
    routeToGetMarkedWorkingDays() {
      if (this.tab == "workingDays") {
        this.announcementData = [];
        this.getAllWorkingDays();
      }
    },
    routeToGetCanteenMenu() {
      if (this.tab == "canteenMenu") {
        this.announcementData = [];
        this.getAllCanteenMenus();
      }
    },
    routeToGetBirthdayTemplates() {
      if (this.tab == "birthdayManager") {
        this.showOldBirthdays = false;
        this.announcementData = [];
        this.getAllBirthdayTemplates();
      }
    },
    onApplyLeave() {
      this.applyLeaveLayout = true;
    },
    onMarkWorkingDay() {
      this.applyLeaveLayout = true;
    },

    async getAllEvents() {
      this.clearFilters();
      this.$q.loading.show();
      this.events = [];
      this.announcementData = [];
      const res = await eventsService.fetchAllEvents();
      this.events = res.data;
      this.announcementData = this.events;
      this.$store.commit("changeTabName", "Announcements");
      this.$q.loading.hide();
    },
    async getHolidays() {
      this.clearFilters();
      this.$q.loading.show();
      this.events = [];
      this.announcementData = [];
      const res = await eventsService.fetchAllHolidays();
      this.events = res.data;
      this.announcementData = this.events;
      this.$store.commit("changeTabName", "Holidays");
      this.$q.loading.hide();
    },
    async getAllWorkingDays() {
      this.$q.loading.show();
      this.events = [];
      this.announcementData = [];
      const res = await eventsService.fetchAllWorkingDays();
      this.events = res.data;
      this.announcementData = this.events;
      this.$store.commit("changeTabName", "Working Days");
      this.$q.loading.hide();
    },
    async getAllCanteenMenus() {
      this.$q.loading.show();
      this.events = [];
      this.announcementData = [];
      const res = await eventsService.getAllCanteenMenu();
      this.events = res.data;
      this.announcementData = this.events;
      this.leavesToDisplay2 = res.data;
      this.$store.commit("changeTabName", "Food Menu");
      this.$q.loading.hide();
    },
    async onApprovedTemplates(message) {
      this.successMsg = message;
      await this.getAllBirthdayTemplates();
    },
    async onClosedTemplates() {
      await this.getAllBirthdayTemplates();
    },
    async getAllBirthdayTemplates() {
      this.$q.loading.show();
      this.announcementData = [];
      this.$store.commit("changeTabName", "Birthday Manager");
      const res = await usersService.getAllUsersBirthdayTemplates();
      if (res.data.ok) {
        this.announcementData = res?.data;
        this.approvedBirthdays = this.announcementData.approvedBirthdays;
        this.upcomingBirthdays = this.announcementData.upcomingBirthdays;
        this.errMsg = "";
        this.errorLayout = false;
      } else {
        this.errMsg = res.data.error;
        this.errorLayout = true;
      }
      this.$q.loading.hide();
    },
    async onApproveCompoffSheet(value) {
      this.$q.loading.show();
      this.clearFilters();
      await timsheetService.updateCompoffStatus(value);
      this.loadcompoffTimeSheets();
      this.successMsg = "CompOff Status Updated!!";
      this.$q.loading.hide();
    },
    onStatusChange() {
      this.successMsg = "Updated Successfully!!";
      this.getAllEvents();
    },
    onUpdateAnnouncement() {
      this.successMsg = "Announcement Updated Successfully!!";
      this.getAllEvents();
    },
    onUpdateHolidays() {
      this.successMsg = "Holiday Updated Successfully!!";
      this.getHolidays();
    },
    onStatusMenuChange() {
      this.successMsg = "Updated Successfully!!";
      this.getAllCanteenMenus();
    },
    onHolidayStatusChange() {
      this.successMsg = "Updated Successfully!!";
      this.getHolidays();
    },
    onUpdateFoodMenu() {
      this.successMsg = "Food Menu Updated Successfully!!";
      this.getAllCanteenMenus();
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    onEditLeaveType(value) {
      this.editLeaveType = true;
      this.setDataForEdit = true;
      this.leaveTypeData = value;
    },
    onCloseAddLeaveType() {
      this.editLeaveType = false;
      this.setDataForEdit = false;
      this.getLeaveTypes();
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    filter() {
      this.announcementData = this.events;
      this.timeSheetsToDisplay = this.timeSheets;
      this.filterByName();
      this.filterByStatus();
      this.filterByDateRange();
      this.filterHolidayByName();
    },
    filterByName() {
      if (this.nameFilter) {
        this.announcementData = this.announcementData.filter((event) => {
          return event?.title
            ? event.title.toLowerCase().includes(this.nameFilter.toLowerCase())
            : event.menuType
                .toLowerCase()
                .includes(this.nameFilter.value.toLowerCase());
        });
      }
    },
    filterHolidayByName() {
      if (this.holidayNameFilter) {
        this.announcementData = this.announcementData.filter((event) => {
          return event.name
            .toLowerCase()
            .includes(this.holidayNameFilter.toLowerCase());
        });
      }
    },
    filterByStatus() {
      if (this.statusFilter) {
        this.announcementData = this.announcementData.filter((event) => {
          return event.status == this.statusFilter.value;
        });
      }
    },
    filterByDateRange() {
      if (this.dateFilter) {
        let dateObject;
        let dateObject2;
        if (this.dateFilter.to) {
          dateObject = new Date(this.dateFilter.from);
          dateObject2 = new Date(this.dateFilter.to);
        } else {
          dateObject = new Date(this.dateFilter);
          dateObject2 = new Date(this.dateFilter);
        }

        dateObject.setHours(0, 0, 0, 0);
        dateObject2.setHours(23, 59, 59, 999);

        if (this.tab === "announcement") {
          this.announcementData = this.announcementData.filter((event) => {
            const eventFromDate = new Date(event.fromDate);
            const eventToDate = new Date(event.toDate);

            return (
              moment(eventFromDate).isBetween(dateObject, dateObject2) ||
              moment(eventToDate).isBetween(dateObject, dateObject2) ||
              moment(dateObject).isBetween(eventFromDate, eventToDate) ||
              moment(dateObject2).isBetween(eventFromDate, eventToDate)
            );
          });
        } else if (this.tab === "canteenMenu") {
          this.announcementData = this.announcementData.filter((event) =>
            moment(event.date).isBetween(dateObject, dateObject2),
          );
        } else {
          this.announcementData = this.announcementData.filter((event) =>
            this.dateFilter.from
              ? moment(event.holidayDate).isBetween(dateObject, dateObject2)
              : moment(event.holidayDate).isBetween(dateObject, dateObject2),
          );
        }
      }
    },
    filterCompoffByName() {
      if (this.nameFilterForCompoff != null) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) => {
            return timesheet?.user?.user_name
              .toLowerCase()
              .includes(this.nameFilterForCompoff?.toLowerCase());
          },
        );
      }
    },
    filterCompoffByStatus() {
      if (this.statusFilterForCompoff != null) {
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) => {
            return timesheet.CompoffStatus.toLowerCase().includes(
              this.statusFilterForCompoff.toLowerCase(),
            );
          },
        );
      }
    },
    filterCompoffByDateRange() {
      if (this.dateFilter) {
        let dateObject;
        let dateObject2;
        if (this.dateFilter.to) {
          dateObject = new Date(this.dateFilter.to);
          dateObject.setDate(dateObject.getDate() + 1);
        } else {
          dateObject = new Date(this.dateFilter);
          dateObject2 = new Date(this.dateFilter);
          dateObject2.setDate(dateObject.getDate() + 1);
        }
        this.timeSheetsToDisplay = this.timeSheetsToDisplay.filter(
          (timesheet) =>
            this.dateFilter.from
              ? moment(timesheet.date).isBetween(
                  this.dateFilter.from,
                  dateObject,
                )
              : moment(timesheet.date).isBetween(dateObject, dateObject2),
        );
      }
    },
    clearFilters() {
      this.dateFilter = null;
      this.nameFilter = "";
      this.statusFilter = "";
      this.holidayNameFilter = "";
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
        CompoffStatus: project.CompoffStatus,
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
  },
  mounted() {
    document
      .querySelector("#working_days i")
      ?.classList?.remove("material-icons");
    document
      .querySelector("#working_days i")
      ?.classList?.add("material-symbols-outlined");
  },
  created() {
    this.getAllEvents();
  },
};
</script>

<style>
.oldToggledButton {
  text-align: right;
}
</style>
