<script>
export default {
    name: 'Modal',
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>

<template>
    <div class="modal-backdrop h-screen w-screen" id="modalid" style="    
            position: fixed;
            top: 50%;
            left: 50%;
            width: 50%;
            z-index: 999">
        <button type="button" class="btn-close" @click="close">
            x
        </button>
        <ACard>
            <h1 class="font-bold text-xl p-5 text-left">
                Add Product
            </h1>
        </ACard>
    </div>
</template>