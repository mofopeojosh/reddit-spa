<template>
    <div class="card border-0 shadow">
        <div class="card-body">
            <div>
                <small>
                    {{ abbreviateVotes(post.data.ups) }} votes | Posted {{ formatDate(post.data.created) }}</small>
                <a :href="'https://reddit.com'+ post.data.permalink" target="_blank" class="text-dark">
                    <h5 class="mb-3 font-weight-normal">{{ post.data.title }}</h5>
                </a>
                <img v-if="post.data.url" :src="post.data.url" class="img-fluid">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PostCard',
    props: {
        post: {
            type: Object,
            default: () => ({})
        },
        showPath: Boolean
    },
    methods: {
        viewSubreddit(subreddit) {
            this.$store.dispatch('getSubreddit', subreddit);
        },
        abbreviateVotes(vote) {
            return Math.abs(vote) > 999 ? Math.sign(vote) * ((Math.abs(vote) / 1000).toFixed(1)) + 'k' : Math.sign(vote) * Math.abs(vote);
        },
        formatDate(timestamp) {
            const date = new Date(timestamp * 1000);
            const month = date.toLocaleString('default', {month: 'short'});
            return `${date.getDay()} ${month}, ${date.getFullYear()}`;
        }
    }
};
</script>

<style scoped>

</style>
