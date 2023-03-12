<script setup lang="ts">
import { pbSymbol } from '~/symbols/injectionSymbols'
import { useUserStore } from '~/stores/user'

const pb = inject(pbSymbol)
const userStore = useUserStore()

const ccares = await pb?.collection('userDetails').getList(1, 50, {
  filter: `userid = "${userStore.user.id}"`,
})

const eventres = await pb?.collection('events').getList(1, 500, {
  filter: `cca.id="${ccares?.items[0].ccaId}"`,
})
</script>

<template>
  <div class="h-screen overflow-scroll ma">
    <div class="grid-row md:grid-cols-3">
      <ACard
        v-for="event in eventres?.items" :title="event.event_name" :subtitle="event.when"
        :text="event.description" class="w-xs justify-between"
      />
    </div>
  </div>
</template>
