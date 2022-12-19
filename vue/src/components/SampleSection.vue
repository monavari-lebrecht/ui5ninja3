<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <!-- middle column -->
  <ui5-page slot="midColumn">
    <ui5-bar design="Header" slot="header">
      <h2>{{ Sample.title }}</h2>
    </ui5-bar>
    <div>
      <p>{{ Sample.description }}</p>
      <ui5-list id="col2list">
        <ui5-tabcontainer class="full-width" fixed>
          <template v-for="file in Sample.files" v-bind:key="file.title">
            <ui5-tab :text="file.title">
              <div ref="editor-{{file.title}}" style="height: 1000px"></div>
            </ui5-tab>
          </template> </ui5-tabcontainer
      ></ui5-list>
    </div>
  </ui5-page>
</template>

<script lang="ts">
import "@ui5/webcomponents/dist/Input";
import "@ui5/webcomponents/dist/List";
import "@ui5/webcomponents/dist/StandardListItem";
import "@ui5/webcomponents/dist/CustomListItem";
import "@ui5/webcomponents/dist/GroupHeaderListItem";
import { o } from "odata";
import { defineComponent } from "vue";
const odata = o("/browses/");
import type { Control, Sample } from "../model/OData";

export default defineComponent({
  data() {
    return {
      Sample: {
        title: "test",
      },
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
      this.$emit("sampleSelected", sampleId);
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
