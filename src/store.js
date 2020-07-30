import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        allPosts: [],
        subredditList: [],
        subredditPosts: {},
    },
    mutations: {
        setSubredditList(state, data) {
            state.subredditList = data;
        },
        setAllPosts(state, data) {
            state.allPosts = data;
        },
        setSubredditPosts(state, { title, data }) {
            Vue.set(state.subredditPosts, title, data);
        },
    },
    actions: {
        async getAllPosts({ dispatch, commit }) {
            const res = await fetch('https://www.reddit.com/.json');
            const data = await res.json();
            commit('setAllPosts', data.data.children);
            dispatch('groupPostsBySubreddits', data.data.children);
        },
        groupPostsBySubreddits({ commit }, allPosts) {
            let subredditList = [];
            let subredditPosts = {};
            allPosts.forEach((post) => {
                let subreddit = post.data.subreddit;
                let slug = post.data.subreddit_name_prefixed;
                if(!subredditPosts[post.subreddit]){
                    subredditList.push({
                        title: subreddit,
                        slug,
                    });
                }
            });
            commit('setSubredditList', subredditList);
        },
        async getSubredditPosts({ commit, state }, subreddit) {
            if(!state.subredditPosts[subreddit.title]){
                const res = await fetch('https://www.reddit.com/' + subreddit.slug + '.json');
                const data = await res.json();
                commit('setSubredditPosts', {
                    title: subreddit.title,
                    data: data.data.children
                });
            }
        }
    },
    getters: {
        posts: (state) => (title) =>  {
            return state.subredditPosts[title] || [];
        }
    }
});

export default store;
