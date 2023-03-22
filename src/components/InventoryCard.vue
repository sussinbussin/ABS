<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore()

const inventory = userStore.inventory

const expanded = ref(new Array(inventory.length).fill(false));
</script>

<template>
    <div class="w-full max-h-700px overflow-y-scroll overflow-x-hidden">
        <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-w-100">
            <div class="flex flex-col w-full m-2" v-for="(item, index) in inventory" :key="item.id">
                <v-card class="bg-grey-darken-3 mx-2 my-5">
                    <div class="flex items-center justify-start truncate w-90% mx-auto font-black text-xl">{{ item.name }}</div>

                    <div class="expandable-content"
                        :class="{ 'expanded': expanded[index] }">
                        <v-expand-transition>
                            <div v-if="expanded[index]">{{ item.qty }}</div>
                        </v-expand-transition>
                    </div>


                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn class="flex w-full" @click="expanded[index] = !expanded[index]">
                        {{ !expanded[index] ? 'Show' : 'Hide' }}
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>


    <!-- <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-w-100">
                            <ACard class="mx-2 my-5 h-50" v-for="item in inventory" :title="item.name" :subtitle="item.qty" src="" />
                        </div> -->
</template>

<style scoped>
.expandable-content {
    overflow: hidden;
    height: 0;
    transition: height 0.5s ease;
}

.expandable-content.expanded {
    height: auto;
}
</style>