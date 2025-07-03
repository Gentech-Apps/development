<template>
  <div>
    <div>
      <div
        class="q-px-md q-mt-md q-ml-lg q-gutter-sm"
        style="position: relative"
      >
        <q-dialog v-model="layoutValue">
          <div
            :class="
              $store.getters.userType !== 'admin' ? 'q-mt-lg q-pt-lg' : ''
            "
          >
            <q-table
              :title="userName"
              :rows="users"
              class="sticky-header-table"
              :columns="columns"
              virtual-scroll
              :pagination.sync="pagination"
              :rows-per-page-options="[10, 20, 50, 0]"
              row-key="name"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <div v-if="col.name == 'name'">
                      {{ col.value }}
                    </div>
                    <div v-if="col.name != 'name'">
                      {{ col.value }}
                    </div>
                  </q-td>
                </q-tr>
              </template>
              <template v-slot:bottom>
                <div class="justify-start">
                  <q-btn color="negative" flat label="cancel" @click="close" />
                </div>
              </template>
            </q-table>
          </div>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import * as encryptDecrypt from "../../services/encryptionDecryptionService";
import * as salaryPeriod from "../../services/masterSalary.service";
import Notify from "../Notify.vue";

export default {
  components: { Notify },
  data() {
    return {
      userId: "",
      uType: "",
      pagination: {},
      columns: [
        {
          name: "grade",
          align: "center",
          label: "Grade",
          field: "grade",
        },
        {
          name: "gross",
          align: "center",
          label: "Gross Salary",
          field: "gross",
        },
        {
          name: "pf",
          align: "center",
          label: "PF",
          field: "pf",
        },
        {
          name: "nps",
          align: "center",
          label: "NPS (%)",
          field: "nps",
        },
        // {
        //   name: "startdate",
        //   align: "center",
        //   label: "Created Date",
        //   field: "stratdate",
        // },
        {
          name: "effectivedatefrom",
          align: "center",
          label: "EffectiveDate From",
          field: "effectivedatefrom",
        },
        {
          name: "enddate",
          align: "center",
          label: "EffectiveDate Till",
          field: "enddate",
        },
        {
          name: "payrollMonth",
          align: "center",
          label: "Payroll Month",
          field: "payrollMonth",
        },
      ],
      userName: "",
      users: [],
      duplicateUsersForFilter: [],
      nameFilter: "",
      confirmDelete: false,
      userToBeDeleted: null,
      successMsg: "",
      showActive: true,
      secret: null,
    };
  },
  props: ["addlayout", "userID", "usersName", "secretKey"],
  watch: {
    addlayout: function (newVal) {
      this.layoutValue = newVal;
    },
    userID: function (newVal) {
      this.userId = newVal;
      this.getAllRecords();
    },
    secretKey: function (newVal) {
      this.secret = newVal;
    },
    usersName: function (newVal) {
      this.userName = newVal;
    },
  },
  methods: {
    async getDecryptedData(element) {
      let decryptData = await encryptDecrypt.decryptData(
        element.masterSalary,
        this.secretKey,
      );
      decryptData = JSON.parse(decryptData);
      element.grade = decryptData.grade;
      element.gross = Number(decryptData.grossSalary);
      return element;
    },
    async getAllRecords() {
      this.users = [];
      const response = await salaryPeriod.getUserSalaryPeriodRecordsById(
        this.userId,
      );
      response.data.forEach(async (element) => {
        element = await this.getDecryptedData(element);
        const obj = {
          grade: element.grade,
          effectivedatefrom:
            element.dates.effectiveDateFrom == null
              ? " "
              : moment(element.dates.effectiveDateFrom).format("DD/MM/YYYY"),
          enddate:
            element.dates.endDate == null
              ? " "
              : moment(element.dates.endDate).format("DD/MM/YYYY"),
          gross: element.gross,
          pf: element?.user.isPfOpted ? "Y" : "N",
          nps:
            element?.user.npsPercentage == 0
              ? " "
              : element?.user.npsPercent + "%",
          payrollMonth: element.payrollMonth,
        };
        this.users.push(obj);
      });
    },

    close() {
      this.users = [];
      this.user = null;
      this.effdatefrom = null;
      this.createdDate = null;
      this.layoutValue = false;
      this.userId = null;
      this.$emit("layoutFalse");
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
