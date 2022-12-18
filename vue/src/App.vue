<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <ui5-flexible-column-layout layout="TwoColumnsMidExpanded" hide-arrows>
    <ControlsVue slot="startColumn"></ControlsVue>
    <ui5-page slot="midColumn">
      <ui5-bar></ui5-bar>
    </ui5-page>
  </ui5-flexible-column-layout>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@webcomponents/shadydom/shadydom.min.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Button";
import "@ui5/webcomponents/dist/Tab";
import "@ui5/webcomponents-fiori/dist/Page";
import "@ui5/webcomponents/dist/StandardListItem.js";
import "@ui5/webcomponents-fiori/dist/FlexibleColumnLayout.js";
import "@ui5/webcomponents-fiori/dist/Bar";
import "@ui5/webcomponents/dist/Label";
import "@ui5/webcomponents/dist/MessageStrip";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import ControlsVue from "./components/ControlSection.vue";
</script>

<style scoped></style>
