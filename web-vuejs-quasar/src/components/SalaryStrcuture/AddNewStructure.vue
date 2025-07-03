<template>
  <div>
    <div>
      <div class="q-ml-lg q-gutter-sm" style="position: relative">
        <q-btn
          flat
          label="Add New Structure"
          color="primary"
          @click="onAddNewUser"
        />

        <div>
          <q-dialog :persistent="true" v-model="layout">
            <q-card class="add-modal-timesheet q-py-sm">
              <q-form @submit="onSubmit">
                <div>
                  <q-card-section>
                    <div class="row">
                      <div
                        class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-md"
                      >
                        Add Structure
                      </div>
                      <div class="col-md-6 col-sm-6 col-xs-12 text-h6">
                        <q-input
                          outlined
                          v-model="strcutureName"
                          label="Strcucture Name"
                          lazy-rules
                          dense
                          style="max-width: 300px"
                        >
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>
                </div>

                <div style="max-height: 250px; overflow-y: auto">
                  <q-card
                    v-for="field in salaryBreakOut"
                    :key="field.label"
                    class="q-mx-lg q-my-md"
                    style="border-radius: 15px"
                  >
                    <q-card-section>
                      <div class="fs--16">
                        {{ capitalizeFirst(field.label) }}
                      </div>
                      <div
                        class="row"
                        v-for="(detail, idx) in field.detail"
                        :key="detail.detailId"
                      >
                        <div class="col-4">
                          <div class="q-pr-md q-py-md resize-textarea">
                            <q-input
                              style="margin-top: -15px"
                              v-model="detail.description"
                              outlined
                              type="textarea"
                              placeholder="Description"
                              autogrow
                              :rules="[
                                (val) =>
                                  (val && val.length > 0) ||
                                  'Please type something',
                              ]"
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="q-pr-md q-py-md resize-textarea">
                            <q-input
                              style="margin-top: -15px"
                              v-model="detail.description"
                              outlined
                              type="textarea"
                              placeholder="Description"
                              autogrow
                              :rules="[
                                (val) =>
                                  (val && val.length > 0) ||
                                  'Please type something',
                              ]"
                            />
                          </div>
                        </div>
                        <div class="col-4">
                          <div>
                            <q-input
                              outlined
                              placeholder="hh:mm"
                              v-model="detail.timeSpent"
                              mask="time"
                              :rules="[
                                (val) =>
                                  val != '00:00' ||
                                  'time should be more than 0',
                                (val) =>
                                  totalTime < 1440 ||
                                  'Please enter time < 24 hours',
                                (val) =>
                                  !!val || 'Please enter time spent on task',
                                (val) =>
                                  /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(
                                    val,
                                  ) || 'Please enter valid time',
                              ]"
                            >
                            </q-input>
                          </div>

                          <div class="q-pb-sm" style="float: right">
                            <q-btn
                              flat
                              v-if="idx > 0"
                              round
                              color="negative"
                              icon="delete"
                              @click="
                                remove(project.projectId, detail.detailId)
                              "
                            >
                              <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="bg-tip shadow-1"
                                :offset="[10, 10]"
                              >
                                Remove
                              </q-tooltip>
                            </q-btn>
                            <q-btn
                              flat
                              round
                              color="primary"
                              v-if="project.detail.length - 1 == idx"
                              icon="add"
                              class="q-ml-md"
                              @click="add(project.projectId)"
                            >
                              <q-tooltip
                                anchor="top middle"
                                self="bottom middle"
                                class="bg-tip shadow-1"
                                :offset="[10, 10]"
                              >
                                Add
                              </q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <!-- <q-separator class="q-mt-sm" /> -->
                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="negative"
                      flat
                      v-close-popup
                      label="cancel"
                      @click="onClose"
                    />
                  </q-card-actions>
                </div>
              </q-form>
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
                  <q-icon
                    name="warning"
                    class="text-white"
                    style="font-size: 2rem"
                  />
                  Invalid Date
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      strcutureName: "",
      salaryBreakOut: [],
      salaryDeduction: [],
      layout: false,

      successMsg: "",
    };
  },
  watch: {
    strcutureName: function (newVal) {
      console.log(newVal);
    },
    salaryBreakOut: {
      handler: function (newValue) {
        this.totalTime = 0;
        newValue.forEach((data) => {
          data.detail.forEach((detailData) => {
            const hours = detailData.timeSpent.substring(0, 2);
            const minutes = detailData.timeSpent.substring(3, 5);

            this.totalTime += Number(hours) * 60 + Number(minutes);
            this.hours =
              Math.floor(Number(this.totalTime) / 60) > 9
                ? Math.floor(Number(this.totalTime) / 60)
                : "0" + Math.floor(Number(this.totalTime) / 60);
            this.minutes =
              Math.floor(Number(this.totalTime) % 60) > 9
                ? Math.floor(Number(this.totalTime) % 60)
                : "0" + Math.floor(Number(this.totalTime) % 60);
          });
        });
      },
      deep: true,
    },
    salaryDeduction: {
      handler: function (newValue) {
        this.totalTime = 0;
        newValue.forEach((data) => {
          data.detail.forEach((detailData) => {
            const hours = detailData.timeSpent.substring(0, 2);
            const minutes = detailData.timeSpent.substring(3, 5);

            this.totalTime += Number(hours) * 60 + Number(minutes);
            this.hours =
              Math.floor(Number(this.totalTime) / 60) > 9
                ? Math.floor(Number(this.totalTime) / 60)
                : "0" + Math.floor(Number(this.totalTime) / 60);
            this.minutes =
              Math.floor(Number(this.totalTime) % 60) > 9
                ? Math.floor(Number(this.totalTime) % 60)
                : "0" + Math.floor(Number(this.totalTime) % 60);
          });
        });
      },
      deep: true,
    },
  },
  methods: {
    onAddNewUser() {
      this.layout = true;
    },

    close() {
      this.pass = "password";
      this.layout = false;
      this.check = true;
      this.firstName = "";
      this.lastName = "";
      this.gender = "";
      this.mentor = "";
      this.genesisEmail = "";
      this.googleEmail = "";
      this.password = "";
      this.selectedUserType = null;
      this.selectDepartment = [];
      this.biometricId = "";
      this.skypeId = "";
      this.arr = [];
      this.userTypes = ["User", "Mentor", "Manager", "Admin"];
      this.msg = [];
      this.googlemsg = [];
      this.image = [];
      this.imageConverted =
        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png";
      this.blob = "";
      (this.empId = ""), (this.mobileNumber = "");
      this.date = "";
      this.dateofbirth = "";
      this.nextAppraisalDate = "";
      this.lastAppraisalDate = "";
      this.userGrade = null;
      (this.panNumber = null), (this.adharNumber = null);
    },

    clearSuccessMsg() {
      this.successMsg = "";
    },
  },
};
</script>

<style scoped>
.q-dialog__inner--minimized > div {
  max-width: unset !important;
}
</style>
