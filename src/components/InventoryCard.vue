<script setup lang="ts">
import { useUserStore } from "~/stores/user";
import { pbSymbol } from "~/symbols/injectionSymbols";
import imagePlaceHolder from "../assets/no-image-placeholder.png"

const userStore = useUserStore()
const pb = inject(pbSymbol)



const inventory = computed(() => userStore.inventory)

const inventoryGroup = inventory.value.reduce((acc, item) => {
    if (!acc[item.asset_name.trim()]) {
        acc[item.asset_name.trim()] = []
    }
    acc[item.asset_name.trim()].push(item)
    return acc
}, {})

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

const getImageUrl = (items: Array<Record>) => {
    const item = ref()
    // console.log(typeof items)
    items.forEach((e: Object) => {
        if (e.image !== '') {
            item.value = e
            return false
        }
    })

    if (item.value !== undefined) {
        return pb?.collection('assets').client.baseUrl + "/api/files/assets/" + item.value.id + "/" + item.value.image;
    } else {
        return null
    }
}

const normalDisplay = ref('')

const assetsDisplay = (index: string) => {
    console.log(normalDisplay.value)
    console.log(index);
    if (index != '') {
        normalDisplay.value = index
    } else {
        normalDisplay.value = ''
    }
}

</script>

<template>
    <div class="w-full max-h-700px overflow-y-scroll overflow-x-hidden">
        <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" ref="cardsRef"
            v-motion-slide-right>
            <div class="flex flex-col border border-transparent rounded-lg bg-gray-8 mx-2 my-5 hover:bg-gray-7 hover:scale-103% transition-transform duration-300"
                v-for="(items, index) in inventoryGroup" :key="index" @mouseenter="assetsDisplay(index)"
                @mouseleave="assetsDisplay('')">
                <div class="h-210px relative overflow-hidden">
                    <div :class="normalDisplay == index ? 'translate-y-0' : 'translate-y-full'"
                        class="h-full absolute top-0 left-0 w-full transition-all duration-300">
                        <div class="h-95% my-1 overflow-y-scroll">
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
                        class="h-100% absolute top-0 left-0 w-full transition-all duration-300">
                        <div class="border border-gray-7 rounded-lg h-70% mb-1 flex justify-center ">
                            <img :src="getImageUrl(items) ? getImageUrl(items) : imagePlaceHolder" alt="Image"
                                class="max-w-100% max-h-100% object-contain" />
                        </div>


                        <div class="mx-2 text-justify">
                            <div class="truncate font-bold text-5">
                                {{ index }}
                            </div>
                            <div class="truncate text-3.5 text-gray-4">
                                Qty: {{ items.length }}
                            </div>
                        </div>
                    </div>
                </div>


                <!-- <hr class="m-2"> -->

                <!-- <ABtn variant="text" @click="toggleExpand(index)" class="flex justify-end w-full">
                                <div v-if="!(expanded == index)">Show</div>
                                <div v-else>Hide</div>
                            </ABtn> -->
            </div>
        </div>
    </div>
</template>

<style scoped></style>