<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter();
//Just route to inventory for now
onMounted(() => {
  router.push('/inventory')
})
</script>

<template>
  <div>
    <h1>test</h1>
  </div>
</template>
