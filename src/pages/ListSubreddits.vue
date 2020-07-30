<template>
    <div class="row">
        <div class="col-12 col-md-3 col-lg-3 fixed-sidebar overflow-auto my-5">
            <div>
                <ul class="list-group">
                    <a href="#"
                       class="list-group-item text-dark"
                       :class="selectedIndex == index ? 'bg-light' : ''"
                       @click="selectSubreddit(index)"
                       v-for="(subreddit, index) in subredditList"
                       :key="index">
                        {{ subreddit.title }}
                    </a>
                </ul>
            </div>
        </div>
        <div v-if="!subredditList.length" class="card bg-light loader-sidebar">
            <div class="card-body">
                Loading Subreddits...
            </div>
        </div>
        <div class="col-12 col-md-8 col-lg-9 offset-md-4 offset-lg-4 py-5">
            <SubredditItem :subreddit="selectedSubreddit"/>
        </div>
    </div>
</template>

<script>
import SubredditItem from '../components/SubredditItem';

export default {
    name: 'ListSubreddits',
    components: {SubredditItem},
    data() {
        return {
            selectedIndex: 0,
        };
    },
    mounted() {
        this.$store.dispatch('getAllPosts')
            .then(() => {
                this.selectSubreddit(0);
            });
    },
    computed: {
        subredditList() {
            return this.$store.state.subredditList;
        },
        selectedSubreddit() {
            return this.subredditList[this.selectedIndex];
        }
    },
    methods: {
        selectSubreddit(index) {
            this.selectedIndex = index;
            this.getSubredditPosts();
        },
        getSubredditPosts() {
            this.$store.dispatch('getSubredditPosts', this.selectedSubreddit);
        }
    }
};
</script>

<style scoped>
    .loader-sidebar {
        height: 500px;
    }

    @media (min-width: 768px) {
        .fixed-sidebar {
            position: fixed;
            max-height: calc(100vh - 120px);
        }
    }

</style>
