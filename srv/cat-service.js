module.exports = (db) => {
    const request = require("request")
    const VERSION = "1.96.7"

    const { Controls: Controls, Samples: Samples } = db.entities();

    let libraries = [
        "sap/ui/core",
        "sap/m",
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
        "sap/ui/mdc"
    ];
    const promises = libraries.map((lib) => {
        return new Promise((resolve, reject) => {
            request(`http://ui5.sap.com/${VERSION}/test-resources/${lib}/demokit/docuindex.json`, (error, response, body) => {
                let jsonResponse;

                if (!response) {
                    resolve(lib);
                    return;
                }

                if (response.statusCode === 404) {
                    resolve(lib);
                    return;
                } else {
                    jsonResponse = JSON.parse(body);
                    if (!jsonResponse.explored) {
                        resolve(lib);
                        return;
                    }
                }

                const entities = [];
                const promises = [];
                const samples = [];
                jsonResponse.explored.entities.forEach(entity => {
                    entities.push([
                        entity.id,
                        entity.name,
                        entity.since
                    ])
                    if (entity.samples) {
                        entity.samples.forEach((sampleId) => {
                            const sample = jsonResponse.explored.samples.find((item) => {
                                return item.id === sampleId
                            })
                            if (sample) {
                                samples.push([
                                    `${sampleId}-${entity.id}`,
                                    sample.name,
                                    sample.description,
                                    entity.id
                                ]);
                            }
                        })
                    }
                });
                promises.push(cds.run([
                    INSERT.into(Controls).columns(
                        'ID',
                        'title',
                        'since'
                    ).rows(
                        entities
                    )
                ]));
                promises.push(cds.run([
                    INSERT.into(Samples).columns(
                        'ID',
                        'title',
                        'description',
                        'control_ID'
                    ).rows(
                        samples
                    )
                ]));
                Promise.all(promises).then(() => {
                    console.log(`${lib} Done`)
                    resolve();
                })
            })
        })
    })

    return Promise.all(promises).then((lib) => {
        if (lib) {
            console.error(`Error on parsing ${lib}`)
        }
    })
}