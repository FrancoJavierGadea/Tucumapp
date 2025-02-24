

export function slitLineString(feature, fragments = 10){

    const totalPoints = feature.geometry.coordinates.length;

    const fragmentSize = Math.floor(totalPoints / fragments);

    const fragmentsArray = [];

    for (let i = 0; i < fragments; i++) {

        const start = i * fragmentSize;

        const end = (i + 1) * fragmentSize;

        const fragment = feature.geometry.coordinates.slice(start, end);

        fragmentsArray.push(fragment);
    }

    return {
        type: 'FeatureCollection',
        features: fragmentsArray.map((coordinates, index) => {
            return {
                type: 'Feature',
                properties: {
                    index,
                    totalFragments: fragments
                },
                geometry: {
                    type: 'LineString',
                    coordinates,
                }
            }
        })
    }
}