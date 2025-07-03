<template>
  <div id="q-app">
    <MainLayout />
    <q-dialog
      style="z-index: 999999"
      v-model="userDataChanged"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white login-error">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="warning" class="text-white" style="font-size: 2rem" />
            <span v-if="this.modalType"> User Data Changed </span>
            <span v-else> Invalid Machine Time </span>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <span v-if="this.modalType">
            We noticed that your user's data was changed. Please re-login to
            continue. Sorry for the Inconvenience.
          </span>
          <span v-else>
            Looks like your machine time has been changed, please reset it or
            Login again!.
          </span>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat color="negative" label="OK" @click="confirmedChange" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="errorModal"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white login-error">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="warning" class="text-white" style="font-size: 2rem" />
            {{ errorTitle }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ errorMsg }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat color="negative" label="OK" @click="refreshPage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<style>
#q-app {
  background: white;
}
</style>
<script>
import MainLayout from "./layouts/MainLayout.vue";
import * as timesheetsService from "./services/timesheets.service";
import * as usersService from "./services/users.service";
export default {
  name: "App",
  components: {
    MainLayout,
  },
  methods: {
    confirmedChange() {
      this.logout();
      this.$router.push("/login");
      this.userDataChanged = false;
      this.modalType = true;
    },
    async getMentees() {
      if (
        this.$store.getters.isAuthenticated &&
        (this.$store.getters.userType == "mentor" ||
          this.$store.getters.userType == "manager" ||
          this.$store.getters.userType == "admin")
      ) {
        const result = await usersService.getMyMentees(
          this.$store.getters.userId,
        );
        const mentees = result.data;
        const user = this.$store.getters.user;
        user.mentees = mentees;
        this.$store.commit("setUser", user);
      }
    },
    async getUser() {
      if (this.$store.getters.isAuthenticated) {
        const result = await usersService.fetchUserByID(
          this.$store.getters.userId,
        );
        const user = result?.data[0];
        if (user.deleted || user.userType != this.$store.getters.userType) {
          this.userDataChanged = true;
          this.modalType = true;
          this.$q.loading.hide();
        } else if (user) {
          this.$store.commit("setUser", result?.data[0]);
        }
      }
    },
    async checkTime() {
      const currentDate = new Date();
      try {
        const serverDateResponse = await timesheetsService.getServerDate();
        const serverDate = new Date(serverDateResponse.data);
        const timeDifference = Math.abs(currentDate - serverDate);
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        if (minutesDifference >= 1) {
          this.userDataChanged = true;
          this.modalType = false;
          this.logout();
        }
      } catch (error) {
        console.log(error);
      }
    },
    logout() {
      localStorage.removeItem("vuex");
      this.$store.commit("setLogout", false);
      this.$store.commit("setUser", null);
      this.$store.commit("setToken", null);
    },
    prepareLoginError(title, msg) {
      this.errorModal = true;
      this.errorTitle = title;
      this.errorMsg = msg;
    },
    refreshPage() {
      window.location.reload();
    },
  },
  data() {
    return {
      userDataChanged: false,
      errorModal: false,
      errorTitle: "",
      errorMsg: "",
      serverDate: new Date(),
      modalType: true,
    };
  },
  computed: {
    logoutVal() {
      return this.$store.getters.logout;
    },
  },
  watch: {
    logoutVal: function (newVal) {
      if (newVal) {
        this.$q.loading.hide();
        this.userDataChanged = true;
      }
    },
  },
  async mounted() {
    window.addEventListener("focus", this.checkTime);
    window.addEventListener("click", this.checkTime);
    await this.getUser();
    await this.getMentees();
  },
  created() {
    window.mobilecheck = function () {
      var check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
            a,
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4),
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    };
    if (mobilecheck && "ontouchstart" in window) {
      this.prepareLoginError(
        "UnSupported Device",
        "you must use either desktop or laptop to this site",
      );
    }
  },
};
</script>
<style>
#context-navigation,
#context-sep-navigation {
  display: none !important;
}
</style>
