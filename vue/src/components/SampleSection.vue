<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <!-- middle column -->
  <ui5-page disable-scrolling>
    <ui5-bar design="Header" slot="header">
      <ui5-label>{{ sample.title }}</ui5-label>
    </ui5-bar>
    <p>
      {{ sample.description }}
    </p>
    <ui5-tabcontainer
      class="full-width"
      collapsed
      fixed
      v-on:tab-select="selectFile"
    >
      <ui5-tab icon="media-play" design="Positive" selected="false"></ui5-tab>
      <ui5-tab-separator />
      <ui5-tab
        v-bind:text="file.title"
        v-for="(file, index) in files"
        :key="file.title"
        v-bind:selected="index === 0"
      >
      </ui5-tab>
    </ui5-tabcontainer>
    <wc-monaco-editor
      id="editor"
      v-bind:language="language"
      v-bind:value="code"
    ></wc-monaco-editor>
    <iframe
      style="display: none"
      src="/"
      frameborder="0"
      id="preview"
      height="100%"
      width="100%"
    ></iframe>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents/dist/Label";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@vanillawc/wc-monaco-editor";

import { o } from "odata";
const odata = o("/browses/");

import { defineComponent } from "vue";

import type { Sample } from "../model/OData";

import axios from "axios";

interface File {
  title: string;
  content: string;
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
    return {
      sample: {} as Sample,
      manifest: {},
      files: [] as File[],
      id: "",
      code: " ",
      language: "javascript",
    };
  },
  mounted: function () {},
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
          const content = (await axios.get(this.getUrl(filename))).data;
          this.files.push({
            title: filename,
            content,
          });
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    getFile: function (filename: string) {
      return this.files.find((element: File) => element.title === filename);
    },
    execute: () => {},
    selectFile: function (event: {
      detail: { tab: { text: string }; tabIndex: number };
    }) {
      if (event.detail.tabIndex === 0) {
        document.getElementById("editor").style.display = "none";
        document.getElementById("preview").style.display = "block";
        this.execute();
      } else {
        document.getElementById("editor").style.display = "block";
        document.getElementById("preview").style.display = "none";
        const extension = event.detail.tab.text.split(".").pop();
        switch (extension) {
          case "json":
            {
              this.code = JSON.stringify(
                this.getFile(event.detail.tab.text)?.content
              );
              this.language = "json";
            }
            break;
          case "xml":
            {
              this.language = "xml";
              this.code = this.getFile(event.detail.tab.text)?.content || "";
            }
            break;
          case "javascript":
            {
              this.language = "javascript";
              this.code = this.getFile(event.detail.tab.text)?.content || "";
            }
            break;
          default:
            {
              this.code = this.getFile(event.detail.tab.text)?.content || "";
            }
            break;
        }
      }
    },
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
