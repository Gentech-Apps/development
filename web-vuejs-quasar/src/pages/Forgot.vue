<template>
  <div>
    <q-card class="my-card absolute-center" style="min-width: 300px !important">
      <div class="q-ml-sm">
        <q-card-section>
          <div class="text-center">
            <img
              src="../../public/pegasus_with_bg.png"
              alt=""
              class=""
              style="width: 350px"
            />
          </div>
        </q-card-section>

        <q-form @submit="onSubmit">
          <q-card-actions vertical>
            <div class="q-my-sm q-pa-md">
              <div>
                <div id="emailvalue">
                  <q-input
                    type="email"
                    v-model="email"
                    outlined
                    lazy-rules
                    :rules="[
                      (val) => (val && val.length > 0) || 'Please enter email',
                      (val) =>
                        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                          val,
                        ) || 'Invalid Email',
                    ]"
                    label="Enter Email"
                    @update:model-value="loginEmail"
                    data-id="forgotpassword-enteremail"
                  />
                </div>
              </div>
            </div>
            <q-card-section
              class="text-center text-primary primary q-px-xl q-py-none no-margin"
            >
              <span
                class="cursor-pointer"
                @click="login"
                data-id="forgotpassword-login"
                >Login</span
              >
            </q-card-section>
            <div class="text-center">
              <q-btn
                type="submit"
                class="q-my-md loginbtn"
                size="md"
                label="Forgot Password"
                color="primary"
                data-id="forgotpassword-forgotpasswordbutton"
              />
            </div>
          </q-card-actions>
        </q-form>
      </div>
    </q-card>

    <div>
      <!-- error dialog -->
      <q-dialog
        v-model="errorModal"
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
                data-id="forgotpassword-error"
              />
              {{ errorTitle }}
            </div>
          </q-card-section>

          <q-card-section
            class="q-pt-none"
            data-id="forgotpassword-error-message"
          >
            {{ errorMsg }}
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn
              flat
              color="negative"
              label="OK"
              @click="errorModal = false"
              data-id="forgotpassword-errorpopup-ok"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- success dialog -->
      <q-dialog
        v-model="successModal"
        persistent
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card class="bg-primary text-white login-error">
          <q-card-section>
            <div class="text-h6">
              <q-icon
                name="check_circle_outline"
                class="text-white"
                style="font-size: 2rem"
                data-id="forgotpassword-message"
              />
              {{ successTitle }}
            </div>
          </q-card-section>

          <q-card-section
            class="q-pt-none"
            data-id="forgotpassword-success-message"
          >
            {{ successMsg }}
          </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn
              flat
              color="primary"
              label="OK"
              @click="successModal = false"
              data-id="forgotpassword-okbutton"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import * as usersService from "../Users../../services/users.service";

export default {
  name: "Forgot",
  data() {
    return {
      errorModal: false,
      successModal: false,
      email: "",
      msg: [],
      check: true,
      errorTitle: "",
      errorMsg: "",
      successTitle: "",
      successMsg: "",
      internetConn: navigator.onLine,
    };
  },
  methods: {
    loginEmail() {
      if (this.email[this.email.length - 1] == "@") {
        this.email += "genesistechnologies.in";
      }
    },
    login() {
      this.$router.push("/login");
    },
    async onSubmit() {
      this.$q.loading.show();
      try {
        if (this.internetConn) {
          const response = await usersService.forgotPassword({
            email: this.email,
          });
          this.$q.loading.hide();
          if (
            response.data.error ===
              "Your email is not registered, Please contact your admin" ||
            response.data.error === "something is invalid" ||
            response.data.error === "reset password link error"
          ) {
            this.prepareLoginError("Oops", response.data.error);
          } else {
            var result = response.data.message;
            this.prepareSuccessDialog("Message", response.data.message);
            //window.location.href = "/";
          }
        } else {
          this.$q.loading.hide();
          this.prepareLoginError(
            "No internet",
            "Please check your internet connection and try again",
          );
          var intervalId = setInterval(() => {
            if (navigator.onLine) {
              this.internetConn = navigator.onLine;
              this.errorModal = false;
              clearInterval(intervalId);
            }
          }, 1000);
        }
      } catch (e) {
        this.$q.loading.hide();
        this.prepareLoginError(
          "System Error",
          "Error in login, Please get in contact with the system Administrator.",
        );
      }
    },
    prepareLoginError(title, msg) {
      this.errorModal = true;
      this.errorTitle = title;
      this.errorMsg = msg;
    },
    prepareSuccessDialog(title, msg) {
      this.successModal = true;
      this.successTitle = title;
      this.successMsg = msg;
    },
  },
};
</script>

<style lang="css" scoped>
.my-card {
  width: 100%;
  max-width: 35vw;
  height: fit-content;
}
.loginbtn {
  width: 220px;
  height: 35px;
}
.login-error {
  height: fit-content;
  max-height: 50vh;
  width: 100%;
  max-width: 500px;
}
</style>
