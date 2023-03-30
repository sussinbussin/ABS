<script setup lang="ts">
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import placeholder from "~/assets/no-image-placeholder.png"

const router = useRouter()
const props = defineProps(['id'])
const userStore = useUserStore()
const pb = inject(pbSymbol)

const item = computed(() => {
  return userStore.inventory.find(e => e.id == props.id)
})

const groupedItem = computed(() => {

})

const itemImage = computed(() => {
  if(item == undefined) return placeholder

  return item.value.image !== "" ? 
    `${pb?.collection('assets').client.baseUrl}/api/files/assets/${item.value.id}/${item.value.image}` : placeholder
})

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="flex flex-col h-screen p-5">
    <div class="flex flex-row"> 
    <ABtn variant="text" icon="i-bx-chevron-left" @click="handleBack">Back</ABtn>
    <h1 class="font-bold text-xl text-left my-auto pl-4">
      {{item.asset_name}}
    </h1>
    </div>
    <img :src="itemImage" class="max-w-500px mt-3 mx-auto rounded"/>
    <h1 class="mx-auto font-bold text-xl">This is a {{item.asset_name}}</h1>
    <p class="mx-auto"> Thank you. </p>
  </div>
</template>

<style scoped>
</style>
