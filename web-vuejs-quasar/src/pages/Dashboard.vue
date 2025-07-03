<template>
  <div>
    <div class="row dashboard-calendar-announcement">
      <div class="col-12 col-md-6 col-lg-6 q-pt-sm">
        <Calendar />
      </div>
      <div class="col-12 col-md-6 col-lg-6 q-pt-sm">
        <InboxView :ArrayTabs="inboxData" @close="getUserInboxList"></InboxView>
      </div>
    </div>
    <div class="row q-mt-md dashboard-event-piechart">
      <div class="col-12 col-md-6 col-lg-6 q-mb-none">
        <EventsCard />
      </div>
      <div class="col-12 col-md-6 col-lg-6 q-mb-none">
        <AnnouncementsCard />
      </div>
    </div>
    <!-- Utilities Section -->
    <div class="fixed-bottom mx-auto bottom-0">
      <q-icon
        style="font-size: 38px"
        :style="!isArrowUp ? 'margin-bottom: 83px;' : ''"
      >
        <img
          v-if="isArrowUp"
          class="arrow-icon"
          src="../assets/images/up-arrow.svg"
          draggable="false"
          @click="showHideIcons"
        />
        <img
          v-else
          class="arrow-icon"
          src="../assets/images/down-arrow.svg"
          draggable="false"
          @click="showHideIcons"
        />
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          class="bg-tip shadow-1"
          :offset="[10, 10]"
          style="font-size: 13px"
          v-if="isArrowUp"
        >
          Show Utilities
        </q-tooltip>
        <q-tooltip
          anchor="top middle"
          self="bottom middle"
          class="bg-tip shadow-1"
          :offset="[10, 10]"
          style="font-size: 13px"
          v-if="!isArrowUp"
        >
          Hide Utilities
        </q-tooltip>
      </q-icon>
      <div class="bar-container">
        <div
          :class="isArrowUp ? 'utility-bar move-up' : 'utility-bar move-down'"
        >
          <a
            href="https://oasis.genesisapps.in/"
            target="_blank"
            draggable="false"
          >
            <q-icon class="utilities">
              <img src="../assets/images/oasis-logo.png" draggable="false" />
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                class="bg-tip shadow-1"
                :offset="[10, 10]"
                :style="tooltipStyle"
              >
                Oasis
              </q-tooltip>
            </q-icon>
          </a>
          <a
            href="https://alvin.genesisapps.in/login"
            target="_blank"
            draggable="false"
          >
            <q-icon class="utilities">
              <img src="../assets/images/alvin-logo.png" draggable="false" />
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                class="bg-tip shadow-1"
                :offset="[10, 10]"
                :style="tooltipStyle"
              >
                Alvin
              </q-tooltip>
            </q-icon>
          </a>
          <a href="http://192.168.0.119/users/sign_in" target="_blank">
            <q-icon class="utilities">
              <img src="../assets/images/git-grace.png" />
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                class="bg-tip shadow-1"
                :offset="[10, 10]"
                :style="tooltipStyle"
              >
                Grace
              </q-tooltip>
            </q-icon>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InboxView from "src/components/InboxView.vue";
import AnnouncementsCard from "../components/Announcements.vue";
import Calendar from "../components/Calendar.vue";
import EventsCard from "../components/Events.vue";
import PieChart from "../components/PieChart.vue";
import * as inboxservices from "../services/myinboxtabs.service";

export default {
  components: {
    Calendar,
    EventsCard,
    AnnouncementsCard,
    PieChart,
    InboxView,
  },
  data() {
    return {
      inboxData: {},
      isArrowUp: true,
      tooltipStyle: {
        fontSize: "13px",
      },
    };
  },
  methods: {
    async getUserInboxList() {
      const res = await inboxservices.fetchMyInboxGridList({
        userId: this.$store.getters.userId,
      });
      this.inboxData = Object.entries(res.data);
    },
    showHideIcons() {
      this.isArrowUp = !this.isArrowUp;
    },
  },
  async created() {
    this.$q.loading.show();
    this.getUserInboxList()
      .then((res) => {
        this.$q.loading.hide();
      })
      .catch((err) => {
        console.error(err);
        this.$q.loading.hide();
      });
  },
};
</script>

<style scoped>
.mx-auto {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.bar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.utility-bar {
  display: flex;
  justify-content: center;
  width: fit-content;
  border-radius: 15px;
  background: rgb(82 82 82 / 78%);
  transition: transform 0.5s ease;
  position: absolute;
}
.utilities {
  margin: 0.4em;
  font-size: 45px;
  border-radius: 20px;
}
.move-up {
  transform: translateY(40px);
}
.move-down {
  transform: translateY(-40px);
}
.utility-bar a {
  margin: 0.5em;
  width: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 58px;
  border-radius: 20px;
  background: rgb(230, 228, 228);
}
.utility-bar a:hover {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}
.arrow-icon {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
