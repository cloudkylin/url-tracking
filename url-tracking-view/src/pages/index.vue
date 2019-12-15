<template>
    <div>
        <header>
            <Header></Header>
        </header>
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
    import Header from "@/components/Header";

    export default {
        name: 'index',
        components: {Header}
    }
</script>

<style lang="scss" scoped>

</style>
