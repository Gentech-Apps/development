<template>
  <div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayMsg: "",
    };
  },
  props: ["successMsg"],
  watch: {
    successMsg: function (val) {
      if (val !== "") {
        this.displayMsg = val;
        this.showSnackbar();
      }
    },
  },
  methods: {
    showSnackbar() {
      this.$q.notify({
        position: "bottom-left",
        message: this.displayMsg,
        color: "primary",
        icon: "check_circle_outline",
        timeout: 3000,
      });
      this.$emit("clearSuccessMsg");
      this.displayMsg = "";
    },
  },
};
</script>

<style>
.q-notification__icon.material-icons.q-icon {
  margin-right: 5px !important;
}
.q-notification__badge.q-notification__badge--top-right {
  display: none !important;
}
</style>
