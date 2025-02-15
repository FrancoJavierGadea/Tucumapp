import fs from "node:fs";
import path from "node:path";


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


    eachFile(folderPath, ({file, folder, dataType}) => {

        if(dataType === 'recorrido'){

            if(fs.existsSync(path.join(folder, 'metadata.json'))){
                
              
                const direction = path.basename(folder).replaceAll('-', ' ');

                const line = path.basename(path.join(folder, '..'))

                const rawJSON = JSON.stringify({
                    name: `Linea ${line}`,
                    direction: `${direction.at(0).toUpperCase()}${direction.slice(1)}`,
                    length_km: 0.0,
                    category: path.basename(path.join(folder, '../..'))
                }, null, 2);
       
                fs.writeFileSync(path.join(folder, 'metadata.json'), rawJSON, {encoding: 'utf-8'});
            }
        }
    });
}