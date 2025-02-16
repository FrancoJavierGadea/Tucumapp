import path from 'node:path';
import fs from 'node:fs';
import { getAPIObject, getEndpoints, getEndpointsData } from './endpoints.js';
import { getMarkdown } from './markdown.js';
import { addMetadata } from './update-metadata.js';


const DATA_FOLDER = path.join(import.meta.dirname, '../../../public/data');


// //Endpoints
// const api = getAPIObject(DATA_FOLDER);

// //fs.writeFileSync(path.join(DATA_FOLDER, '../data.json'), JSON.stringify(api, null, 2));


// //Endpoints mardown
// const md = getMarkdown(DATA_FOLDER);

// //fs.writeFileSync(path.join(DATA_FOLDER, '../endpoints.md'), md);


addMetadata(DATA_FOLDER);