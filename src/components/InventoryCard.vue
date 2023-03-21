<script setup lang="ts">
import { useUserStore } from "~/stores/user";

const userStore = useUserStore()

const inventory = userStore.inventory
</script>

<template>
    <div class="w-full max-h-700px overflow-y-scroll">
        <div class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-w-100">
            <ACard class="mx-2 my-5 h-50" v-for="item in inventory" :title="item.name" :subtitle="item.qty" src=""/>
        </div>
    </div>
</template>

<style scoped></style>