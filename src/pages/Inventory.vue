<script setup lang="ts">

</script>

<template>
  <div class="block h-screen overflow-scroll relative">
    <h1 class="font-bold text-xl p-5 text-left">
      My Inventory
    </h1>
    <Suspense>
      <Transition>
        <InventoryTable />
      </Transition>
    </Suspense>
  </div>
</template>

<style scoped></style>
