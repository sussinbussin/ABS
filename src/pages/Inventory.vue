<script setup lang="ts">
</script>

<template>
  <div class="block h-screen overflow-scroll relative">
    <h1 class="font-bold text-xl p-5 text-left">
      My Inventory
    </h1>
    <ABtn icon="i-bx-plus" variant="outline" onclick="location.href='/addProducts';" class="mt-5 left-5 float-left z-2 absolute">
      Add Products
    </ABtn>
    <Suspense>
      <InventoryTable />
    </Suspense>
  </div>
</template>

<style scoped></style>
