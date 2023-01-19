<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <ui5-page id="controlsPage" background-design="List">
    <ui5-bar design="Header" slot="header">
      <div class="headerContent" slot="startContent">
        <img
          :src="logoUrl"
          alt="logo"
          slot="startContent"
          id="headerLogo"
        />
        UI5.ninja
      </div>
      <ui5-input
        slot="endContent"
        background-design="List"
        id="searchInput"
        @change="filterControls"
        :value="searchQuery"
        placeholder="Control ..."
        style="width: 100%"
      >
        <ui5-icon id="searchIcon" slot="icon" name="search"></ui5-icon>
      </ui5-input>
    </ui5-bar>

    <ui5-list
      mode="SingleSelect"
      growing="Scroll"
      v-on:load-more="loadMoreControls"
    >
      <template v-for="control in controls" :key="control.ID">
        <ui5-li-groupheader>{{ control.title }}</ui5-li-groupheader>
        <ui5-li
          v-for="sample in control.samples"
          :key="sample.ID"
          @click="clickSample(sample.ID)"
        >
          {{ sample.title }}</ui5-li
        >
      </template>
    </ui5-list>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents-fiori/dist/Bar.js";
import "@ui5/webcomponents-fiori/dist/Page.js";
import "@ui5/webcomponents/dist/Input";
import "@ui5/webcomponents/dist/List";
import "@ui5/webcomponents/dist/StandardListItem";
import "@ui5/webcomponents/dist/CustomListItem";
import "@ui5/webcomponents/dist/GroupHeaderListItem";
import { defineComponent } from "vue";
import type { Control } from "../model/OData";
import router from "./../router/index";
import DocuIndexGenerator from "@/util/DocuIndexGenerator";

const ITEMS_PER_PAGE = 15;

export default defineComponent({
  data() {
    return {
      logoUrl: new URL("../assets/images/logo.svg", import.meta.url).href,
      allControls: [] as Control[],
      controls: [] as Control[],
      controlsPage: 1,
      searchQuery: "",
    };
  },
  emits: ["sampleSelected"],
  setup() {},
  async mounted() {
    this.allControls = (await DocuIndexGenerator.generate(
      "1.96.7"
    )) as Control[];
    this.controls = this.fetchControls();
  },
  methods: {
    /**
     * filter control list by given string from event
     * @param e Event from input field entering
     */
    filterControls(e: { target: { value: string } }) {
      this.searchQuery = e.target.value;
      this.controlsPage = 1;
      this.controls = this.fetchControls();
    },

    /**
     * is fired, when sample in control/sample list is clicked
     * @param sampleId id of sample in odata
     */
    clickSample(sampleId: string) {
      router.push({ name: "Sample", params: { id: sampleId } });
    },

    /**
     * scroll to load of control/sample list
     */
    loadMoreControls() {
      this.controlsPage++;
      this.controls = [...this.controls, ...this.fetchControls()];
    },

    /**
     * fetches controls/samples from odata context and returns them async
     */
    fetchControls(): Control[] {
      return this.allControls
        .filter((control) => control.title.indexOf(this.searchQuery) > -1)
        .slice(
          (this.controlsPage - 1) * ITEMS_PER_PAGE,
          this.controlsPage * ITEMS_PER_PAGE
        );
    },
  },
});
</script>
