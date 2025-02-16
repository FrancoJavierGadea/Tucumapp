import { DATA_TYPES } from "./constants.js";
import { eachFile, readJSON, writeJSON } from "./update-data.js";
import * as turf from "@turf/turf";

/**
 * Calcula la distancia en km de cada recorrido y actualiza la propiedad `length_km` de los `metadata.json`
 * @param {String} folderPath Data folder path
 */
export function updateLengthKM(folderPath){

    eachFile(folderPath, ({dataType, file, folder}) => {

        if(dataType === DATA_TYPES.RECORRIDO){

            const json = readJSON(file);

            const coordinates = json.features.at(0).geometry.coordinates;

            //CALCULANDO LA DISTANCIA
            const line = turf.lineString(coordinates);

            const length = turf.length(line, {units: 'kilometers'}).toFixed(2);

            //UPDATE METADATA
            const metadataPath = path.join(folder, 'metadata.json');

            const metadata = readJSON(metadataPath);

            metadata.length_km = +length;

            console.log(metadata);

            //writeJSON(metadataPath, metadata);
        }
    });
}