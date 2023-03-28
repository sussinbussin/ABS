<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useElementHover, useStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useMotionVariants, useMotions, useSpring, useMotion } from '@vueuse/motion'
import { useUserStore } from '~/stores/user'

const sidebarRef = ref<HTMLElement>()
const sidebarWidth = ref(250)
const route = useRoute()
const router = useRouter()

const { user, cca } = useUserStore()

// Pin logic
const pinned = ref(false)

const motionSidebar = useMotion(sidebarRef, {
  initial: {
    width: 250
  }
})

const changePin = () => {
  pinned.value = !pinned.value
  sidebarWidth.value = 50
}

const getPinnedVariant = computed(() => {
  if (pinned.value)
    return 'light'
  return 'text'
})

const navigateInventory = () => {
  router.push('/inventory')
}

const navigateEvents = () => {
  router.push('/events')
}

</script>

<template>
  <div ref="sidebarRef" v-motion-slide-left
    class="h-screen dark:bg-hex-0a0a0a shadow-inset flex flex-col align-items-stretch bg-noise border-right p-2"
    :class="{ width: motionSidebarWidth.value + 'px' }">
    <div class="flex flex-row h-15">
      <AAvatar :content="user?.name[0]" />
      <div class="text-left px-3">
        <h1 class="font-bold my-auto">
          {{ user?.name }}
        </h1>
        <p class="text-xs font-bold my-auto">
          {{ cca?.name }}
        </p>
      </div>
    </div>
    <ABtn icon="i-bx-package" :variant="route.name === 'Inventory' ? 'fill' : 'light'" @click="navigateInventory">
      Inventory
    </ABtn>
    <ABtn icon="i-bx-package" :variant="route.name === 'Events' ? 'fill' : 'light'" class="mt" @click="navigateEvents">
      Events
    </ABtn>
    <div class="mt-auto flex flex-row">
      <ABtn icon-only icon="i-bx-cog" variant="light" />
      <ABtn icon-only icon="i-bx-pin" class="ml-auto" :variant="getPinnedVariant" :onclick="changePin" />
    </div>
  </div>
</template>

<style scoped>
.bg-noise {
  background: linear-gradient(180deg, rgba(19, 19, 19, 1) 50%, rgba(19, 19, 19, 0.9)), url("/noise.svg");
}

.border-right {
  border-right: 1px solid rgba(229, 231, 235, 0.1);
}
</style>
