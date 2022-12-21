<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <!-- middle column -->
  <ui5-page slot="midColumn">
    <ui5-bar design="Header" slot="header">
      <ui5-label>{{ sample.title }}</ui5-label>
    </ui5-bar>
    <p>
      {{ sample.description }}
    </p>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents/dist/Label";

import { o } from "odata";
import { defineComponent } from "vue";
const odata = o("/browses/");
import type { Control, Sample } from "../model/OData";

export default defineComponent({
  emits: ["sampleSelected"],
  data() {
    return { sample: {} as Sample };
  },
  setup() {},
  async created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      async (params) => {
        const data = await odata.get(`Samples('${params.id}')`).query();
        this.sample = data;
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {},
});
</script>
