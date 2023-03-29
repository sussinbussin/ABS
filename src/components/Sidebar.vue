<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { useHover } from '@vueuse/gesture'
import { useUserStore } from '~/stores/user'

const sidebarRef = ref<HTMLElement>()
const route = useRoute()
const router = useRouter()

const { user, cca } = useUserStore()

// Pin logic
const pinned = ref(false)


const { variant, apply } = useMotion(sidebarRef, {
  initial: {
    width: 250
  },
  collasped: {
    width: 65,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 20
    }
  }
})

onMounted(() => {
  variant.value = pinned.value ? 'initial' : "collasped"
})
useHover(({ hovering }) => {
  if (pinned.value) {
    variant.value = 'initial'
    return
  }
  if (hovering) {
    variant.value = 'initial'
  } else {
    variant.value = 'collasped'
  }
}, { domTarget: sidebarRef })

const changePin = () => {
  pinned.value = !pinned.value
  if (pinned.value) {
    variant.value = 'collasped'
  } else {
    variant.value = 'initial'
  }
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
    class="h-screen dark:bg-hex-0a0a0a shadow-inset flex flex-col align-items-stretch bg-noise border-right p-2">
    <div class="flex flex-row h-15">
      <AAvatar :content="user?.name[0]" />
      <div class="text-left px-3" v-if="variant == 'initial'">
        <h1 class="font-bold my-auto">
          {{ user?.name }}
        </h1>
        <p class="text-xs font-bold my-auto">
          {{ cca?.name }}
        </p>
      </div>
    </div>
    <ABtn icon="i-bx-package" :variant="route.name === 'Inventory' ? 'fill' : 'light'" @click="navigateInventory">
      {{ variant == 'initial' ? 'Inventory' : '' }}
    </ABtn>
    <ABtn icon="i-bx-calendar-event" :variant="route.name === 'Events' ? 'fill' : 'light'" class="mt"
      @click="navigateEvents">
      {{ variant == 'initial' ? 'Events' : '' }}
    </ABtn>
    <div class="mt-auto flex flex-row">
      <ABtn icon-only icon="i-bx-cog" variant="light" />
      <ABtn icon-only icon="i-bx-pin" class="ml-auto" :variant="getPinnedVariant" :onclick="changePin"
        v-if="variant == 'initial'" />
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
