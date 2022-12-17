<template>
  <ui5-page id="controlsPage" slot="startColumn">
    <ui5-bar design="Header" slot="header">
      <ui5-input
        background-design="List"
        id="searchInput"
        @change="filterControls"
        :value="searchQuery"
        placeholder="Enter search criteria ..."
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
      <template v-for="control in controls">
        <ui5-li-groupheader :key="control.ID">{{
          control.title
        }}</ui5-li-groupheader>
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

<script>
import "@ui5/webcomponents/dist/Input";
import "@ui5/webcomponents/dist/List";
import "@ui5/webcomponents/dist/StandardListItem";
import "@ui5/webcomponents/dist/CustomListItem";
import "@ui5/webcomponents/dist/GroupHeaderListItem";
import { o } from "odata";
const odata = o("/browses/");

export default {
  data() {
    return {
      controls: [],
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
    filterControls(e) {
      this.searchQuery = e.target.value;
      this.controls = [];
      this.controlsPage = 0;
      (async () => {
        this.controls = await this.fetchControls();
      })();
    },
    loadMoreControls() {
      this.controlsPage++;
      (async () => {
        const moreControls = await this.fetchControls();
        this.controls = [...this.controls, ...moreControls];
      })();
    },
    clickSample(sampleId) {
      this.$emit("sampleSelected", sampleId);
    },

    fetchControls() {
      return new Promise((resolve) => {
        resolve(
          odata.get("Controls").query({
            $search: encodeURIComponent(this.searchQuery),
            $top: 30,
            $skip: this.controlsPage * 30,
            $expand: "samples",
          })
        );
      });
    },
  },
};
</script>

