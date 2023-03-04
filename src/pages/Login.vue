<script setup lang="ts">
</script>

<template>
  <div class="pt-30 h-screen bg-noise">
    <LoginForm class="w-1/3 mx-auto" />
  </div>
</template>

<style scoped>
.bg-noise {
  background: radial-gradient(circle at 50% 30%,
      rgba(18, 18, 18, 1),
      rgba(18, 18, 18, 0.8)), url("/noise.svg");

}
</style>
