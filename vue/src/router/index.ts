import { createRouter, createWebHistory } from "vue-router";
import HomeSection from "../components/HomeSection.vue";
import SampleSection from "../components/SampleSection.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeSection,
    },
    {
      path: "/sample",
      name: "Sample",
      component: SampleSection,
    },
  ],
});

export default router;
