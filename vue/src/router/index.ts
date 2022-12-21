import { createRouter, createWebHashHistory } from "vue-router";
import HomeSection from "../components/HomeSection.vue";
import SampleSection from "../components/SampleSection.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeSection,
    },
    {
      path: "/sample/:id",
      name: "Sample",
      component: SampleSection,
    },
  ],
});

export default router;
