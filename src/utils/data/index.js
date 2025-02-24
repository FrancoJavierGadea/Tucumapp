import path from "path";
import { DATA_FOLDER } from "./constants.js";
import { readJSON, writeJSON } from "./update/utils.js";
import { slitLineString } from "./update/geojson-utils.js";


const file = path.join(DATA_FOLDER, 'interurbano/131/lomas-de-tafi/recorrido.v2.geojson');


const json = readJSON(file);


const splitJson = slitLineString(json.features[0], 10);

const output = path.join(DATA_FOLDER, 'interurbano/131/lomas-de-tafi/recorrido.v2.split.geojson');

writeJSON(output, splitJson);


