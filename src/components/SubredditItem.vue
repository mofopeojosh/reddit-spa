<template>
    <div class="row justify-content-center">
        <div class="col-sm-7">
            <div class="text-center">
                <h4 class="my-0 text-capitalize">{{ subreddit.title }}</h4>
                <small>{{ subreddit.slug }}</small>
            </div>
            <div class="text-center my-4">
                <input type="text" v-model="searchQuery"
                       class="form-control form-control-lg rounded-pill w-100 border"/>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="my-2 d-flex align-items-center">
                <small>Filter:</small>
                <a href="#" @click="votesByFilter = 'up'">
                    <span class="badge border mx-1"
                          :class="votesByFilter == 'up' ? 'badge-success' : 'badge-secondary'">Highest
                        Votes</span></a>
                <a href="#" @click="votesByFilter = 'down'">
                    <span class="badge border mx-1"
                          :class="votesByFilter == 'down' ? 'badge-success' : 'badge-secondary'">Lowest
                        Votes</span></a>
                <a href="#" @click="dateFilter = 'up'">
                    <span class="badge border mx-1"
                          :class="dateFilter == 'up' ? 'badge-success' : 'badge-secondary'">Latest
                            </span></a>
                <a href="#" @click="dateFilter = 'down'">
                    <span class="badge border mx-1"
                          :class="dateFilter == 'down' ? 'badge-success' : 'badge-secondary'">Oldest
                            </span></a>
                <a href="#" @click="votesByFilter = null; dateFilter = null"><span class="badge border badge-light mx-1">Clear</span></a>
            </div>
            <template v-if="subredditPosts.length">
                <div class="mb-4" v-for="(subreddit, index) in subredditPosts" :key="index">
                    <PostItem :post="subreddit"/>
                </div>
            </template>
            <div class="my-5 py-5 text-center" v-else-if="subredditPosts.length == 0">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostItem from '../components/PostItem';

export default {
    name: 'SubredditItem',
    props: {
        subreddit: {
            type: Object,
            default: () => ({})
        },
        posts: Array
    },
    components: {PostItem},
    data() {
        return {
            searchQuery: '',
            noOfVotesFilter: '',
            dateFilter: '',
            votesByFilter: null,
        };
    },
    computed: {
        subredditPosts() {
            if (this.searchQuery) {
                return this.searchPosts();
            }
            if (this.votesByFilter) {
                return this.filterPostsByVotes();
            }
            if (this.dateFilter) {
                return this.filterPostsByDate();
            }
            return this.searchPosts();
        },
        allPosts() {
            return this.$store.getters.posts(this.subreddit.title);
        }
    },
    methods: {
        searchPosts() {
            const posts = this.allPosts.filter(post => {
                return post.data.title.includes(this.searchQuery);
            });
            return posts;
        },
        filterPostsByVotes() {
            const posts = this.allPosts.sort((a, b) => {
                if (this.votesByFilter == 'down') {
                    return (b.data.ups > a.data.ups) ? 1 : -1;
                }
                return (a.data.ups > b.data.ups) ? 1 : -1;
            });
            return posts;
        },
        filterPostsByDate() {
            const posts = this.allPosts.sort((a, b) => {
                if (this.dateFilter == 'down') {
                    return (b.data.date > a.data.date) ? 1 : -1;
                }
                return (a.data.date > b.data.date) ? 1 : -1;
            });
            return posts;
        }
    }
};
</script>

<style scoped>

</style>
