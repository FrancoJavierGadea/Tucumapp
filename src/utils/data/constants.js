import path from "node:path"



export const DATA_TYPES = {
    RECORRIDO: 'recorrido',
    METADATA: 'metadata',
    PARADAS: 'paradas'
}


export const PUBLIC_FOLDER = path.join(import.meta.dirname, '../../../public');

export const DATA_FOLDER = path.join(import.meta.dirname, '../../../public/data');

