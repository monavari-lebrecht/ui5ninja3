import Handlebars from "handlebars";
import axios from "axios";

const ComponentGenerator = {
  async generate(
    files: {
      title: string;
      content: string;
    }[],
    namespace: string,
    namespacePath: string
  ) {
    const url = new URL("../assets/iframe.hbs", import.meta.url).href;
    const file = await axios.get(url);
    const template = Handlebars.compile(file.data);
    const filesForTemplate = files.map((file) => {
      const content = file.content.replace(/\n/gm, "\\n").replace(/'/gm, "\\'");
      return {
        title: file.title,
        content,
      };
    });

    return template({
      files: filesForTemplate,
      namespace,
      namespacePath,
    });
  },
};

export default ComponentGenerator;
