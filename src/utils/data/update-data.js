import fs from "node:fs";
import path from "node:path";
import * as turf from "@turf/turf";


/**
 * Recorre por cada archivo de la carpeta y aplica el callback
 * @param {String} folderPath 
 * @param {({file:String, folder:String, dataType:String}) => {}} callback 
 */
export function eachFile(folderPath, callback = () => {}){

    const fn = (dir = folderPath) => {

        const files = fs.readdirSync(dir);

        files.forEach(name => {
    
            const filePath = path.join(dir, name)
    
            if(fs.statSync(filePath).isDirectory()){
    
                fn(filePath);
            }
            else {

                const ext = path.extname(filePath);

                if(['.json', '.geojson']) callback({
                    file: filePath,
                    folder: path.dirname(filePath),
                    dataType: path.basename(filePath).replace(ext, '')
                });
            }

        });
    }

    fn();
}


/**
 * 
 * @param {String} folderPath Data folder path
 */
export function updateMetadata(folderPath = import.meta.dirname){

    //Calcular las distancias de cada recorrido
    eachFile(folderPath, ({file, folder, dataType}) => {

        if(dataType === 'recorrido'){

            const json = JSON.parse(
                fs.readFileSync(file, {encoding: 'utf-8'})
            );

            const coordinates = json.features.at(0).geometry.coordinates;

            //CALCULANDO LA DISTANCIA
            const line = turf.lineString(coordinates);

            const length = turf.length(line, {units: 'kilometers'}).toFixed(2);


            //UPDATE METADATA
            const metadataPath = path.join(folder, 'metadata.json');

            const metadata = JSON.parse(
                fs.readFileSync(metadataPath, {encoding: 'utf-8'})
            )

            metadata.length_km = +length;

            console.log(metadata);

            fs.writeFileSync(
                metadataPath,
                JSON.stringify(metadata, null, 2),
                {encoding: 'utf-8'}
            );
        }
    });
}