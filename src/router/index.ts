import { createRouter, createWebHistory } from "vue-router";

import { getToken } from "@/util/storage-service";
import LoginViewVue from "@/views/LoginView.vue";
import SignupViewVue from "@/views/SignupView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginViewVue,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupViewVue,
    },
    {
      path: "/logout",
      name: "logout",
      redirect: "login",
    },
    {
      path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
      redirect: "/login",
    },
  ],
});

export default router;
