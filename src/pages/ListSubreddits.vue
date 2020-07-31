<template>
	<main class="w-100 app-body">
		<div class="container">
			<div class="row">
				<div class="col-12 col-md-3 position-relative">
					<div v-if="!subredditList.length" class="col card bg-light fixed-sidebar overflow-auto my-5">
						<div class="card-body">
							Loading Subreddits...
						</div>
					</div>
					<div class="col fixed-sidebar overflow-auto my-5" v-else>
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
			</div>
		</div>
		<div class="w-100 h-100 position-md-absolute overflow-auto" v-if="selectedSubreddit">
			<div class="container py-5">
				<div class="row">
					<div class="col-12 col-md-9 offset-md-3">
						<SubredditItem :subreddit="selectedSubreddit"/>
					</div>
				</div>
			</div>
		</div>
		<div class="my-5 py-5 text-center" v-else>
			<div class="spinner-border" role="status">
				<span class="sr-only">Loading...</span>
			</div>
		</div>
	</main>
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
    @media (min-width: 768px) {
        .fixed-sidebar {
			z-index: 100;
			position: absolute;
			max-height: calc(100vh - 130px);
        }
    }
	.app-body{
		height: calc(100vh - 56px);
		margin-top: 56px;
		position: relative;
	}

</style>
