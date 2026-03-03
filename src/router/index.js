import { createRouter, createWebHashHistory } from "vue-router";
import Conversations from "@/views/Conversations.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "conversations",
      component: Conversations,
    },
    {
      path: "/chat/:id",
      name: "conversation",
      component: () => import("../views/Conversation.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/About.vue"),
    },
    {
      path: "/setup",
      name: "setup",
      component: () => import("../views/Setup.vue"),
    },
    {
      path: "/myPerfil",
      name: "myPerfil",
      component: () => import("../views/MyPerfil.vue"),
    },
  ],
});

export default router;
