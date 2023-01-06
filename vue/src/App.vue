<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <ui5-flexible-column-layout layout="TwoColumnsMidExpanded" hide-arrows>
    <ControlsVue slot="startColumn" />
    <RouterView slot="midColumn" />
  </ui5-flexible-column-layout>
  <ui5-dialog id="error-sampleloading-dialog" header-text="Error" state="Error">
    <p>
      Sample konnte nicht geladen werden! Wählen Sie bitte ein anderes
      Sample.<br />"Esc" zum fortfahren drücken
    </p>
  </ui5-dialog>
</template>

<script setup lang="ts">
import "@ui5/webcomponents/dist/Dialog";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import "@ui5/webcomponents-fiori/dist/FlexibleColumnLayout.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import ControlsVue from "./components/ControlSection.vue";

self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
</script>

<style scoped></style>
