<template>
  <div>
    <q-dialog
      v-model="layout"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="reject-timesheet"
        style="width: 500px; min-height: 150px; margin-top: 20px"
      >
        <q-card-section
          class="bg-primary text-white q-pt-3 q-m-auto text-center"
          data-id="entersecretkey"
        >
          Enter Secret Key
        </q-card-section>
        <q-form @submit="OnKeyValidate" :ref="addKeyForm">
          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="q-pa-xs">
                  <q-input
                    outlined
                    v-model="keyText"
                    dense
                    lazy-rules
                    label="Enter Key"
                    :rules="[ValidateRule]"
                    style="padding-bottom: 0px"
                    data-id="enterkey"
                  />
                  <span style="color: red; padding: 2px">{{ errorMsg }}</span>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn
              flat
              color="negative"
              label="Close"
              @click="
                tabName === 'Users' || tabName === 'Appraisal'
                  ? this.oncloseNotFound()
                  : $router.push('/')
              "
              align="right"
              data-id="entersecretkey-close"
            />
            <q-btn
              color="primary"
              class="fs--14"
              flat
              label="Submit"
              type="submit"
              data-id="entersecretkey-submit"
            >
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import * as salarydetailsService from "../services/payroll.services";

export default {
  data() {
    return {
      layout: false,
      keyText: null,
      errorMsg: "",
      tabname: "",
      ValidateRule: (val) => {
        if (!val) {
          this.errorMsg = "";
          return "Please enter secret key with size 32";
        } else {
          return true;
        }
      },
    };
  },
  props: ["modal", "tabName"],
  watch: {
    modal: function (value) {
      if (value) {
        this.layout = true;
      } else {
        this.layout = false;
      }
    },
    tabName: function (newVal) {
      this.tabname = newVal;
    },
  },
  methods: {
    async OnKeyValidate() {
      try {
        this.$q.loading.show();
        this.confirmDialog1 = false;
        if (this.keyText) {
          const response = await salarydetailsService.validateSecretKey({
            securityKey: this.keyText,
          });
          if (response.data === "Key Found") {
            this.close();
            this.errorMsg = "";
          } else {
            this.errorMsg = response.data;
          }
        }
        this.$q.loading.hide();
      } catch (error) {
        console.log(error);
      }
    },
    close() {
      this.layout = false;
      let data = { layout: this.layout, secretKey: this.keyText };
      this.$emit("onClose", data);
      this.keyText = null;
    },
    oncloseNotFound() {
      this.layout = false;
      this.$emit("oncloseNotFound");
      this.keyText = null;
    },
  },
};
</script>
