<template>
  <div class="row q-ml-sm">
    <div v-for="eventType in eventTypes" :key="eventType.title" class="col-4">
      <q-list class="">
        <q-item-label
          class="q-pb-sm q-pl-sm text-h6 text-weight-medium text-dark"
        >
          <template v-if="eventType.title === 'Food Menu'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-foodmenu"
              >lunch_dining</span
            >
          </template>
          <template v-else-if="eventType.title === 'Announcement'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-announcement"
              >campaign</span
            >
          </template>
          <template v-else-if="eventType.title === 'My Inventories'">
            <span
              class="material-icons-outlined common-icons"
              data-id="dashboard-myinventories"
              >inventory_2</span
            >
          </template>
          &nbsp;{{ eventType.title }}
        </q-item-label>
        <div
          class="overflow-auto events-box q-py-sm"
          style="height: 170px; overflow-y: auto"
          v-bind:class="{
            eventBoxRightBorder:
              eventType.title === 'Food Menu' ||
              eventType.title === 'Announcement',
            eventBoxLeftBorder:
              eventType.title === 'My Inventories' ||
              eventType.title === 'Announcement',
          }"
        >
          <div v-for="event in eventType.data" :key="event.id">
            <q-item
              v-if="eventType.title == 'My Inventories'"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  class="bg-tip shadow-1"
                  :offset="[10, 10]"
                >
                  <q-item-label class="tooltip-item-heading">
                    {{ event.name }}
                  </q-item-label>
                </q-tooltip>
                <q-item-label
                  class="headtext"
                  lines="1"
                  :style="
                    checkInventoryDate(
                      event.last_checkout,
                      event.last_audit_date,
                    )
                      ? 'color : red;'
                      : ''
                  "
                >
                  {{ event.name }}
                </q-item-label>
                <q-item-label caption lines="2" v-if="event.last_checkout">
                  {{ convertDate(event.last_checkout) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              v-else-if="eventType.title == 'Food Menu'"
              clickable
              v-ripple
            >
              <q-item-section>
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  class="bg-tip shadow-1"
                  :offset="[10, 10]"
                >
                  <div v-for="(even1, i) in event.eventArray" :key="i">
                    <q-item-section>
                      <q-item-label
                        class="tooltip-item-heading"
                        style="white-space: pre-line"
                      >
                        <span class="headtext">{{ even1.type }}</span> -
                        <span class="subtext">{{ even1.desc }}</span>
                      </q-item-label>
                    </q-item-section>
                  </div>
                </q-tooltip>
                <q-item class="tooltip-item">
                  <q-item-section>
                    <q-item-label class="headtext" lines="1">
                      {{ convertDate(event.date) }}
                    </q-item-label>
                    <div
                      v-for="(even1, i) in event.eventArray"
                      :key="i"
                      style="
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        width: 160px;
                        font-size: 12px;
                      "
                    >
                      <span class="headtext">{{
                        capitalizeFirst(even1.type)
                      }}</span>
                      -
                      <span class="subtext">{{
                        capitalizeFirst(even1.desc)
                      }}</span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-item-section>
            </q-item>
            <q-item v-else clickable v-ripple>
              <q-item-section>
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  class="bg-tip shadow-1"
                  :offset="[10, 10]"
                >
                  <q-item class="tooltip-item">
                    <q-item-section>
                      <q-item-label
                        class="tooltip-item-heading"
                        style="white-space: pre-line"
                      >
                        <span class="headtext">{{
                          capitalizeFirst(event.title)
                        }}</span></q-item-label
                      >
                      <q-item-label
                        class="tooltip-item-heading"
                        style="white-space: pre-line"
                      >
                        <span class="subtext">{{
                          capitalizeFirst(event.description)
                        }}</span></q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-tooltip>
                <q-item-label class="headtext" lines="1">
                  {{ capitalizeFirst(event.eventType) }}
                </q-item-label>
                <q-item-label caption class="subtext" lines="2">
                  {{ event.title }}
                </q-item-label>
                <q-item-label caption class="subtext" lines="3">
                  {{ event.description }}
                </q-item-label>
              </q-item-section>
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
import * as eventsService from "../services/events.service";
import moment from "moment";

export default {
  name: "AnnouncementCard",
  data() {
    return {
      eventTypes: [
        {
          title: "Food Menu",
          data: [],
        },
        {
          title: "Announcement",
          data: [],
        },
        {
          title: "My Inventories",
          data: [],
        },
      ],
    };
  },
  created() {
    this.getAllEvents();
    this.getAllCanteenMenus();
    this.getAllInventories();
  },
  methods: {
    async getAllCanteenMenus() {
      this.announcements = [];
      const res = await eventsService.getAllDashboardCanteenMenu();
      let dates = [];
      let eventTypes = [];
      for (let i = 0; i < res?.data?.length; i++) {
        if (dates.length <= 0 || !dates.includes(res.data[i].date)) {
          dates.push(res.data[i].date);
          eventTypes.push({
            id: res.data[i]._id,
            date: res.data[i].date,
            eventArray: [
              { type: res.data[i].menuType, desc: res.data[i].menuDescription },
            ],
          });
        } else {
          var index1 = eventTypes.findIndex(
            (x) => x.date.toString() == res.data[i].date.toString(),
          );

          eventTypes[index1].eventArray.push({
            type: res.data[i].menuType,
            desc: res.data[i].menuDescription,
          });
        }
      }
      this.eventTypes[0].data = eventTypes;
    },
    async getAllEvents() {
      this.announcements = [];
      const res = await eventsService.fetchAllEvents();
      res.data.forEach((ele) => {
        if (
          ele.status &&
          (new Date(new Date().setHours(0, 0, 0, 0)).getTime() <=
            new Date(new Date(ele.fromDate).setHours(0, 0, 0, 0)).getTime() ||
            new Date(new Date().setHours(0, 0, 0, 0)).getTime() <=
              new Date(new Date(ele.toDate).setHours(0, 0, 0, 0)).getTime())
        ) {
          this.eventTypes[1].data.push({
            id: ele._id,
            title: ele.title,
            description: ele.description,
            fromDate: ele.fromDate,
            toDate: ele.toDate,
            date:
              ele.fromDate !== ele.toDate
                ? this.convertDate(ele.fromDate) +
                  " - " +
                  this.convertDate(ele.toDate)
                : this.convertDate(ele.fromDate),
            eventType: ele.eventType,
          });
        }
      });
      this.eventTypes[1].data = this.eventTypes[1].data.sort(
        (a, b) => new Date(a.fromDate) - new Date(b.fromDate),
      );
    },
    async getAllInventories() {
      this.announcements = [];
      const res = await eventsService.getAllInventoryOfUSer(
        this.$store.getters.userId,
      );
      this.announcements = [
        ...res.data[0].assets,
        ...res.data[0].accessories,
        ...res.data[0].licenses,
      ];
      this.announcements.forEach((element) => {
        this.eventTypes[2].data.push({
          name: element.name.replace("&amp;", "&"),
          last_checkout: element.last_checkout,
          last_audit_date: element.last_audit_date,
        });
      });
    },
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    capitalizeFirst(val) {
      return functions.capitalizeFirstLetter(val);
    },
    checkInventoryDate(checkout, audit) {
      if (!checkout && !audit) return false;
      else {
        const checkoutDate = moment(checkout);
        const auditDate = moment(audit);
        const currentDate = moment();
        if (audit) {
          return (
            checkoutDate < currentDate.subtract(3, "months") &&
            auditDate < currentDate.subtract(3, "months")
          );
        } else return checkoutDate < currentDate.subtract(3, "months");
      }
    },
  },
};
</script>

<style>
.announcement-box {
  border: 2px solid #dadada;
  border-radius: 10px;
  outline: none;
}
.see-more-announcement {
  height: 10%;
}
.change-announcement-separator {
  width: 95%;
}
.bg-tip-full-width-announce {
  width: 35%;
}
.inventories_icon {
  font-size: 1.3rem;
}
</style>
