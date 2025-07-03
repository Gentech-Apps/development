<template>
  <q-dialog
    v-model="layout"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    style="padding: 0; z-index: 999999"
  >
    <q-card style="width: 100%; max-width: 100vw; max-height: 100vh">
      <q-card-section
        class="row q-pb-2 shadow-3 dark_bg"
        align="left"
        style="box-shadow: inherit"
      >
        <div class="col-md-2">
          <div
            id="main-layout-logo"
            style="position: absolute; top: -5px; left: -5px; z-index: 999999"
          >
            <img
              src="../../public/pegasus_new.png"
              alt=""
              class="responsive-img-footer"
              style="width: 235px"
            />
          </div>
        </div>
        <div class="text-h6 col-md-9 text-center q-px-sm" style="color: #fff">
          {{ fullName ? fullName + "'s" : "Not Found" }} Referral
        </div>
        <div class="col-md-1">
          <q-btn
            flat
            color="negative"
            label="Close"
            @click="close"
            align="right"
          />
        </div>
      </q-card-section>
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" :src="src" allowfullscreen>
        </iframe>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      layout: false,
      errorLayout: false,
      src: "",
      fullName: "",
      data: "",
    };
  },
  props: ["modal"],
  watch: {
    modal: function (value) {
      this.fullName =
        this.$store.getters.user.firstName +
        " " +
        this.$store.getters.user.lastName;
      this.data =
        this.$store.getters.user.employeeId +
        "," +
        this.$store.getters.user.firstName +
        " " +
        this.$store.getters.user.lastName;
      let finalData = btoa(this.data);
      if (value) {
        this.layout = true;
        this.src = process.env.EXAM_APP_URL_REFFERALS + "?data=" + finalData;
      } else {
        this.layout = false;
        this.src = "";
      }
    },
  },
  methods: {
    close() {
      this.layout = false;
      this.$emit("onClose", this.layout);
    },
  },
};
</script>

<style>
.dark_bg {
  background: linear-gradient(to right, #373737 0%, #cccccc 100%);
  padding: 20px;
}
.q-dialog__inner--minimized {
  padding: 0px;
}
iframe {
  display: block;
  height: calc(100vh - 80px);
  width: 98vw;
  border: none;
  background: lightyellow;
}
</style>
