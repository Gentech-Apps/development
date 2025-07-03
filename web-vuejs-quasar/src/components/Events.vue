<template>
  <div class="row">
    <div v-for="eventType in eventTypes" :key="eventType.title" class="col-4">
      <q-list class="">
        <q-item-label
          class="q-pb-sm q-pl-sm text-h6 text-weight-medium text-dark"
        >
          <template v-if="eventType.title === 'Holidays'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-holidays"
              >insert_invitation</span
            >
          </template>
          <template v-else-if="eventType.title === 'Birthdays'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-birthdays"
              >celebration</span
            >
          </template>
          <template v-else-if="eventType.title === 'Leaves'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-leaves"
              >connecting_airports</span
            >
          </template>
          &nbsp;{{ eventType.title }}
        </q-item-label>
        <div
          class="overflow-auto events-box q-py-sm"
          style="height: 170px; overflow-y: auto"
          v-bind:class="{
            eventBoxRightBorder:
              eventType.title === 'Holidays' || eventType.title === 'Birthdays',
            eventBoxLeftBorder:
              eventType.title === 'Leaves' || eventType.title === 'Birthdays',
          }"
        >
          <div v-for="event in eventType.data" :key="event.id">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label lines="1">
                  {{ event.title }}
                </q-item-label>
                <q-item-label caption lines="2">
                  {{
                    eventType?.title == "Birthdays" ||
                    eventType?.title == "Holidays" ||
                    eventType?.title == "Leaves"
                      ? event?.date
                      : ""
                  }}
                </q-item-label>
              </q-item-section>
              <q-icon
                name="layers"
                v-if="eventType.title === 'Holidays' && event.sandwich"
                style="font-size: 22px"
              >
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  class="bg-tip shadow-1"
                  :offset="[10, 10]"
                >
                  Sandwich Leave
                </q-tooltip>
              </q-icon>
            </q-item>
            <q-separator class="q-mx-auto change-separator" />
          </div>
        </div>
      </q-list>
    </div>
  </div>
</template>

<script>
import * as functions from "../services/functions";
import * as usersService from "../services/users.service";
import * as eventsService from "../services/events.service";
import * as leavesService from "../services/leaves.service";

export default {
  name: "AnnouncementCard",
  data() {
    return {
      holidays: [],
      eventTypes: [
        {
          title: "Holidays",
          data: [],
        },
        {
          title: "Birthdays",
          data: [],
        },
        {
          title: "Leaves",
          data: [],
        },
      ],
    };
  },
  created() {
    this.getHolidays();
    this.getBirthdays();
    this.getLeaves();
  },
  methods: {
    async getBirthdays() {
      this.eventTypes[1].data = [];
      const res = await usersService.getAllBirthday(
        this.$store.getters.userType,
      );
      var response = [];
      res.data.forEach((birthday) => {
        response.push({
          userId: birthday.userId,
          fullName: functions.capitalizeFirstLetter(birthday.fullName),
          date: this.calcDOJ(birthday.date),
          image: birthday.image,
          department: birthday.department,
        });
        response.push({
          userId: birthday.userId,
          fullName: functions.capitalizeFirstLetter(birthday.fullName),
          date: this.calcDOJ1(birthday.date),
          image: birthday.image,
          department: birthday.department,
        });
      });
      const resnew = response.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      resnew.forEach((birthday) => {
        if (
          new Date(new Date(birthday.date).setHours(0, 0, 0, 0)).getTime() >=
          new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        ) {
          this.eventTypes[1].data.push({
            id: birthday.userId,
            title: birthday.fullName,
            date: functions.convertDateToDate(birthday.date),
            image: birthday.image,
            department: birthday.department,
          });
        }
      });
    },
    async getHolidays() {
      this.announcementData = [];
      const res = await eventsService.fetchAllHolidays();
      const response = res.data.sort(function (a, b) {
        return (
          new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime()
        );
      });
      response.forEach((holiday) => {
        if (
          holiday.status &&
          new Date(holiday.holidayDate).setHours(0, 0, 0, 0) >=
            new Date().setHours(0, 0, 0, 0)
        ) {
          this.eventTypes[0].data.push({
            id: holiday._id,
            title: holiday.name,
            date: functions.convertDateToDate(holiday.holidayDate),
            sandwich: holiday.isSandwich,
          });
          this.holidays.push(holiday.holidayDate);
        }
      });
    },
    async getLeaves() {
      this.announcementData = [];
      const res = await leavesService.dashboardUpcomingLeaves();
      var leaveData = res.data;
      if (leaveData.length > 0) {
        leaveData.forEach((leave) => {
          if (
            (leave.status == "approved" || leave.status == "autoApproved") &&
            new Date(
              new Date(leave.leaveDate).setHours(0, 0, 0, 0),
            ).getTime() >= new Date(new Date().setHours(0, 0, 0, 0)).getTime()
          ) {
            this.eventTypes[2].data.push({
              id: leave.leaves_id,
              title:
                functions.capitalizeFirstLetter(leave.user.firstName) +
                " " +
                functions.capitalizeFirstLetter(leave.user.lastName),
              date: functions.convertDateToDate(leave.leaveDate),
              dateForSort: new Date(leave.leaveDate),
            });
          }
        });
      }
      this.eventTypes[2].data.data = this.eventTypes[2].data.sort(
        function (a, b) {
          return (
            new Date(a.dateForSort).getTime() -
            new Date(b.dateForSort).getTime()
          );
        },
      );
    },
    calcDOJ(val) {
      var str = val.split("-");
      str[0] = functions.convertUTCToDate(new Date()).split("/")[2];
      str = str.join("-");
      return str;
    },
    calcDOJ1(val) {
      var str = val.split("-");
      str[0] = functions
        .convertUTCToDate(new Date().setFullYear(new Date().getFullYear() + 1))
        .split("/")[2];
      str = str.join("-");
      return str;
    },
    calcLeaveDate(from, to) {
      var fromDate = new Date(from);
      var fromDatetoDisplay =
        fromDate.toString().split(" ")[0] +
        " " +
        fromDate.toString().split(" ")[1] +
        " " +
        fromDate.toString().split(" ")[2] +
        " " +
        fromDate.toString().split(" ")[3];
      if (from == to) {
        return fromDatetoDisplay;
      } else {
        var toDate = new Date(to);
        var toDatetoDisplay =
          toDate.toString().split(" ")[0] +
          " " +
          toDate.toString().split(" ")[1] +
          " " +
          toDate.toString().split(" ")[2];
        return toDatetoDisplay + " - " + fromDatetoDisplay;
      }
    },
  },
};
</script>

<style>
.events-box {
  border: 2px solid #dadada;
  border-radius: 10px;
  outline: none;
}
.eventBoxRightBorder {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.eventBoxLeftBorder {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: hidden;
}
.see-more-events {
  height: 10%;
}
.change-separator {
  width: 90%;
}
.bg-tip-full-width-event {
  width: 17%;
}
</style>
