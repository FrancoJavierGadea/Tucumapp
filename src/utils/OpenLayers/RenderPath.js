import { fromLonLat, transform, useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js"
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape.js";
import Fill from "ol/style/Fill";
import { Point } from "ol/geom";
import Group from "ol/layer/Group.js";

export function renderPath(geojson, style = {}){

    const {color = '#0c19ca'} = style;

    const source = new VectorSource({

        features: new GeoJSON().readFeatures(geojson),
    });

    const pathLayer = new VectorLayer({
        source,
        style: new Style({
            stroke: new Stroke({
                color,
                width: 2
            })
        }),
        updateWhileInteracting: true
    });

    const arrowsLayer = new VectorLayer({
        source,
        style: (feature) => {

            const geometry = feature.getGeometry(); 

            const styles = []

            //Arrows
            geometry.forEachSegment(function (start, end) {

                const dx = end[0] - start[0];
                const dy = end[1] - start[1];

                const rotation = Math.atan2(dy, dx);

                // arrows
                styles.push(
                  new Style({
                    geometry: new Point(end),
                    image: new RegularShape({
                        points: 3,
                        radius: 6,
                        rotation: -rotation,
                        angle: Math.PI / 2,
                        fill: new Fill({ color }),
                        rotateWithView: true
                    })
                  }),
                );
            });

            return styles;
        }
    });

    return new Group({
        layers: [pathLayer, arrowsLayer]
    });
}