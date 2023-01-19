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
      <template v-for="file in files" :key="file.title">
        <ui5-tab v-bind:text="file.title" v-if="file.visible" />
      </template>
    </ui5-tabcontainer>
    <wc-monaco-editor
      id="editor"
      v-bind:language="language"
      @change="changeEditor"
      v-bind:value="code"
    ></wc-monaco-editor>
    <iframe
      style="display: none"
      src="/"
      frameborder="0"
      id="preview"
      height="75%"
      width="100%"
    ></iframe>
    <ui5-bar design="Footer" slot="footer">
      <ui5-button slot="endContent" icon="download" @click="download" />
    </ui5-bar>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents/dist/Label";
import "@ui5/webcomponents/dist/TabContainer";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents/dist/TabSeparator";
import "@vanillawc/wc-monaco-editor";
import download from "in-browser-download";
import ComponentGenerator from "./../util/ComponentGenerator";
import DocuIndexGenerator from "@/util/DocuIndexGenerator";

import { defineComponent } from "vue";

import type { Sample } from "../model/OData";

import axios from "axios";
import type { Dialog } from "../ui5/Dialog";

export interface File {
  title: string;
  content: string;
  visible: boolean;
}

interface Manifest {
  [index: string]: {
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
      currentFile: {} as File,
    };
  },
  mounted: function () {},
  setup() {},
  async created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      async (params) => {
        this.files = [];

        // store id from url for later usage
        this.id = params.id as string;
        // get Sample from OData
        // FIXME: get this.sample
        const sampleId = this.id.split("-")[0];
        const controlId = this.id.split("-")[1];

        this.sample = await DocuIndexGenerator.getSample(controlId, sampleId);

        // load manifest of sample files
        try {
          const manifest = (await axios.get(this.getUrl("manifest.json")))
            .data as Manifest;

          // iterate over files in manifest and assign to view
          const files = manifest["sap.ui5"].config.sample.files;
          for (let filename of files) {
            const visible = filename === "manifest.json" ? false : true;
            const content = (
              await axios.get(this.getUrl(filename), {
                responseType: "text",
              })
            ).data;
            this.files.push({
              title: filename,
              content,
              visible,
            });
            this.execute();
          }
        } catch (error) {
          const dialog = document.getElementById(
            "error-sampleloading-dialog"
          )! as Dialog;
          dialog.show();
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    );
  },
  methods: {
    download: async function () {
      const content = await ComponentGenerator.generate(
        this.files as File[],
        this.sample.namespace,
        this.sample.namespace.replace(/\./g, "/")
      );
      download(content, this.sample.namespace + ".html", "text/html");
    },
    changeEditor: function (event: { currentTarget: { value: string } }) {
      this.currentFile.content = event.currentTarget.value;
    },
    getFile: function (filename: string) {
      return this.files.find((element: File) => element.title === filename);
    },
    execute: async function () {
      document.getElementById("editor")!.style.display = "none";
      document.getElementById("preview")!.style.display = "block";
      const iframe = document.getElementById("preview")! as HTMLIFrameElement;
      const content = await ComponentGenerator.generate(
        this.files as File[],
        this.sample.namespace,
        this.sample.namespace.replace(/\./g, "/")
      );
      iframe.src = `data:text/html;charset=utf-8,${content}`;
    },
    selectFile: function (event: {
      detail: { tab: { text: string }; tabIndex: number };
    }) {
      // FIXME: dirty fix, because changeEditor is not called at the moment... check why?
      if (document.getElementById("editor")!.style.display === "block") {
        this.currentFile.content = document.getElementById("editor")!.value;
      }
      if (event.detail.tabIndex === 0) {
        this.execute();
      } else {
        document.getElementById("editor")!.style.display = "block";
        document.getElementById("preview")!.style.display = "none";
        const extension = event.detail.tab.text.split(".").pop();
        this.currentFile = this.getFile(event.detail.tab.text)!;
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
      let parsed = /.*\.([^.]*)-(.*)\.[^.]*$/m.exec(this.id as string)!;

      let lib = parsed[2].replace(/\./g, "/");
      let name = parsed[1];
      return `https://ui5.sap.com/1.96.7/test-resources/${lib}/demokit/sample/${name}/${filename}`;
    },
  },
});
</script>
