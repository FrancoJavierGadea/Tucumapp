
import { getEndpointsData } from "./endpoints.js";

/**
 * Genera un markdown listando todos los endpoints de /data
 * 
 * @param {String} folderPath Data folder path, default: dirname
 * @param {{host:string}} opt 
 * @returns {String}
 */
export function getMarkdown(folderPath = import.meta.dirname, opt = {}) {

    const {host = 'http://localhost:4321'} = opt;

    const data = Object.groupBy(getEndpointsData(folderPath), ({category}) => category);

    let text = '';

    const capitalize = (text) => `${text.at(0).toUpperCase()}${text.slice(1)}`

    for (const category in data) {

        text += `## ${capitalize(category)}`;

        const lines = Object.groupBy(data[category], ({line}) => line);

        for (const line in lines) {
            
            const routes = Object.groupBy(lines[line], ({direction}) => direction);

            text += `\n\n- \`Linea ${line}\``;

            for (const route in routes) {

                const routeData = routes[route];
                    
                text += `\n\t- **${capitalize(route.replaceAll('-', ' '))}**: `; 

                routeData.forEach(({endpoint, dataType}) => {
        
                    text += `[${capitalize(dataType)}](${host + endpoint}) `;
                });
            }
                
        }
        
        text += '\n\n<br>\n\n';
    }

    return `${text}`;
}