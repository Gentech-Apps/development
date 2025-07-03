<template>
  <div>
    <q-dialog
      v-model="layoutValue"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-negative text-white reject-timesheet">
        <q-card-section>
          <div class="text-h6">Confirm</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure, You want to Reject this TimeSheet?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            icon-right="o_cancel"
            color="negative"
            class="fs--14"
            flat
            label="Reject"
            @click="confirmRejectTrue"
            data-id="rejectionreason-reject"
          ></q-btn>
          <q-btn
            flat
            color="primary"
            label="Close"
            @click="closeConfirmReject"
            data-id="rejectionreason-close"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    confirmRejectTrue() {
      this.$emit("rejectUserSheets", true);
      this.closeConfirmReject();
    },
    closeConfirmReject() {
      this.$emit("confirmRejectClose", false);
    },
  },
  props: {
    confirmReject: {
      default: Boolean,
    },
  },
  data() {
    return {
      layoutValue: false,
    };
  },
  watch: {
    confirmReject: function (newVal) {
      this.layoutValue = newVal;
    },
  },
};
</script>

<style>
.reject-timesheet {
  height: fit-content;
  max-height: 50vh;
  width: 100%;
  max-width: 500px;
}
</style>
