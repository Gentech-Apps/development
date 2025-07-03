<template>
  <div>
    <q-table
      class="my-sticky-virtscroll-table client-detail-box overflow-hidden text-left"
      :title="client.clientName"
      dense
      :rows="client.project"
      :columns="columns"
      :row-key="client.project.id"
      hide-bottom
      virtual-scroll
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <label
          class="capitalize"
          style="font-size: 20px; margin-right: 15px; font-weight: 500"
        >
          {{ client.clientName }}
        </label>
        <q-toggle
          v-if="client.clientIsActive"
          v-model="client.clientIsActive"
          @update:model-value="
            goForActiveInActiveClient(client.clientIsActive, client)
          "
        />
        <q-toggle
          v-else
          v-model="client.clientIsActive"
          @update:model-value="
            goForActiveInActiveClient(client.clientIsActive, client)
          "
          class="text-red"
        />
        <div>
          <span><strong>Organization Event</strong></span>
          <q-checkbox
            v-model="client.clientIsLeaveShow"
            class="q-ml-auto"
            color="primary"
            :disable="!client.clientIsActive"
            @update:model-value="
              goForLeaveShow(client.clientIsLeaveShow, client)
            "
          />
        </div>
        <q-space />
        <q-btn
          flat
          class="btn-md float-right"
          :disabled="client.clientIsActive ? false : true"
          @click="goForAddProject(true)"
          color="primary"
          align="right"
          label="Add Project"
        />
      </template>
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-icon
            @click="goForEditProject(props.row.id)"
            name="create"
            color="warning"
            size="1.5rem"
            class="cursor-pointer float-right q-mt-xs"
          ></q-icon>
        </q-td>
      </template>
      <template v-slot:body-cell-active="props">
        <q-td :props="props" class="text-left">
          <q-toggle
            style="transform: translateX(-10px)"
            v-if="props.row.projectIsActive"
            v-model="props.row.projectIsActive"
            @update:model-value="
              goForActiveInActiveProject(
                props.row.id,
                props.row.projectIsActive,
                props.row.name,
              )
            "
          />
          <q-toggle
            style="transform: translateX(-10px)"
            v-else
            class="text-red"
            v-model="props.row.projectIsActive"
            @update:model-value="
              goForActiveInActiveProject(
                props.row.id,
                props.row.projectIsActive,
                props.row.name,
              )
            "
          />
        </q-td>
      </template>
      <template v-slot:body-cell-lead="props">
        <q-td :props="props">
          {{ props.row.lead.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-poc="props">
        <q-td :props="props">
          {{ props.row.poc.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          {{ props.row.name }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import * as functions from "../../../services/functions";

export default {
  name: "ClientNameBox",
  data() {
    return {
      columns: [
        {
          name: "name",
          required: true,
          label: "Project",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: "lead", label: "Lead", field: "lead", align: "left" },
        { name: "poc", label: "POC", field: "poc", align: "left" },
        { name: "active", label: "Status", field: "active", align: "left" },
        {
          name: "edit",
          label: "Edit",
          field: "editx",
          align: "right",
        },
      ],
      data: [],
    };
  },
  props: {
    client: Object,
  },
  methods: {
    goForEditProject(value) {
      const editObj = { clientId: this.client.clientId, projectId: value };
      this.$emit("openEditByProjectId", editObj);
    },
    goForAddProject(value) {
      const addObj = {
        clientId: this.client.clientId,
        clientName: this.client.clientName,
        addProject: value,
      };
      this.$emit("openAddByClientId", addObj);
    },
    goForEditClient() {
      const editClientObject = {
        editClientName: this.client.clientName,
        editClientId: this.client.clientId,
        editClientDialog: true,
      };
      this.$emit("openEditClientName", editClientObject);
    },
    goForLeaveShow(value, client) {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: `Would you like to ${
            value
              ? "mark as organizational event"
              : "remove from organizational event"
          } the ${client.clientName} ?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onLeaveShowClient(value, client);
        })
        .onCancel(() => {
          this.client.clientIsLeaveShow = !value;
          return false;
        });
    },
    onLeaveShowClient(value, client) {
      const editLeaveShowOrNotClientObject = {
        clientId: this.client.clientId,
        isLeaveShow: value,
        clientInfo: client,
      };
      this.$emit("clientLeaveShowOrNot", editLeaveShowOrNotClientObject);
    },
    goForActiveInActiveClient(value, client) {
      this.confirm(value, client);
    },
    confirm(value, client) {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: `Would you like to ${
            value ? "activate" : "deactivate"
          } the ${client.clientName} ?`,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onSubmit(value, client);
        })
        .onCancel(() => {
          this.client.clientIsActive = !value;
          return false;
        });
    },
    confirmProjectStatus(value, status, name) {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: `Would you like to ${
            status ? "activate" : "deactivate"
          } the ${name} `,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onSubmitProjectStatus(value, status);
        })
        .onCancel(() => {
          return false;
        });
    },
    onSubmit(value, client) {
      const editActiveInactiveClientObject = {
        editActiveInactiveClientId: this.client.clientId,
        editActiveInactiveClient: value,
        clientInfo: client,
      };
      this.$emit("clientActiveInactive", editActiveInactiveClientObject);
    },
    onSubmitProjectStatus(value, status) {
      const editObj = {
        clientId: this.client.clientId,
        clientStatus: this.client.clientIsActive,
        projectId: value,
        projectIsActive: status,
      };
      this.$emit("projectActiveInactive", editObj);
    },
    goForActiveInActiveProject(value, status, name) {
      this.confirmProjectStatus(value, status, name);
    },
    capitalizeFirst(val) {
      return functions.capitalizeFirstLetter(val);
    },
  },
};
</script>

<style>
.text-red {
  color: darkred;
}
tr {
  text-transform: capitalize;
}
</style>
