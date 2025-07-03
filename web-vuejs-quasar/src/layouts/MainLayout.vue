<template>
  <div
    v-if="
      $route.path != '/login' &&
      $route.path != '/forgotpassword' &&
      $route.path != '/resetpassword'
    "
    class="topbar_bg"
  >
    <Sidebar :modal="modalValue" :logoutUser="logoutFromPassword" />
    <div
      id="main-layout-logo"
      style="
        position: absolute;
        top: 2px;
        left: -5px;
        z-index: 999999;
        user-select: none;
      "
    >
      <img
        src="../../public/pegasus_new.png"
        alt=""
        class="responsive-img-footer"
        style="width: 235px"
      />
    </div>
    <div
      style="
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
      "
    >
      <P
        class="text-white q-pt-md text-h6"
        style="user-select: none"
        v-if="
          this.$route.meta.title == 'Daily Report' ||
          this.$route.meta.title == 'Events' ||
          this.$route.meta.title == 'Leaves' ||
          this.$route.meta.title == 'Appraisal' ||
          this.$route.meta.title == 'Internet Reimbursement' ||
          this.$route.meta.title == 'InboxView' ||
          this.$route.meta.title == 'Settlement' ||
          this.$route.meta.title == 'Payroll' ||
          this.$route.meta.title == 'Loan' ||
          this.$route.meta.title == 'Mediclaim' ||
          this.$route.meta.title == 'Employee Details' ||
          this.$route.meta.title == 'Petty Cash'
        "
      >
        {{ this.$route.meta.title + " / " + this.$store.getters.reportTabName }}
      </P>
      <P class="text-white q-pt-md text-h6" style="user-select: none" v-else>
        {{ this.$route.meta.title }}
      </P>
    </div>
    <div
      class="options-list"
      style="position: absolute; top: 12px; right: 20px; color: white"
    >
      <q-btn-dropdown
        class="options-list"
        flat
        :ripple="false"
        auto-close
        :img="$store.getters.user?.profileImageURL"
        data-id="profilename"
      >
        <!-- Used slot to customize label for button and added avtar -->
        <template v-slot:label>
          <q-avatar size="30px">
            <img
              :src="
                $store.getters.user?.profileImageURL
                  ? $store.getters.user?.profileImageURL
                  : 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png'
              "
            />
          </q-avatar>
          <span class="q-ml-md text-white">{{
            capitalizeFirst(userName)
          }}</span>
        </template>

        <!-- dropdown -->
        <q-list class="options-list">
          <q-item
            clickable
            v-close-popup
            @click="$router.push('/profile/' + $store.getters.userId)"
          >
            <q-item-section data-id="profile">
              <q-item-label>Profile</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="callReferral"
            data-id="addreferral"
          >
            <q-item-section>
              <q-item-label>Add Referral</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="callMyReferral"
            data-id="myreferral"
          >
            <q-item-section>
              <q-item-label>My Referral</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="callChangePassword"
            data-id="changepassword"
          >
            <q-item-section>
              <q-item-label>Change Password</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="logout" data-id="logout">
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-close-popup
            @click="callChangeLogDetails"
            data-id="changelog"
          >
            <q-item-section>
              <q-item-label>Change Log</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <ChangePassword
      :modal="modalValue"
      @onClose="onClose"
      @callLogout="logout"
    />
    <Referral :modal="modalValue1" @onClose="onClose" @callLogout="logout" />
    <MyReferral :modal="modalValue2" @onClose="onClose" @callLogout="logout" />
    <q-dialog
      v-model="modalValue3"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card style="max-width: 825px !important">
        <q-card-section align="center" style="box-shadow: inherit">
          <div class="text-h6 col-md-9 text-center q-px-sm">Release Notes</div>
          <q-btn
            flat
            color="negative"
            icon="close"
            @click="onClose"
            style="position: absolute; right: 5px; top: 13px"
          />
        </q-card-section>
        <div>
          <iframe
            id="iframeEditor"
            class="changeLogs"
            allowfullscreen
            :src="releasNote"
          ></iframe>
        </div>
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
            Connection Error
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Your connection is interrupted, please refresh your page.
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
    <!-- <Calendar /> -->
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import ChangePassword from "../components/ChangePassword";
import Referral from "../components/Referral";
import MyReferral from "../components/MyReferral";
import * as UserService from "../services/users.service.js";
import * as functions from "../services/functions";

export default {
  components: {
    Sidebar,
    ChangePassword,
    Referral,
    MyReferral,
  },
  data() {
    return {
      modalValue: false,
      modalValue1: false,
      modalValue2: false,
      modalValue3: false,
      logoutFromPassword: false,
      userName: "",
      mobileData: true,
      bluetooth: false,
      onLine: navigator.onLine,
      showBackOnline: false,
      errorLayout: false,
    };
  },
  created() {
    this.getUserName();
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
  computed: {
    releasNote() {
      const url = window.location.href;

      if (url.includes("local")) return process.env.RELEASE_NOTE_URL_LOCAL;
      else if (url.includes("dev")) return process.env.RELEASE_NOTE_URL_DEV;
      else if (url.includes("stage")) return process.env.RELEASE_NOTE_URL_STAGE;
      else return process.env.RELEASE_NOTE_URL_PROD;
    },
  },
  watch: {
    onLine(v) {
      if (v) {
        this.showBackOnline = true;
        this.errorLayout = false;
        setTimeout(() => {
          this.showBackOnline = false;
        }, 1000);
      } else {
        this.errorLayout = true;
      }
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("vuex");
      localStorage.clear();
      sessionStorage.clear();
      this.$store.commit("setLogout", false);
      this.$store.commit("setUser", null);
      this.$store.commit("setToken", null);
      this.$store.commit("changeTabName", "");
      this.$router.push("/login");
    },
    callChangePassword() {
      this.modalValue = true;
    },
    callChangeLogDetails() {
      this.modalValue3 = true;
    },
    callReferral() {
      this.modalValue1 = true;
    },
    callMyReferral() {
      this.modalValue2 = true;
    },
    onClose(value) {
      this.modalValue = false;
      this.modalValue1 = false;
      this.modalValue2 = false;
      this.modalValue3 = false;
    },
    callLogout() {
      this.logoutFromPassword = true;
    },
    async getUserName() {
      const response = await UserService.fetchUserByID(
        this.$store.getters.userId,
      );
      this.userName = response.data[0].firstName;
    },
    capitalizeFirst(val) {
      return functions.capitalizeFirstLetter(val);
    },
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
    },
  },
};
</script>

<style>
.topbar_bg {
  background: url("../assets/topbar.png");
  background-size: contain;
  background-position: top left;
  background-repeat: no-repeat;
  padding-top: 50px;
}
.options-list {
  width: 189.76px;
}
.changeLogs {
  width: 825px !important;
  background: white;
}
.c4.doc-content {
  max-width: unset !important;
  padding: 20px !important;
}
</style>
