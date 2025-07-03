<template>
  <div>
    <div
      class="timesheet-card bg-white text-secondary timesheet-card q-ma-sm authorize-page"
    >
      <div style="width: 250px; margin-right: 30px; display: none">
        <img
          src="../../public/pegasus_new_527.png"
          alt=""
          class="responsive-img-footer"
          style="width: 100%"
        />
      </div>

      <div>
        <h1 class="authorize-content">403</h1>
        <h3
          class="authorize-content"
          style="
            text-transform: uppercase;
            font-size: 40px;
            margin-bottom: unset;
          "
        >
          You are not authorized!
        </h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.authorize-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 850px;
  margin: auto;
  margin-top: 10%;
  padding: 20px;
}

.authorize-content {
  color: #b0cf6f;
  margin: unset;
  margin-bottom: 20px;
  text-align: center;
}
</style>
