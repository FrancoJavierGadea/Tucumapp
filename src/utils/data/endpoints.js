import fs from "node:fs";
import path from "node:path";

/**
 * Retorna todos los endpoints de /data
 * 
 * @param {String} folderPath Data folder path, default: dirname 
 * @returns {String[]}
 */
export function getEndpoints(folderPath = import.meta.dirname) {

    const fn = (dir = folderPath) => {

        const files = fs.readdirSync(dir);
    
        const result = [];
    
        for (const file of files) {
            
            const filePath = path.join(dir, file);
    
            if(fs.statSync(filePath).isDirectory()) {
    
                result.push(...fn(filePath));
            }
            else {
                
                const fileExtension = path.extname(filePath);
    
                if([".geojson", ".json"].includes(fileExtension)) {
    
                    const endpoint = filePath
                        .replace(path.join(folderPath, '..'), '')
                        .replace(/\\/g, "/");
    
                    result.push(endpoint);
                }
            }
        }

        return result;
    }

    return fn();
}


/**
 * Retorna todos los endpoints junto con los detalles de cada ruta
 * 
 * @param {String} folderPath Data folder path, default: dirname 
 * @returns {Array<{endpoint, category, line, direction, dataType}>}
 */
export function getEndpointsData(folderPath = import.meta.dirname) {

    const endpoints = getEndpoints(folderPath);

    const regex = /\/data\/(.*?)\/(.*?)\/(.*?)\/(.*)\.(geojson|json)$/;

    const endpointsData = endpoints.map(endpoint => {

        const [_, category, line, direction, dataType] = endpoint.match(regex) || [];

        return {endpoint, category, line, direction, dataType};
    });    

    return endpointsData;
}


/**
 * Genera un objeto agrupando los endpoints segun la categoria, linea, direccion...
 * como en la estructura de carpetas
 * 
 * @param {String} folderPath Data folder path, default: dirname 
 * @returns {Object}
 */
export function getAPIObject(folderPath = import.meta.dirname) {

    const data = getEndpointsData(folderPath);

    const API = data.reduce((acc, {endpoint, category, line, direction, dataType}) => {


        let aux = acc;

        [category, line, direction].forEach(folder => {

            if (!aux[folder]) {

                aux[folder] = {};
            }

            aux = aux[folder];
        });

        aux[dataType] = endpoint;


        return acc;

    }, {});

    return API;
}





