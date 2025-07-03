<template>
  <q-dialog :persistent="true" v-model="openPayrollDialog">
    <q-card class="q-px-sm payroll-dialog">
      <q-form @submit="onSubmitForm">
        <q-card-section class="q-pt-sm q-pb-none">
          <div class="row">
            <span
              class="col-md-12 col-sm-12 col-xs-12 text-h6 text-center text-capitalize q-mb-sm"
            >
              {{ title }}
            </span>
          </div>
          <q-input
            class="input-style"
            outlined
            v-model="payrollMonth"
            lazy-rules
            label="Payroll Month"
            dense
            readonly
            @click="$refs.qpayrollmonth.show()"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Please select Payroll Month.',
            ]"
          >
            <template v-slot:append class="popup-style">
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qpayrollmonth"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="payrollMonth"
                    years-in-month-view
                    default-view="Months"
                    mask="MM/YYYY"
                    format="MM/YYYY"
                    :default-year-month="defaultYearMonth"
                    @update:model-value="onUpdateMv"
                    :key="dpKey"
                    emit-immediately
                    minimal
                    class="myDate"
                    :navigation-min-year-month="minPayrollMonth"
                    :navigation-max-year-month="maxPayrollMonth"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ok" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions class="justify-end q-py-none q-mb-md q-mt-md">
          <q-btn flat color="red" label="close" @click="closeModel" />
          <q-btn flat label="Next" type="submit" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import moment from "moment";
import { ref } from "vue";

export default {
  data() {
    return {
      payrollMonth: this.payrollSelector,
      openPayrollDialog: this.payrollMonthDialog,
    };
  },
  props: ["minPayrollMonth", "maxPayrollMonth", "payrollMonthDialog", "title"],

  methods: {
    onSubmitForm() {
      const date = moment(this.payrollMonth, "MM/YYYY").format("YYYY/MM/DD");
      this.$emit("approveRequest", date);
    },
    closeModel() {
      this.payrollMonth = null;
      this.$emit("closeModel");
    },
  },
  watch: {
    payrollMonthDialog: function (newVal) {
      this.openPayrollDialog = newVal;
    },
  },
  setup() {
    const dpKey = ref(Date.now());
    function onUpdateMv(v) {
      dpKey.value = Date.now();
    }
    return {
      dpKey,
      onUpdateMv,
    };
  },
};
</script>

<style>
.payroll-dialog {
  width: 400px;
  height: 200px;
  padding: auto;
}
.input-style {
  margin: auto;
}
.popup-style {
  height: 240px;
}
</style>
