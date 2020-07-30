<template>
    <div class="row">
        <div class="col col-sm-3 position-sm-fixed fixed-sidebar overflow-auto py-5">
			<div class="">
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
        <div class="col-12 col-sm-9 offset-sm-3 py-5">
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
.loader-sidebar{
    height: 500px;
}
.fixed-sidebar{
	max-height: calc(100vh - 120px);
}
</style>
