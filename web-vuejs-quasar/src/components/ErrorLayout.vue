<template>
  <q-dialog
    v-model="errorLayout"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-negative text-white login-error card-style">
      <q-card-section>
        <div class="text-h6">
          <q-icon name="warning" class="text-white" style="font-size: 2rem" />
          Error
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none"> {{ errorMessage }} </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat color="negative" label="OK" @click="errorLayout = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      errorLayout: false,
      errorMessage: null,
    };
  },
  props: ["layoutModel", "message"],
  watch: {
    layoutModel: function (newVal) {
      this.errorLayout = newVal;
    },
    message: function (newVal) {
      this.errorMessage = newVal;
    },
  },
};
</script>

<style>
.card-style {
  min-width: 250px;
}
</style>
