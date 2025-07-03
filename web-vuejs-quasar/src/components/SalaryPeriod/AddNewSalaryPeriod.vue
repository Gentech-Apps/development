<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-dialog
          v-model="layoutValue"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div>
            <q-form @submit="onSubmit" action="./users">
              <q-card style="width: 800px">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 text-center q-px-sm q-pb-md">
                    Add Salary Period
                  </div>
                </q-card-section>
                <q-card-section class="q-pb-none">
                  <div
                    class="text-h6 q-px-sm q-pb-md"
                    style="padding-left: 25px !important"
                  >
                    {{ user }}
                  </div>
                </q-card-section>
                <div
                  style="max-height: 75vh; overflow-y: auto"
                  @scroll="scrollDropDown"
                >
                  <div class="q-pl-lg q-mt-md row">
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    ></div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        :disable="user != null"
                        v-model="user"
                        label="UserName"
                      />
                    </div>
                  </div>
                  <div class="q-pl-lg q-mt-md row">
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        dense
                        v-model="gross"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter Gross salary',
                          (val) =>
                            /^[0-9]*$/.test(val) || 'Please Enter Numbers Only',
                        ]"
                        label="Gross Salary"
                      />
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-select
                        outlined
                        dense
                        v-model="salaryGrade"
                        :options="['G1', 'G2', 'G3', 'G4']"
                        label="Select Salary Grade"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please select Salary Grade.',
                        ]"
                      >
                      </q-select>
                    </div>
                    <div
                      class="q-gutter-md col-4 q-pl-md"
                      style="max-width: 300px"
                    >
                      <q-input
                        outlined
                        v-model="effdatefrom"
                        lazy-rules
                        label="Effective Date"
                        dense
                        readonly
                        @click="$refs.qeffdatefrom.show()"
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'Please enter next appraisal date.',
                        ]"
                      >
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qeffdatefrom"
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="effdatefrom"
                                minimal
                                mask="DD/MM/YYYY"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Ok"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="negative"
                      flat
                      label="cancel"
                      @click="close"
                    />
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
                  <q-icon
                    name="warning"
                    class="text-white"
                    style="font-size: 2rem"
                  />
                  Invalid data
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                {{ errMsg }}
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
        </q-dialog>
      </div>
    </div>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import * as functions from "../../services/functions";
import * as salaryPeriod from "../../services/masterSalary.service";
import Notify from "../Notify.vue";

export default {
  components: { Notify },
  data() {
    return {
      salaryGrade: null,
      createdDate: null,
      user: null,
      effdatefrom: null,
      gross: null,
      layoutValue: false,
      userID: null,
      successMsg: "",
      clearSuccessMsg: "",
    };
  },
  props: ["addlayout", "userId", "userName"],
  watch: {
    addlayout: function (newVal) {
      this.layoutValue = newVal;
    },
    userId: function (newVal) {
      this.userID = newVal;
    },
    userName: function (newVal) {
      this.user = newVal;
    },
  },

  methods: {
    close() {
      this.salaryGrade = null;
      (this.user = null),
        (this.effdatefrom = null),
        (this.createdDate = null),
        (this.layoutValue = false),
        (this.userID = null),
        this.$emit("layoutFalse");
    },
    async onSubmit() {
      const newSalaryPeriod = {
        dates: {
          effectiveDateFrom: functions.convertDateToUTC(this.effdatefrom),
        },
        user: this.userID,
        grossSalary: this.gross,
        grade: this.salaryGrade,
      };
      const res = await salaryPeriod.setUserSalaryPeiod(newSalaryPeriod);
      this.close();
      this.successMsg = "User Salary Period Added Successfully!!";
      this.$emit("reloadUser");
    },
    async mounted() {},
  },
};
</script>

<style scoped>
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}
</style>
