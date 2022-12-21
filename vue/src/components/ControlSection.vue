<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <ui5-page id="controlsPage" background-design="List">
    <ui5-bar design="Header" slot="header">
      <div class="headerContent" slot="startContent">
        <img
          src="/src/assets/logo.svg"
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
import { o } from "odata";
import { defineComponent } from "vue";
const odata = o("/browses/");
import type { Control } from "../model/OData";
import router from "./../router/index";

export default defineComponent({
  data() {
    return {
      controls: [] as Control[],
      controlsPage: 0,
      searchQuery: "",
    };
  },
  emits: ["sampleSelected"],
  setup() {},
  mounted() {
    (async () => {
      this.controls = await this.fetchControls();
    })();
  },
  methods: {
    /**
     * filter control list by given string from event
     * @param e Event from input field entering
     */
    filterControls(e: { target: { value: string } }) {
      this.searchQuery = e.target.value;
      this.controls = [];
      this.controlsPage = 0;
      (async () => {
        this.controls = await this.fetchControls();
      })();
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
      (async () => {
        const moreControls = await this.fetchControls();
        this.controls = [...this.controls, ...moreControls];
      })();
    },

    /**
     * fetches controls/samples from odata context and returns them async
     */
    async fetchControls(): Promise<Control[]> {
      return new Promise((resolve) => {
        odata
          .get("Controls")
          .query({
            $search: encodeURIComponent(this.searchQuery),
            $top: 30,
            $skip: this.controlsPage * 30,
            $expand: "samples",
          })
          .then((data) => {
            resolve(data);
          });
      });
    },
  },
});
</script>
