import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Index from "@/views/Index.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: Index,
    redirect: "/tools",
    children: [
      {
        path: "tools",
        name: "工具",
        component: () => import("@/views/Tools.vue")
      },
      {
        path: "setting",
        name: "设置",
        component: () => import("@/views/Setting.vue")
      },
      {
        path: "about",
        name: "关于",
        component: () => import("@/views/About.vue")
      }
    ]
  },
  {
    path: "*",
    name: "error-404",
    component: () => import("@/views/Error/Error-404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
