<template>
    <div class="row justify-content-center">
        <div class="col-sm-7">
            <div class="text-center">
                <h4 class="my-0 text-capitalize">{{ subreddit.title }}</h4>
                <small>{{ subreddit.slug }}</small>
            </div>
            <div class="my-4">
                <input type="text" v-model="searchQuery"
                       class="form-control form-control-lg rounded-pill w-100 border"/>
            </div>
        </div>
        <div class="col-sm-12 col-sm-9">
            <div class="d-flex flex-wrap align-items-end my-1">
                <a href="#" @click="voteSort = 'up'">
                    <span class="badge border mx-1" :class="voteSort == 'up' ? 'badge-success' : 'badge-secondary'">Highest
                        Votes</span></a>
                <a href="#" @click="voteSort = 'down'">
                    <span class="badge border mx-1" :class="voteSort == 'down' ? 'badge-success' : 'badge-secondary'">Lowest
                        Votes</span></a>
                <a href="#" @click="dateSort = 'up'">
                    <span class="badge border mx-1" :class="dateSort == 'up' ? 'badge-success' : 'badge-secondary'">Latest
                    </span></a>
                <a href="#" @click="dateSort = 'down'">
                    <span class="badge border mx-1" :class="dateSort == 'down' ? 'badge-success' : 'badge-secondary'">Oldest
                    </span></a>
            </div>
            <div class="form-inline mb-2">
                <div class="d-flex flex-wrap justify-content-center">
                    <div class="input-group input-group-sm m-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Date</span>
                        </div>
                        <input type="date" v-model="dateFilter" class="form-control">
                    </div>
                    <div class="input-group input-group-sm m-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text">No of Upvotes</span>
                        </div>
                        <select v-model="voteRangeFilter" class="form-control">
                            <option value="">-- Select a range --</option>
                            <option v-for="(option, index) in Object.keys(voteFilterOptions)"
                                    :value="option"
                                    :key="index">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                </div>
				<button class="btn btn-sm border btn-light mx-1" @click="clearFilter">Clear filters</button>

			</div>
            <template v-if="subredditPosts.length">
                <div class="mb-4" v-for="(subreddit, index) in subredditPosts" :key="index">
                    <PostItem :post="subreddit"/>
                </div>
            </template>
            <div class="my-5 py-5 text-center" v-else-if="allPosts.length == 0">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <div class="my-5 py-5 text-center" v-else>
                <p>No posts found</p>
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
        posts: {
            type: Array,
            default: () => ([])
        }
    },
    components: {PostItem},
    data() {
        return {
            searchQuery: '',
            noOfVotesFilter: '',
            dateSort: '',
            voteSort: null,
            dateFilter: '',
            voteRangeFilter: '',
            voteFilterOptions: {
                '0 - 100': {min: 0, max: 100},
                '101 - 500': {min: 100, max: 500},
                '501 - 1000': {min: 500, max: 1000},
                '1001 - 10000': {min: 1000, max: 10000},
                '10001 - 50000': {min: 10000, max: 50000},
                'More than 50000': {min: 50000, max: null},
            }
        };
    },
    computed: {
        subredditPosts() {
            if (this.searchQuery) {
                return this.searchPosts();
            }
            if (this.voteSort) {
                return this.sortPostsByVotes();
            }
            if (this.dateSort) {
                return this.sortPostsByDate();
            }
            if (this.voteRangeFilter) {
                return this.filterPostsByVotes();
            }
            if (this.dateFilter) {
                return this.filterPostsByDate();
            }
            return this.allPosts;
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
        sortPostsByVotes() {
            const posts = this.allPosts.sort((a, b) => {
                if (this.voteSort == 'up') {
                    return (b.data.ups > a.data.ups) ? 1 : -1;
                }
                return (a.data.ups > b.data.ups) ? 1 : -1;
            });
            return posts;
        },
        sortPostsByDate() {
            const posts = this.allPosts.sort((a, b) => {
                if (this.dateSort == 'up') {
                    return (b.data.created_utc > a.data.created_utc) ? 1 : -1;
                }
                return (a.data.created_utc > b.data.created_utc) ? 1 : -1;
            });
            return posts;
        },
        filterPostsByVotes() {
            const selectedFilter = this.voteFilterOptions[this.voteRangeFilter];
            const minVotes = selectedFilter.min;
            const maxVotes = selectedFilter.max;
            const posts = this.allPosts.filter(post => {
                if (maxVotes) {
                    return minVotes <= post.data.ups && maxVotes >= post.data.ups;
                }
                return minVotes <= post.data.ups;

            });
            return posts;
        },
        filterPostsByDate() {
            const posts = this.allPosts.filter(post => {
                const date = new Date(this.dateFilter).setHours(0, 0, 0, 0);
                const createdDate = new Date(post.data.created_utc * 1000).setHours(0, 0, 0, 0);
                return date == createdDate;
            });
            return posts;
        },
        clearFilter() {
            this.searchQuery = '';
            this.voteSort = null;
            this.dateSort = null;
            this.dateFilter = '';
            this.voteRangeFilter = '';
        }
    }
};
</script>

<style scoped>

</style>
