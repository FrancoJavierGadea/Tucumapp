import fs from "node:fs";
import path from "node:path";




const endpoints = getEndpoints();


//MARK: API Object
function getAPIObject(endpoints) {

    // Generate API object
    const API = endpoints.reduce((acc, endpoint) => {

        const folders = endpoint.split("/").slice(1, -1);

        const file = endpoint.split("/").pop().replace(".geojson", "");

        let aux = acc;

        for (const folder of folders) {

            if (!aux[folder]) {

                aux[folder] = {};
            }

            aux = aux[folder];
        }

        aux[file] = endpoint;
        
        return acc;

    }, {});

    return API;
}

const API = getAPIObject(endpoints);

// Write API object to file
fs.writeFileSync(path.join(import.meta.dirname, 'api.json'), JSON.stringify(API, null, 2));




//MARK: Generate API Markdown
function writeAPIMarkdown(API) {

    const host = 'http://localhost:4321';

    const fn = (obj, level = 1) => {

        let markdown = "";

        for (const key in obj) {

            const name = key.slice(0, 1).toUpperCase() + key.replaceAll('-', ' ').slice(1);

            markdown += [
                `## ${name}`, 
                `\n\n- ### Linea ${name}`, 
                `\n\n\t- ${name}: `,
                `\n\t\t[**${name}**](` 
            ]
            .at(level - 1) || '';

            if (typeof obj[key] === "string") {

                markdown += `${host}${obj[key]})`;
            }
            else {

                markdown += fn(obj[key], level + 1);
            }
        }

        return markdown;
    }

    const markdown = fn(API.data);

    return markdown;
}

const md = writeAPIMarkdown(API);

fs.writeFileSync(path.join(import.meta.dirname, 'api.md'), md);