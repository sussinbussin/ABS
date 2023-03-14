<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const showSidebar = ref(false)

watchEffect(() => {
  if (route.name === 'Login')
    showSidebar.value = false
  else
    showSidebar.value = true
})
</script>

<template>
  <main font-sans text="center gray-700 dark:gray-200">
    <div class="flex flex-row">
      <Sidebar v-if="showSidebar" />
      <RouterView class="flex-1" />
    </div>
  </main>
</template>
