import { createRouter, createWebHistory } from "vue-router";

import { getToken } from "@/util/storage-service";
import ContactDetailsViewVue from "@/views/ContactDetailsView.vue";
import ContactsViewVue from "@/views/ContactsView.vue";
import LoginViewVue from "@/views/LoginView.vue";
import SignupViewVue from "@/views/SignupView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginViewVue,
      beforeEnter: (to, from) => {
        if (getToken()) return "/contacts";

        return true;
      },
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
      path: "/contacts",
      name: "contacts",
      component: ContactsViewVue,
      beforeEnter: (to, from) => {
        if (!getToken()) return "/login";

        return true;
      },
    },
    {
      path: "/contacts/details/:name/:phone",
      name: "contact-details",
      component: ContactDetailsViewVue,
      beforeEnter: (to, from) => {
        if (!getToken()) return "/login";

        return true;
      },
      props: (route) => ({
        name: route.params.name,
        phone: route.params.phone,
      }),
    },
    {
      path: "/:catchAll(.*)", // Unrecognized path automatically matches 404
      redirect: "/login",
    },
  ],
});

export default router;
