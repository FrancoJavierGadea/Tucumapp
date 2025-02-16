import fs from "node:fs";
import path from "node:path";



/**
 * Recorre por cada archivo json o geojson de la carpeta data
 * 
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

export function readJSON(path){

    return JSON.parse(
        fs.readFileSync(path, {encoding: 'utf-8'})
    );
}

export function writeJSON(path, json){

    fs.writeFileSync(
        path,
        JSON.stringify(json, null, 2),
        {encoding: 'utf-8'}
    );
}