<template>
    <div id="app" class="app">
        <AppHeader/>
        <main class="container py-5">
            <ListSubreddits />
        </main>
    </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import ListSubreddits from './pages/ListSubreddits.vue';

export default {
    name: 'App',
    components: {
        AppHeader,
        ListSubreddits,
    }
};
</script>

<style>
    .app{
        background-color: #e7ecf3;
        min-height: 100vh;
    }
</style>
