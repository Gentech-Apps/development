<template>
  <div class="denote_color q-mt-sm">
    <ul>
      <li v-for="data in denoteColorsList" :key="data">
        <span class="color_dot" :style="{ backgroundColor: data.color }"></span>
        <span> {{ data.text }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default { props: ["denoteColorsList"] };
</script>
