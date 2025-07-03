<template>
  <div>
    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-7">
        <q-input
          outlined
          v-model="projectFilter"
          class="q-ma-sm bg-white"
          label="Search by Project or Client"
          lazy-rules
          clearable
          dense
        >
          <template v-slot:append>
            <q-icon name="search" class="cursor-pointer"> </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-md-9 col-sm-9 col-xs-5 q-pt-sm">
        <q-btn
          flat
          class="btn-md float-right"
          @click="addClientDialog = true"
          color="primary"
          align="right"
          label="Add Client"
        />
        <!-- Add Client Model -->
        <q-dialog
          v-model="addClientDialog"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div style="width: 25%">
            <q-form @submit="onClientSubmit">
              <q-card class="add-skills-model q-pa-md">
                <div>
                  <q-card-section class="q-pt-sm q-pb-none">
                    <div class="row">
                      <div
                        class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center q-mb-sm"
                      >
                        Add Client
                      </div>
                    </div>
                  </q-card-section>
                </div>
                <div class="row justify-center">
                  <q-input
                    style="width: 100%"
                    outlined
                    dense
                    v-model="clientName"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter client Name',
                    ]"
                    label="Enter Client Name"
                  />
                </div>

                <div>
                  <span><strong>Organization Event</strong> (Optional)</span>
                  <q-checkbox
                    v-model="checkbox"
                    class="q-ml-auto"
                    color="primary"
                  />
                </div>

                <div class="q-pt-none">
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="negative"
                      flat
                      label="cancel"
                      @click="closeAddClientDialog"
                    />
                    <q-btn
                      flat
                      id="addClient"
                      type="submit"
                      color="primary"
                      label="Submit"
                    />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
          <q-dialog
            v-model="errorLayoutClient"
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
                  @click="errorLayoutClient = false"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-dialog>
        <!-- edit client model -->
        <q-dialog
          v-model="editClientDialog"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <div style="width: 25%">
            <q-form @submit="onEditClientSubmit">
              <q-card class="add-skills-model q-pa-lg">
                <div class="row justify-center">
                  <q-input
                    style="width: 100%"
                    outlined
                    dense
                    v-model="editClientName"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter client Name',
                    ]"
                    label="Enter Client Name"
                  />
                </div>

                <div>
                  <q-card-actions class="justify-end">
                    <q-btn
                      color="white"
                      textColor="primary"
                      flat
                      label="cancel"
                      @click="editClientDialog = false"
                    />
                    <q-btn
                      id="editClient"
                      flat
                      type="submit"
                      color="primary"
                      label="Submit"
                    />
                  </q-card-actions>
                </div>
              </q-card>
            </q-form>
          </div>
        </q-dialog>
        <!-- Add Project Model -->
        <q-dialog persistent v-model="addProject">
          <q-card class="addProjectDailog">
            <q-card-section>
              <div class="text-h6 q-px-sm text-center">
                {{ setDataForEdit != null ? "Update Project" : "Add Project" }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-form ref="addProjectref" @submit.prevent="onSubmit">
                <div class="row q-mb-sm">
                  <div class="col-6 q-px-sm">
                    <q-select
                      readonly
                      new-value-mode="add-unique"
                      dense
                      outlined
                      v-model="client"
                      :options="optionClients"
                      label="Client"
                      use-chips
                      input-debounce="0"
                      @new-value="createValue"
                      @filter="filterFn"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-italic text-grey">
                            No clients available
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-6 q-px-sm">
                    <q-input
                      dense
                      outlined
                      v-model="project"
                      label="Project"
                      clearable
                      :rules="[
                        (val) =>
                          (val && val.length > 0) ||
                          'Please enter project name',
                      ]"
                    />
                  </div>
                </div>
                <div class="row q-mb-sm">
                  <div class="col-6 q-px-sm">
                    <q-select
                      outlined
                      v-model="user"
                      :options="optionUsers"
                      label="Person Of Contact"
                      dense
                      use-input
                      use-chips
                      input-debounce="0"
                      @filter="filterUser"
                      :rules="[
                        (val) => !!val || 'Please select a person of contact',
                      ]"
                    />
                  </div>
                  <div class="col-6 q-px-sm">
                    <q-select
                      outlined
                      v-model="lead"
                      :options="optionLeads"
                      label="Lead"
                      dense
                      use-input
                      use-chips
                      input-debounce="0"
                      @filter="filterLead"
                      :rules="[(val) => !!val || 'Please select a lead']"
                    />
                  </div>
                </div>
                <q-card-actions align="right" class="q-px-md">
                  <q-btn
                    flat
                    label="Cancel"
                    color="negative"
                    @click="resetAll"
                  />
                  <q-btn
                    flat
                    id="addEditProjectSubmit"
                    type="submit"
                    label="Submit"
                    color="primary"
                  />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
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
    <Notify :successMsg="successMsg1" @clearSuccessMsg="clearSuccessMsg1" />
  </div>
</template>

<script>
import * as clientsService from "../../services/clients.service";
import * as usersService from "../../services/users.service";
import * as skillsService from "../../services/skills.service";
import * as skillRatingsService from "../../services/skillRatings.service";
import * as projectsService from "../TimeSheets../../../services/projects.service";
import Notify from "../Notify.vue";

export default {
  name: "FilterTeams",
  components: { Notify },
  created() {
    this.getAllClients();
    this.getAllUsers();
    this.getAllSkills();
  },
  watch: {
    skill: function (skillObj) {
      this.userFromSkill = [];
      if (this.skill != null) {
        this.getAllUserBySkill(skillObj.value);
      }
    },
    projectFilter: function (searchStr) {
      this.$emit("searchProject", searchStr);
    },
    getProjectIdForEdit: function (value) {
      this.clientReadOnly = false;
      this.setDataForEdit = value;
      this.optionClients.forEach((row) => {
        if (row.value === this.setDataForEdit.clientId) {
          this.client = row;
        }
      });
      this.optionUsers.forEach((row) => {
        if (row.value === this.setDataForEdit.project.poc.id) {
          this.user = row;
        }
      });
      this.optionLeads.forEach((row) => {
        if (row.value === this.setDataForEdit.project.lead.id) {
          this.lead = row;
        }
      });
      this.optionSkills.forEach((row) => {
        if (this.setDataForEdit.project.skill !== undefined) {
          if (row.value === this.setDataForEdit.project.skill.id) {
            this.skill = row;
          }
        }
      });
      this.project = this.setDataForEdit.project.name;
      this.addProject = true;
    },
    getClientIdForAdd: function (value) {
      this.clientReadOnly = true;
      this.client = { label: value.clientName, value: value.clientId };
      this.addProject = value.addProject;
    },
    getEditClientInfo: function (value) {
      this.editClientName = value.editClientName;
      this.editClientId = value.editClientId;
      this.editClientDialog = value.editClientDialog;
    },
    getActiveInactiveClientInfo: function (value) {
      const res = clientsService.updateClientStatus({
        id: value.editActiveInactiveClientId,
        isActive: value.editActiveInactiveClient,
      });
      res.then((data) => {
        if (data.status == 200) {
          this.$emit("refreshGetAllProject");
          if (value.editActiveInactiveClient) {
            this.successMsg = "Client Activated!!";
          } else {
            let allProjectInactivated = true;
            for (
              let index = 0;
              index < value.clientInfo.project.length;
              index++
            ) {
              const element = value.clientInfo.project[index];
              element.projectIsActive ? (allProjectInactivated = false) : "";
            }
            this.successMsg = "Client Inactivated!!";
            this.successMsg1 = !allProjectInactivated
              ? "Project Inactivated!!"
              : "";
          }
        }
      });
    },
    getLeaveShowOrNotClient: function (value) {
      const res = clientsService.updateClientStatusByLeaveShow({
        clientId: value.clientId,
        isLeaveShow: value.isLeaveShow,
      });
      res
        .then((data) => {
          if (data.status == 200) {
            this.$emit("refreshGetAllProject");
            this.successMsg = value.isLeaveShow
              ? "Marked Organizational Event!!"
              : "Removed Organizational Event!!";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getActiveInactiveProjectInfo: function (value) {
      let object = {
        isActive: value.projectIsActive,
      };
      let project_id = value.projectId;
      const response = projectsService.updateProjectStatus(project_id, object);
      response.then((data) => {
        if (data.status == 200) {
          this.$emit("refreshGetAllProject");
          if (value.projectIsActive) {
            this.successMsg = "Project Activated!!";
          } else {
            this.successMsg = "Project Inactivated.";
          }
          this.successMsg1 =
            value.projectIsActive && !value.clientStatus
              ? "Client Activated!"
              : "";
        }
      });
    },
  },
  props: [
    "getProjectIdForEdit",
    "getClientIdForAdd",
    "getEditClientInfo",
    "getActiveInactiveClientInfo",
    "getActiveInactiveProjectInfo",
    "getLeaveShowOrNotClient",
  ],
  data() {
    return {
      ratingColors: [
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
        "primary",
        "secondary",
      ],
      setDataForEdit: null,
      projectFilter: "",
      addProject: false,
      client: null,
      project: "",
      skill: null,
      user: null,
      lead: null,
      addClientDialog: false,
      clientName: "",
      checkbox: false,
      clientReadOnly: false,
      editClientName: "",
      editClientId: "",
      errMsg: "",
      errorLayout: false,
      errorLayoutClient: false,
      editClientDialog: false,
      clientOptions: [],
      optionClients: [],
      newClient: "",
      usersBySkillColumns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "skill",
          align: "left",
          label: "Skill",
          field: "skill",
          sortable: true,
        },
        {
          name: "rate",
          align: "left",
          label: "Rating",
          field: "rate",
          sortable: true,
        },
        { name: "lead", align: "left", label: "", field: "" },
      ],
      usersBySkill: [],
      userFromSkill: [],
      skillOptions: [],
      optionSkills: [],
      userOptions: [],
      optionUsers: [],
      optionLeads: [],
      successMsg: "",
      successMsg1: "",
    };
  },
  methods: {
    getLeadValue(leadId, leadName) {
      this.userOptions.forEach((row) => {
        if (row.label === leadName) {
          this.lead = row;
        }
      });
    },
    async getAllClients() {
      this.$q.loading.show();
      this.clientOptions = [];
      const response = await clientsService.fetchAllClients();
      response.data.forEach((client) => {
        this.clientOptions.push({
          label: client.name,
          value: client._id,
        });
      });
      this.optionClients = this.clientOptions;
      if (this.newClient !== "") {
        this.setNewClient();
      }
      this.$q.loading.hide();
    },
    async getAllUsers() {
      this.userOptions = [];
      const response = await usersService.fetchUsers();
      response.data.forEach((user) => {
        if (user.isActive) {
          this.userOptions.push({
            label: user.firstName + " " + user.lastName,
            value: user._id,
          });
        }
      });

      this.optionUsers = this.userOptions;
      this.optionLeads = this.userOptions;
    },
    async getAllSkills() {
      this.skillOptions = [];
      const response = await skillsService.fetchAllSkills();
      response.data.forEach((skill) => {
        this.skillOptions.push({
          label: skill.name,
          value: skill._id,
        });
      });
      this.optionSkills = this.skillOptions;
    },
    async getAllUserBySkill(skill_id) {
      this.usersBySkill = [];
      const response = await skillRatingsService.fetchAllUsersBySkill(skill_id);
      response.data.forEach((users) => {
        this.usersBySkill.push({
          id: users.userId,
          name: users.user,
          skill: users.skill,
          rate: users.rating,
        });
      });
      this.userFromSkill = this.usersBySkill;
    },
    async createValue(val, done) {
      var addNew = 1;
      if (val.length > 2) {
        this.clientOptions.forEach((option) => {
          if (option.label.toString().toLowerCase() === val.toLowerCase()) {
            addNew = 0;
          }
        });

        if (addNew == 1) {
          const prepareObj = {
            name: val,
            deleted: false,
          };
          await clientsService.addClient(prepareObj);
          this.getAllClients();
          this.newClient = val;
        }
      }
    },
    setNewClient() {
      this.client = this.optionClients
        .filter(
          (client) =>
            client.label.toLowerCase().indexOf(this.newClient.toLowerCase()) >
            -1,
        )
        .shift();
    },
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.optionClients = this.clientOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionClients = [];
        this.clientOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionClients.push(option);
          }
        });
      });
    },
    filterUser(val, update) {
      if (val === "") {
        update(() => {
          this.optionUsers = this.userOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionUsers = [];
        this.userOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionUsers.push(option);
          }
        });
      });
    },
    filterLead(val, update) {
      if (val === "") {
        update(() => {
          this.optionLeads = this.userOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionLeads = [];
        this.userOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionLeads.push(option);
          }
        });
      });
    },
    filterSkill(val, update) {
      if (val === "") {
        update(() => {
          this.optionSkills = this.skillOptions;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.optionSkills = [];
        this.skillOptions.forEach((option) => {
          if (option.label.toString().toLowerCase().indexOf(needle) > -1) {
            this.optionSkills.push(option);
          }
        });
      });
    },
    async onSubmit(event) {
      let object = "";
      if (this.skill == null) {
        object = {
          name: this.project.trim(),
          client: this.client.value,
          POC: this.user.value,
          lead: this.lead.value,
        };
      } else {
        object = {
          name: this.project,
          client: this.client.value,
          POC: this.user.value,
          lead: this.lead.value,
          skill: this.skill.value,
        };
      }

      if (this.setDataForEdit != null) {
        try {
          let project_id = this.setDataForEdit.project.id;
          this.$q.loading.show();
          const response = await projectsService.editProject(
            project_id,
            object,
          );
          this.$q.loading.hide();
          this.resetAll();
          this.$emit("refreshGetAllProject");
          this.successMsg = "Project Updated Successfully!!";
        } catch (e) {
          this.errMsg = e.response.data.error;
          this.$q.loading.hide();
          this.errorLayout = true;
        }
      } else {
        try {
          this.$q.loading.show();
          const response = await projectsService.addProject(object);
          this.$q.loading.hide();
          this.resetAll();
          this.$emit("refreshGetAllProject");
          this.successMsg = "Project Added Successfully!!";
        } catch (e) {
          this.errMsg = e.response.data.error;
          this.$q.loading.hide();
          this.errorLayout = true;
        }
      }
    },
    async onClientSubmit(event) {
      let object = {
        name: this.clientName.trim(),
        isLeaveShow: this.checkbox,
      };
      try {
        this.$q.loading.show();
        const response = await clientsService.addClient(object);
        this.$q.loading.hide();
        this.clientName = "";
        this.addClientDialog = false;
        this.getAllClients();
        this.$emit("refreshGetAllProject");
        this.successMsg = "Client Added Successfully!!";
      } catch (e) {
        this.errMsg = e.response.data.error;
        this.$q.loading.hide();
        this.errorLayoutClient = true;
      }
    },
    clearSuccessMsg() {
      this.successMsg = "";
    },
    clearSuccessMsg1() {
      this.successMsg1 = "";
    },
    async onEditClientSubmit() {
      this.$q.loading.show();
      try {
        const res = await clientsService.updateClientById({
          id: this.editClientId,
          name: this.editClientName,
        });
        this.$q.loading.hide();
        this.editClientId = "";
        this.editClientName = "";
        this.editClientDialog = false;
        this.getAllClients();
        this.$emit("refreshGetAllProject");
      } catch (e) {
        this.errMsg = e.response.data.error;
        this.$q.loading.hide();
        this.errorLayoutClient = true;
      }
    },
    resetAll() {
      this.client = null;
      this.project = "";
      this.skill = null;
      this.user = null;
      this.lead = null;
      this.addProject = false;
      this.setDataForEdit = null;
    },
    closeAddClientDialog() {
      this.clientName = "";
      this.addClientDialog = false;
    },
  },
};
</script>

<style>
.addProjectDailog {
  width: 100% !important;
  max-width: 700px !important;
  height: auto;
}

.add-Lead {
  width: 100%;
  height: 250px;
}
/*  Client Name Table */
.my-sticky-virtscroll-table {
  /* height or max-height is important */
  border: 1px solid #777777;
  border-radius: 10px;
  box-shadow: none;
}
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff;
}
thead tr th {
  position: sticky;
  z-index: 1;
}
/* this will be the loading indicator */
thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}
thead tr:first-child th {
  top: 0;
}
</style>
