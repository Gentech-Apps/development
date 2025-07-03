<template>
  <div>
    <q-splitter v-model="splitterModel">
      <!-- left side tabs -->
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-primary gen_tabs q-pt-xl custom-padding"
        >
          <q-tab
            @click="GetAllInventoriesToBeAudited"
            name="toBeAudited"
            icon="campaign"
            label="To Be Audited"
            class="q-mt-md"
          />
        </q-tabs>
      </template>

      <!-- right side main content area -->
      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          v-touch-swipe="handler"
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="toBeAudited">
            <div
              id="ToBeAuditedInvetories"
              class="row wrap justify-start items-start content-start full-width card container"
            >
              <Inventory
                v-for="(inventory, index) in assignedAssets"
                :key="index"
                :inventoryData="inventory"
                @reloadInventories="removeAuditedInventory"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
    <Notify :successMsg="successMsg" @clearSuccessMsg="clearSuccessMsg" />
  </div>
</template>

<script>
import Inventory from "../components/Inventory.vue";
import Notify from "../components/Notify.vue";
import * as eventService from "../services/events.service";

export default {
  components: {
    Inventory,
    Notify,
  },
  data() {
    return {
      assignedAssets: [],
      tab: "toBeAudited",
    };
  },
  watch: {
    tab: function (val) {
      this.skip = 0;
      this.assignedAssets = [];
      if (val == "toBeAudited") {
        this.getAllInventoriesToBeAudited();
      }
    },
  },
  methods: {
    GetAllInventoriesToBeAudited() {
      if (this.tab == "toBeAudited") {
        this.assignedAssets = [];
        this.getAllInventoriesToBeAudited();
      }
    },
    async getAllInventoriesToBeAudited() {
      try {
        this.$q.loading.show();
        const res = await eventService.getAllInventoriesToBeAudit();
        if (
          res.data.assignedAssets.length > 0 ||
          res.data.unassignedAssets[0].length > 0
        ) {
          if (res.data.assignedAssets.length > 0) {
            res.data.assignedAssets.forEach((element) => {
              this.assignedAssets.push(element);
            });
          }
          if (res.data.unassignedAssets[0].length > 0) {
            res.data.unassignedAssets.forEach((element) => {
              element.forEach((item) => {
                item.assigned_to = {
                  username: "unassigned",
                };
              });
              this.assignedAssets.push(element);
            });
          }
        } else {
          this.$router.replace("/");
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
        this.$q.loading.hide();
      }
    },
    removeAuditedInventory(inventory) {
      this.$q.loading.show();
      const removalIndex = this.assignedAssets.findIndex(
        (item) =>
          item[0].assigned_to.username === inventory[0].assigned_to.username,
      );
      this.assignedAssets.splice(removalIndex, 1);

      if (this.assignedAssets.length == 0) this.$router.replace("/");
      this.$q.loading.hide();
    },
  },
  async mounted() {
    await this.getAllInventoriesToBeAudited();
  },
};
</script>

<style scoped>
.container {
  height: 78vh;
  overflow-y: auto;
  margin-top: 58px;
}
</style>
