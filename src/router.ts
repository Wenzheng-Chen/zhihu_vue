import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import ColumnDetail from "./views/ColumnDetail.vue";
import CreatePost from "./views/CreatePost.vue";
import store from "./store";
import SignUp from "./views/SignUp.vue";
import axios from "axios";

const routerHistory = createWebHistory();
const router = createRouter({
   history: routerHistory,
   routes: [
      {
         path: "/",
         name: "home",
         component: Home
      },
      {
         path: "/login",
         name: "login",
         component: Login,
         meta: { redirectAlreadyLogin: true }
      },
      {
         path: "/signup",
         name: "signup",
         component: SignUp
      },
      {
         path: "/column/:id",
         name: "column",
         component: ColumnDetail
      },
      {
         path: "/create",
         name: "create",
         component: CreatePost,
         meta: { requireLogin: true }
      }
   ]
});
router.beforeEach((to, from, next) => {
   const { user, token } = store.state;
   const { requireLogin, redirectAlreadyLogin } = to.meta;
   if (!user.isLogin) {
      if (token) {
         axios.defaults.headers.common.Authorization = `Bearer ${token}`;
         store
            .dispatch("fetchCurrentUser")
            .then(() => {
               if (redirectAlreadyLogin) {
                  next("/");
               } else {
                  next();
               }
            })
            .catch((e) => {
               console.log(e);
               store.commit("logout");
               next("login");
            });
      } else {
         if (requireLogin) {
            next("login");
         } else {
            next();
         }
      }
   } else {
      if (redirectAlreadyLogin) {
         next("/");
      } else {
         next();
      }
   }
});

export default router;
