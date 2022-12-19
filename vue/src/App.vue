<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <ui5-flexible-column-layout layout="TwoColumnsMidExpanded" hide-arrows>
    <ControlsVue slot="startColumn" />
    <RouterView slot="midColumn" />
  </ui5-flexible-column-layout>
</template>

<script setup lang="ts">
import "@ui5/webcomponents-fiori/dist/FlexibleColumnLayout.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import ControlsVue from "./components/ControlSection.vue";
</script>

<style scoped></style>
