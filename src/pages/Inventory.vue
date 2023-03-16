<script setup lang="ts">
</script>

<template>
  <div class="block h-screen">
    <h1 class="font-bold text-xl p-5 text-left">
      My Inventory
    </h1>
    <Suspense>
      <InventoryTable class="m-5" />
    </Suspense>
  </div>
</template>

<style scoped></style>
