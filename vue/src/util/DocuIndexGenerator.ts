import axios from "axios";
import { sortBy } from "lodash";
import type { Sample } from "../model/OData";

const libraries = [
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
const controls = [] as { ID: string; samples: Sample[] }[];

const DocuIndexGenerator = {
  getSample: async (controlId: string, sampleId: string): Promise<Sample> => {
    const control = controls.find((control) => control.ID === controlId)!;
    const sample = control.samples.find(
      (sample) => sample.namespace === sampleId
    )!;
    return sample;
  },
  getControls: () => {
    return controls;
  },
  generate: async function (version: string = "1.96.7") {
    for (const lib of libraries) {
      const url = `https://ui5.sap.com/${version}/test-resources/${lib}/demokit/docuindex.json`;
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

export default DocuIndexGenerator;
