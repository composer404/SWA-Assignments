import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    // meta: {
    //   requiresAuth: true
    // },
   
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    // meta: {
    //   requiresAuth: true
    // },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    meta: {
      requiresAuth: false
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/SignupView.vue"),
    // meta: {
    //   requiresAuth: true
    // },
  },
  {
    path: "/game",
    name: "game",
    component: () => import("../views/GameView.vue"),
    meta: {
      requiresAuth: false
    },
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: () => import("../views/LeaderboardView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
