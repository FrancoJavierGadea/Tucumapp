import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js"
import { XYZ } from "ol/source.js";
import { fromLonLat, transform, useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js"
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import RegularShape from "ol/style/RegularShape.js";
import Fill from "ol/style/Fill";
import { Point } from "ol/geom";

useGeographic();

export class CustomMap extends HTMLElement {

    static get observedAttributes() {
        return ['zoom', 'zoom-min', 'zoom-max', 'tiles-url', 'center', 'rotate'];
    }

    static defaultValues = {
        zoom: 12,
        zoomMin: 1,
        zoomMax: 18,
        tilesURL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        center: [-65.2087, -26.83,],
        rotate: 0 
    }

    attributeChangedCallback(name){

        switch(name){

            case 'zoom':
                this.map.getView().setZoom(this.zoom);
                break;

            case 'zoom-min':
                this.map.getView().setMinZoom(this.zoomMin);
                break;

            case 'zoom-max':
                this.map.getView().setMaxZoom(this.zoomMax);
                break;

            case 'center':
                this.map.getView().setCenter(this.center);
                break;

            case 'tiles-url':

                this.#tilesLayer.getSource().setUrl(this.tilesURL);
                break;

            case 'rotate':
                this.map.getView().setRotation(this.rotate * (Math.PI / 180));
                break;
        }
    }

    #tilesLayer = null;

    constructor(){
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                @import url("${''}");

                :host {
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    display: block;
                    position: relative;
                }

                .Map-container {
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div class="Map-container"></div>
        `;


        this.#tilesLayer = new TileLayer({
            source: new XYZ({
                url: this.tilesURL
            })
        });

        this.map = new Map({
            target: this.shadowRoot.querySelector('.Map-container'),
            layers: [ this.#tilesLayer ],
            view: new View({
                center: this.center,
                zoom: this.zoom,
                maxZoom: this.zoomMax,
                minZoom: this.zoomMin,
                rotation: this.rotate
            }),
            controls: []
        })

        this.renderPath();
    }


 //MARK: Getters and Setters

    get zoom(){ 
        const attr = this.getAttribute('zoom');

        return Number(attr ?? CustomMap.defaultValues.zoom); 
    }
    set zoom(value){ 

        value ? this.setAttribute('zoom', value) : this.removeAttribute('zoom');
    }

    get zoomMin(){ 

        const attr = this.getAttribute('zoom-min');

        return Number(attr ?? CustomMap.defaultValues.zoomMin); 
    }
    set zoomMin(value){ 

        value ? this.setAttribute('zoom-min', value) : this.removeAttribute('zoom-min'); 
    }

    get zoomMax(){ 

        const attr = this.getAttribute('zoom-max');

        return Number(attr ?? CustomMap.defaultValues.zoomMax); 
    }
    set zoomMax(value){ 

        value ? this.setAttribute('zoom-max', value) : this.removeAttribute('zoom-max');
    }

    get center(){ 
        const attr = this.getAttribute('center');

        return attr ? JSON.parse(`[${attr}]`) : CustomMap.defaultValues.center;
    }
    set center(value){

        value ? this.setAttribute('center', value) : this.removeAttribute('center');
    }

    get tilesURL(){ 

        return this.getAttribute('tiles-url') ?? CustomMap.defaultValues.tilesURL;
    }
    set tilesURL(value){

        value ? this.setAttribute('tiles-url', value) : this.removeAttribute('tiles-url');
    }

    get rotate(){

        const attr = this.getAttribute('rotate');

        return Number(attr ?? CustomMap.defaultValues.rotate); 
    }
    set rotate(value){

        value ? this.setAttribute('rotate', value) : this.removeAttribute('rotate');
    }
    
 //
    getConfigValues(){

        return Object.keys(CustomMap.defaultValues).reduce((acc, key) => {

            acc[key] = this[key];

            return acc;

        }, {});
    }
 
 
 //MARK: Render Path
    #pathLayers = new Set();

    async renderPath(src = 'http://localhost:4321/data/urbano/3/lavalle/recorrido.geojson'){
        
        const response = await fetch(src);

        const json = await response.json();

        const source = new VectorSource({

            features: new GeoJSON().readFeatures(json),
        });

        const color = '#0c19ca';

        const pathLayer = new VectorLayer({
            source,
            style: new Style({
                stroke: new Stroke({
                    color,
                    width: 3
                })
            })
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

        this.#pathLayers
            .add({pathLayer, arrowsLayer});
        
        this.map.getLayers().push(pathLayer);
        this.map.getLayers().push(arrowsLayer);
    }

}