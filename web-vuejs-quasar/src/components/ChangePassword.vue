<template>
  <q-dialog
    v-model="layout"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <div>
      <q-form @submit="onSubmit">
        <q-card style="width: 500px">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-center q-px-sm">Change Password</div>
          </q-card-section>
          <div>
            <div class="q-px-md q-mt-md row">
              <div class="col-10">
                <q-input
                  outlined
                  dense
                  type="password"
                  v-model="oldPassword"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Please enter password of Minimum 6 Character',
                  ]"
                  label="Old Password"
                />
              </div>
            </div>
            <div class="q-px-md q-mt-md row">
              <div class="col-10">
                <q-input
                  outlined
                  dense
                  type="password"
                  v-model="newPassword"
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length >= 6) ||
                      'Please enter password of Minimum 6 Character',
                  ]"
                  label="New Password"
                />
              </div>
            </div>
            <div class="q-px-md q-mt-md row">
              <div class="col-10">
                <q-input
                  outlined
                  dense
                  type="password"
                  v-model="confirmPassword"
                  lazy-rules
                  :rules="[
                    (val) =>
                      isPasswordMatching() ||
                      'New password and confirm password not matching',
                  ]"
                  label="Confirm password"
                />
              </div>
            </div>
          </div>
          <div>
            <q-card-actions class="justify-end">
              <q-btn color="negative" flat label="cancel" @click="close" />
              <q-btn flat type="submit" color="primary" label="Submit" />
            </q-card-actions>
          </div>
        </q-card>
      </q-form>
    </div>
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
            Something went wrong!
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none"> {{ errorMessage }} </q-card-section>

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
  </q-dialog>
</template>

<script>
import * as usersService from "../services/users.service";

export default {
  data() {
    return {
      layout: false,
      errorLayout: false,
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  props: ["modal"],
  watch: {
    modal: function (value) {
      if (value) {
        this.layout = true;
      } else {
        this.layout = false;
      }
    },
  },
  methods: {
    close() {
      this.layout = false;
      this.newPassword = "";
      this.oldPassword = "";
      this.confirmPassword = "";
      this.$emit("onClose", this.layout);
    },
    isPasswordMatching() {
      if (
        this.newPassword.trim() !== "" &&
        this.confirmPassword.trim() !== "" &&
        this.newPassword == this.confirmPassword
      ) {
        return true;
      } else {
        return false;
      }
    },
    async onSubmit() {
      let requestData = {
        userId: this.$store.getters.userId,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };
      this.$q.loading.show();

      const res = await usersService.changePassword(requestData);

      this.$q.loading.hide();

      if (res.status !== 200) {
        this.errorLayout = true;
        this.errorMessage = res.data;
      } else {
        this.close();
        this.$emit("callLogout");
      }
    },
  },
};
</script>
