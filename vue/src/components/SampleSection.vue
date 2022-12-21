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
    <ui5-tabcontainer class="full-width">
      <ui5-tab v-bind:text="file.title" v-for="file in files" :key="file.title">
        <ui5-label>
          {{ file.contents }}
        </ui5-label>
      </ui5-tab>
    </ui5-tabcontainer>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents/dist/Label";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";

import { o } from "odata";
const odata = o("/browses/");

import { defineComponent } from "vue";

import type { Sample } from "../model/OData";

import axios from "axios";

interface File {
  title: string;
  contents: string;
}

interface Manifest {
  "sap.ui5": {
    config: {
      sample: {
        files: string[];
      };
    };
  };
}

export default defineComponent({
  emits: ["sampleSelected"],
  data() {
    return { sample: {} as Sample, manifest: {}, files: [] as File[], id: "" };
  },
  setup() {},
  async created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      async (params) => {
        // store id from url for later usage
        this.id = params.id as string;
        // get Sample from OData
        const data = await odata.get(`Samples('${params.id}')`).query();
        this.sample = data;

        // load manifest of sample files
        this.manifest = (await axios.get(this.getUrl("manifest.json")))
          .data as Manifest;

        this.files = [];
        // iterate over files in manifest and assign to view
        for (let filename of this.manifest["sap.ui5"].config.sample.files) {
          const contents = (await axios.get(this.getUrl(filename))).data;
          this.files.push({
            title: filename,
            contents,
          });
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    getUrl(filename: string): string {
      let [total, name, lib] = /.*\.([^.]*)-(.*)\.[^.]*$/m.exec(
        this.id as string
      );
      lib = lib.replaceAll(".", "/");
      return `http://ui5.sap.com/1.96.7/test-resources/${lib}/demokit/sample/${name}/${filename}`;
    },
  },
});
</script>
