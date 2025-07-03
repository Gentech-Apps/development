<template>
  <div>
    <q-list class="q-py-sm">
      <div class="overflow-auto scroll-area select-list-box">
        <q-dialog
          v-model="editLayout"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div style="width: 25%">
            <q-form @submit="onSubmit">
              <q-card class="add-skills-model q-pa-lg">
                <div class="row justify-center">
                  <q-input
                    style="width: 100%"
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
        <div v-for="(data, index) in selectedData" :key="index">
          <q-item
            scroll
            clickable
            v-ripple
            :active="link === data"
            @click="link = data"
            active-class="my-menu-link"
            class="q-pa-none"
          >
            <q-item-section>
              <q-item-label
                @click="OnSelect(data.id)"
                class="text-subtitle2 text-weight-medium"
                style="padding: 16px"
                active-class="text-orange-10 mnu_active"
                >{{ data.fname }} {{ data.lname }}</q-item-label
              >
            </q-item-section>
            <q-item-section avatar v-if="pId == 1" class="q-mr-sm">
              <q-icon name="edit" @click="editSkills(data, true)" />
            </q-item-section>
          </q-item>
          <q-separator class="q-mx-auto change-select-list-separator" />
        </div>
      </div>
    </q-list>
  </div>
</template>

<script>
import * as skillService from "../../services/skills.service";

export default {
  name: "SelectorList",
  data() {
    return {
      link: "inbox",
      languages: [],
      editLayout: false,
      skillName: "",
      skillId: "",
    };
  },

  methods: {
    async editSkills(value, flag) {
      this.editLayout = flag;
      this.skillName = value.fname;
      this.skillId = value.id;
    },
    async close() {
      this.editLayout = false;
    },
    async onSubmit() {
      const res = await skillService.updateBySkillId({
        id: this.skillId,
        name: this.skillName,
      });
      this.close();
      location.reload();
    },
    async OnSelect(value) {
      this.$emit("userId", value);
    },
  },
  props: ["selectedData", "pId"],
};
</script>

<style>
.my-menu-link {
  color: white;
  background-color: blue;
}
.select-list-box {
  border: 2px solid #dadada;
  outline: none;
  height: 404px;
}
.change-select-list-separator {
  width: 95%;
}
.q-dialog__inner .add-skills-model {
  height: fit-content;
  max-height: 85vh;
  width: 100%;
  max-width: 800px !important;
}
</style>
