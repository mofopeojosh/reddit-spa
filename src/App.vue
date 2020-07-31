<template>
    <div id="app" class="app position-md-fixed overflow-scroll h-100 w-100">
        <AppHeader/>
        <ListSubreddits />
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
    @media (min-width: 768px) {
        .position-md-fixed {
            position: fixed;
        }
        .position-md-absolute {
            position: absolute;
        }
    }
    .app{
        background-color: #e7ecf3;
        min-height: 100vh;
    }
</style>
