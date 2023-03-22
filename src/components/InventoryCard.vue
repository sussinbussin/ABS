<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import { pbSymbol } from "~/symbols/injectionSymbols";
import imagePlaceHolder from "../assets/no-image-placeholder.png"

const userStore = useUserStore()
const pb = inject(pbSymbol)



const inventory = computed(() => userStore.inventory)

// open multiple cards
// const expanded = ref(new Array(inventory.length).fill(false))

// open one card only
const expanded = ref(-1)

const toggleExpand = (index: number) => {
    // open multiple cards
    // expanded.value[index] = !expanded.value[index]

    // open one card only
    if (index == expanded.value) {
        expanded.value = -1
    } else {
        expanded.value = index
    }
}

const cardsRef = ref<HTMLElement>()

const getImageUrl = (item: Record) => {
    if (item.image !== '') {
        return pb?.collection('inventory').client.baseUrl + "/api/files/inventory/" + item.id + "/" + item.image;
    } else {
        return null
    }
}
</script>

<template>
    <div class="w-full max-h-700px overflow-y-scroll overflow-x-hidden">
        <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" ref="cardsRef"
            v-motion-slide-right>
            <div class="flex flex-col h-auto border border-transparent rounded-lg bg-gray-8 mx-2 my-5 hover:bg-gray-7 hover:scale-103% transition-transform duration-300"
                v-for="(item, index) in inventory" :key="item.id" :style="{
                    // open multiple cards change: expanded => expanded[index]
                    // the following 3 styles allows overlapping
                    // good for opening 1 card at a time
                    position: expanded == index ? 'relative' : 'static',
                    zIndex: expanded == index ? '1' : '0',
                    marginBottom: expanded == index ? '-145px' : '0'
                }">
                <div class="border border-gray-7 rounded-lg h-150px mb-1 flex justify-center ">
                    <img :src="getImageUrl(item) ? getImageUrl(item) : imagePlaceHolder" alt="Image" class="max-w-100% max-h-100% object-contain"/>
                </div>


                <div class="mx-2 text-justify">
                    <div class="truncate font-bold text-5">
                        {{ item.name }}
                    </div>
                    <div class="truncate text-3.5 text-gray-4">
                        Qty: {{ item.qty }}
                    </div>
                </div>

                <div v-show="expanded == index" class="">
                    <div>PLACEHOLDER</div>
                    <div>PLACEHOLDER</div>
                    <div>PLACEHOLDER</div>
                    <div>PLACEHOLDER</div>
                    <div>PLACEHOLDER</div>
                    <div>PLACEHOLDER</div>
                </div>


                <hr class="m-2">

                <ABtn variant="text" @click="toggleExpand(index)" class="flex justify-end w-full">
                    <div v-if="!(expanded == index)">Show</div>
                    <div v-else>Hide</div>
                </ABtn>
            </div>
        </div>
    </div>
</template>

<style scoped></style>