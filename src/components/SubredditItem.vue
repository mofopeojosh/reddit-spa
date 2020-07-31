<template>
	<div class="row justify-content-center">
		<div class="col-sm-7">
			<div class="text-center">
				<h4 class="my-0 text-capitalize">{{ subreddit.title }}</h4>
				<small>{{ subreddit.slug }}</small>
			</div>
			<div class="my-4">
				<input type="text" v-model="searchQuery" class="form-control form-control-lg rounded-pill w-100 border"/>
			</div>
		</div>
		<div class="col-sm-12 col-sm-9">
			<div class="d-flex align-items-end my-1">
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
				<a href="#" @click="clearFilter"><span class="badge border badge-light mx-1">Clear</span></a>
			</div>
			<div class="form-inline mb-2">
				<div class="d-flex justify-content-center my-1">
					<div class="input-group input-group-sm mr-2">
						<div class="input-group-prepend">
							<span class="input-group-text">Date</span>
						</div>
						<input type="date" v-model="minDateFilter" class="form-control">
						<input type="date" v-model="maxDateFilter" class="form-control">
					</div>
					<div class="input-group input-group-sm">
						<div class="input-group-prepend">
							<span class="input-group-text">No of Upvotes</span>
						</div>
						<input type="number" v-model="minVoteFilter" class="form-control">
						<input type="number" v-model="maxVoteFilter" class="form-control">
					</div>
				</div>
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
            minVoteFilter: '',
            maxVoteFilter: '',
            minDateFilter: '',
            maxDateFilter: '',
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
            if (this.minVoteFilter || this.maxVoteFilter) {
                return this.filterPostsByVotes();
            }
            if (this.minDateFilter || this.maxDateFilter) {
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
            const posts = this.allPosts.filter(post => {
                return this.minVoteFilter <= post.data.ups && this.maxVoteFilter >= post.data.ups;
            });
            return posts;
		},
		filterPostsByDate() {
            const posts = this.allPosts.filter(post => {
                const today = new Date();
                const minDate = this.minDateFilter ? new Date(this.minDateFilter).setHours(0,0,0,0) : today;
                const maxDate = this.maxDateFilter ? new Date(this.maxDateFilter).setHours(0,0,0,0) : today;
                const createdDate =new Date(post.data.created_utc * 1000).setHours(0,0,0,0);
                return minDate <= createdDate && maxDate >= createdDate;
            });
            return posts;
		},
		clearFilter() {
            this.searchQuery = '';
            this.voteSort = null;
            this.dateSort = null;
            this.minDateFilter = '';
            this.maxDateFilter = '';
            this.minVoteFilter = '';
            this.maxDateFilter = '';
		}
    }
};
</script>

<style scoped>

</style>
