<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import imagePlaceHolder from '../assets/no-image-placeholder.png'
import { useUserStore } from '~/stores/user'
import { pbSymbol } from '~/symbols/injectionSymbols'

interface CategoryMap {
  [key: string]: { assets: Array<string>; color: string }
}

const userStore = useUserStore()
const pb = inject(pbSymbol)

const cardsRef = ref<HTMLElement>()
const normalDisplay = ref('')
const search = ref('')

const inventory = computed(() => userStore.inventory)

const categoryColors = ['red', 'green', 'blue', 'orange', 'yellow']

// Group assets into same name
const inventoryGroup = inventory.value.reduce((acc, item) => {
  if (!acc[item.asset_name.trim()])
    acc[item.asset_name.trim()] = []

  acc[item.asset_name.trim()].push(item)
  return acc
}, {})

// Search function
const displayedCards = computed(() => {
  if (!search.value || !search.value.trim()) {
    return inventoryGroup
  }
  else {
    const filtered = {}
    Object.keys(inventoryGroup).forEach((key) => {
      if (key.toLowerCase().includes(search.value.toLowerCase()))
        filtered[key] = inventoryGroup[key]
    })
    return filtered
  }
})

// Group assets into each category with color
const category: CategoryMap = Object.keys(inventoryGroup).reduce((acc, key, index) => {
  const itemCategory = inventoryGroup[key][0].category
  if (!acc[itemCategory])
    acc[itemCategory] = { assets: [], color: '' }

  acc[itemCategory].assets.push(key)
  // TODO: assign color to each category for AChip correctly
  acc[itemCategory].color = categoryColors[index % categoryColors.length]
  return acc
}, {})

// Get image for each group
const getImageUrl = (items: Array<Record>) => {
  let item;
  // console.log(typeof items)
  items.forEach((e: Object) => {
    if (e.image !== '') {
      item = e
      return false
    }
  })

  if (item !== undefined)
    return `${pb?.collection('assets').client.baseUrl}/api/files/assets/${item.id}/${item.image}`
  else
    return null
}

// Switch display card screen on hover
const assetsDisplay = (index: string) => {
  if (index !== '')
    normalDisplay.value = index
  else
    normalDisplay.value = ''
}
</script>

<template>
  <div>
    <AInput v-model="search" placeholder="Search Name" type="text" class="text-sm mx-2 pb-2" />
    <div class="w-full max-h-600px overflow-y-scroll overflow-x-hidden">
      <div ref="cardsRef" v-motion-slide-right
        class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="(items, index) in displayedCards" :key="index"
          class="flex flex-col border border-transparent rounded-lg bg-#1c1c1c mx-2 my-5 hover:bg-#2a2a2a hover:scale-103% transition-transform duration-300"
          @mouseenter="assetsDisplay(index)" @mouseleave="assetsDisplay('')">
          <div class="h-270px relative overflow-hidden">
            <div :class="normalDisplay === index ? 'translate-y-0' : 'translate-y-full'"
              class="h-full absolute top-0 left-0 w-full transition-all duration-300">
              <div class="h-95% my-1 overflow-y-scroll ">
                <div v-for="e in items" :key="e" class="flex flex-row justify-between mx-2 text-3">
                  <div>
                    {{ e.asset_tag }}
                  </div>
                  <div>
                    {{ e.asset_condition }}
                  </div>
                </div>
              </div>
            </div>

            <div :class="normalDisplay !== index ? 'translate-y-0' : '-translate-y-full'"
              class="flex flex-col justify-evenly h-full pb-2 absolute top-0 left-0 w-full transition-all duration-300">
              <div class="rounded-lg h-70% mb-1 flex justify-center ">
                <img :src="getImageUrl(items) ? getImageUrl(items) : imagePlaceHolder" alt="Image"
                  class="max-w-100% max-h-100% object-contain rounded-lg p-2">
              </div>

              <div class="mx-2 text-justify">
                <div class="truncate font-bold text-5">
                  {{ index }}
                </div>
                <div class="truncate text-3.5 text-gray-4">
                  Qty: {{ items.length }}
                </div>
                <div class="truncate text-3.5 pt-1">
                  <AChip :color="category[items[0].category].color">
                    {{ items[0].category }}
                  </AChip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #9A6BED;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #A489D4;
}
</style>
