import { Commit, createStore } from "vuex";
import { ColumnProps } from "./components/ColumnList.vue";
import { PostProps } from "./components/PostList.vue";
import axios from "axios";
export interface UserProps {
   isLogin: boolean;
   nickName?: string;
   _id?: number;
   column?: string;
   email?: string;
}

export interface GloablErrorProps {
   status: boolean;
   message?: string;
}
export interface GlobalDataProps {
   error: GloablErrorProps;
   token: string;
   loading: boolean;
   columns: ColumnProps[];
   posts: PostProps[];
   user: UserProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
   const { data } = await axios.get(url);
   commit(mutationName, data);
   return data;
};

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
   const { data } = await axios.post(url, payload);
   commit(mutationName, data);
   return data;
};

const store = createStore<GlobalDataProps>({
   state: {
      error: { status: false },
      token: localStorage.getItem("token") || "",
      loading: false,
      columns: [],
      posts: [],
      user: { isLogin: false }
   },
   mutations: {
      createPost(state, newPost) {
         state.posts.push(newPost);
      },
      fetchColumns(state, rawData) {
         state.columns = rawData.data.list;
      },
      fetchColumn(state, rawData) {
         state.columns = [rawData.data];
      },
      fetchPosts(state, rawData) {
         state.posts = rawData.data.list;
      },
      setLoading(state, status) {
         state.loading = status;
      },
      setError(state, e: GloablErrorProps) {
         state.error = e;
      },
      login(state, rawData) {
         const { token } = rawData.data;
         state.token = token;
         localStorage.setItem("token", token);
         axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      },
      fetchCurrentUser(state, rawData) {
         state.user = { isLogin: true, ...rawData.data };
         return state.user;
      }
   },
   actions: {
      fetchColumns({ commit }) {
         getAndCommit("/columns", "fetchColumns", commit);
      },
      fetchColumn({ commit }, cid) {
         getAndCommit(`/columns/${cid}`, "fetchColumn", commit);
      },
      fetchPosts({ commit }, cid) {
         getAndCommit(`/columns/${cid}/posts`, "fetchPosts", commit);
      },
      fetchCurrentUser({ commit }) {
         return getAndCommit(`user/current`, "fetchCurrentUser", commit);
      },
      login({ commit }, payload) {
         return postAndCommit("/user/login", "login", commit, payload);
      },
      loginAndFetch({ dispatch }, loginData) {
         return dispatch("login", loginData).then(() => {
            return dispatch("fetchCurrentUser");
         });
      }
   },
   getters: {
      getColumnById: (state) => (id: string) => {
         return state.columns.find((c) => c._id === id);
      },
      getPostsByCid: (state) => (cid: string) => {
         console.log(state.posts);
         console.log(cid);
         return state.posts.filter((post) => post.column === cid);
      }
   }
});

export default store;
