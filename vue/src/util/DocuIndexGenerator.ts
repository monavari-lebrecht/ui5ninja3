import axios from "axios";
import { sortBy } from "lodash";
import type { Sample } from "../model/OData";

let libraries = [
  "sap/m",
  "sap/ui/core",
  "sap/ui/comp",
  "sap/ui/export",
  "sap/ui/richtexteditor",
  "sap/ui/vbm",
  "sap/ui/vk",
  "sap/ui/vtm",
  "sap/uxap",
  "sap/tnt",
  "sap/f",
  "sap/ui/unified",
  "sap/ui/table",
  "sap/ui/layout",
  "sap/ui/integration",
  "sap/ui/codeeditor",
  "sap/ui/mdc",
];

export default {
  generate: async function (version: string) {
    const controls = [] as {}[];
    for (const lib of libraries) {
      const url = `http://ui5.sap.com/${version}/test-resources/${lib}/demokit/docuindex.json`;
      const data = await axios.get(url);
      const jsonResponse = data.data;

      for (const entity of jsonResponse.explored.entities) {
        if (entity.samples) {
          const control = {
            ID: entity.id,
            title: entity.name,
            since: entity.since,
            samples: [] as Sample[],
          };
          for (const sampleId of entity.samples) {
            const sample = jsonResponse.explored.samples.find(
              (item: { id: string }) => {
                return item.id === sampleId;
              }
            );
            if (sample) {
              control.samples.push({
                ID: `${sampleId}-${entity.id}`,
                title: sample.name,
                description: sample.description,
                namespace: sample.id,
                control_ID: entity.id,
              });
            }
          }
          controls.push(control);
        }
      }
    }

    // sort them
    return sortBy(controls, ["title"]);
  },
};
