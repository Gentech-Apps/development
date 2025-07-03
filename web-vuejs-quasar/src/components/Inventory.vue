<template>
  <q-card
    class="inventory-card bg-white text-secondary q-ma-sm"
    style="width: 260px; height: 250px"
  >
    <div class="q-pt-md">
      <div
        class="text-subtitle2 text-center event_title"
        style="margin-top: -7px; margin-bottom: 10px"
      >
        {{ getUserName(inventoryData) }}
      </div>
    </div>
    <div
      style="
        font-weight: 600;
        display: inline;
        margin-left: 20px;
        font-size: 11px;
      "
    >
      DEVICE NAME
    </div>
    <div
      style="
        font-weight: 600;
        margin-left: 60px;
        display: inline;
        font-size: 11px;
      "
      v-if="
        this.inventoryData[0].isAssigned ||
        this.inventoryData[0].last_audit_date != null
      "
    >
      LAST AUDIT
    </div>
    <q-separator light inset class="q-mt-sm" />
    <div
      :class="inventoryData.length > 3 ? 'card-scroll' : ''"
      class="inventory-list"
      v-if="this.inventoryData"
    >
      <div class="inventory-item" v-for="(inventory, index) in inventoryData">
        <span class="inventory-name"
          >{{ inventory.name }}
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="bg-tip shadow-1"
            :offset="[10, 10]"
          >
            {{ inventory.name }}
          </q-tooltip>
        </span>
        <span class="audit-date">
          {{ getAuditDate(inventory) }}
        </span>
      </div>
    </div>
    <q-card-actions class="justify-around">
      <q-btn
        flat
        class="fs--10 audit-btn"
        @click="confirmBox(inventoryData)"
        color="primary"
        label="Audit Inventory"
      >
      </q-btn>
    </q-card-actions>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </q-card>
</template>

<script>
import * as eventService from "../services/events.service";
import Notify from "./Notify.vue";
import * as functions from "../services/functions";

export default {
  components: {
    Notify,
  },
  data() {
    return {
      successMsg: "",
    };
  },
  methods: {
    convertDate(date) {
      return functions.convertDateToDate(date);
    },
    async auditInventory(inventory) {
      inventory.forEach(async (item) => {
        this.$q.loading.show();
        const res = await eventService.auditInventoryById(item.asset_tag);
        if (res.status == 200) {
          this.successMsg = "Inventory Audited Successfully";
        } else {
          this.$router.replace("/");
        }
      });
      this.$emit("reloadInventories", inventory);
      this.$q.loading.hide();
    },
    async confirmBox(inventoryData) {
      this.$q
        .dialog({
          title: "Are you Sure?",
          message: inventoryData[0].isAssigned
            ? "Audit all inventories assigned to " +
              inventoryData[0].assigned_to.first_name +
              " " +
              inventoryData[0].assigned_to.last_name
            : "Audit all unassigned inventories",
          cancel: true,
          persistent: true,
          ok: "Yes",
          cancel: {
            color: "negative",
            label: "No",
            flat: true,
          },
        })
        .onOk(() => {
          this.auditInventory(inventoryData);
        })
        .onCancel(() => {
          return false;
        });
    },
    getUserName(inventoryData) {
      const userName = this.inventoryData[0].isAssigned
        ? inventoryData[0].assigned_to.first_name +
          " " +
          (inventoryData[0].assigned_to.last_name
            ? inventoryData[0].assigned_to.last_name
            : "")
        : "Unassigned Device List";
      return userName;
    },
    getAuditDate(inventory) {
      let auditeDate = inventory.isAssigned
        ? inventory.last_audit_date
          ? inventory.last_audit_date
          : inventory.last_checkout
        : inventory.last_audit_date;
      if (auditeDate) return this.convertDate(auditeDate);
      else return "";
    },
  },
  props: ["inventoryData"],
};
</script>

<style>
.inventory-card {
  border-radius: 10px;
  border: 2px solid#93be3b !important;
}

.card-scroll {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 110px;
}

.inventory-list {
  height: 130px;
}

.inventory-item {
  margin: 5px 20px;
  border-bottom: 1px solid rgb(228, 222, 222);
}

.inventory-name {
  display: inline-block;
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 30px;
}

.audit-date-box {
  font-size: 12px;
}

.audit-date {
  color: gray;
  font-size: 12px;
}

.audit-btn {
  margin-top: auto;
}
</style>
