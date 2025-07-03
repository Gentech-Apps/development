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
              <q-card class="add-skills-model q-pa-md">
                <div class="row">
                  <div
                    class="q-gutter-md q-pl-md col-6"
                    style="max-width: 300px"
                  >
                    <q-input
                      outlined
                      dense
                      v-model="skillName"
                      lazy-rules
                      :rules="[
                        (val) =>
                          (val && val.length > 0) || 'Please enter skill Name',
                      ]"
                      label="Enter Skill Name"
                    />
                  </div>
                  <div
                    class="q-gutter-md q-pl-md col-6"
                    style="max-width: 300px"
                  >
                    <q-select
                      outlined
                      v-model="department"
                      :options="optionDepartments"
                      label="Select Department"
                      dense
                      use-input
                      input-debounce="0"
                      @filter="filterUser"
                    />
                  </div>
                </div>

                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="white"
                      textColor="primary"
                      flat
                      label="cancel"
                      @click="close"
                    />
                    <q-btn type="submit" color="primary" label="Submit" />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import * as skillDepartmentService from "../../services/skillDepartment.service";
import * as skillService from "../../services/skills.service";

export default {
  data() {
    return {
      layoutValue: false,
      skillName: "",
      department: null,
      departmentOptions: [],
      optionDepartments: [],
    };
  },
  methods: {
    close() {
      this.skillName = "";
      this.department = null;
      this.$emit("layoutFalse");
    },
    filterUser(val, update) {
      if (val === "") {
        update(() => {
          this.optionDepartments = this.departmentOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionDepartments = [];
        this.departmentOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionDepartments.push(option);
          }
        });
      });
    },
    async onSubmit() {
      const res = await skillService.addSkill({
        name: this.skillName,
        department: this.department.value,
      });
      this.close();
    },
    async getAllSkillDepartments() {
      const response = await skillDepartmentService.fetchAllSkillDepartments();
      response.data.forEach((department) => {
        this.departmentOptions.push({
          label: department.name,
          value: department._id,
        });
      });
    },
  },
  async mounted() {
    this.getAllSkillDepartments();
  },
  props: ["layout"],
  watch: {
    layout: function (newVal) {
      this.layoutValue = newVal;
    },
  },
};
</script>

<style>
.q-dialog__inner .add-skills-model {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px !important;
}
</style>
