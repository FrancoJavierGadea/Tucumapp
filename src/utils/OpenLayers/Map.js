import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js"
import { XYZ } from "ol/source.js";
import {defaults as InteractionDefaults} from 'ol/interaction/defaults';
import DragRotate from 'ol/interaction/DragRotate.js';
import * as Condition from 'ol/events/condition.js'
import { Zoom, ScaleLine, FullScreen, Rotate } from 'ol/control.js';


//MARK: Icons
import zoomIn_icon from "bootstrap-icons/icons/zoom-in.svg?raw";
import zoomOut_icon from "bootstrap-icons/icons/zoom-out.svg?raw";
import fullscreen_icon from "bootstrap-icons/icons/arrows-fullscreen.svg?raw";
import rotation_icon from "bootstrap-icons/icons/arrow-repeat.svg?raw";
import { renderPath } from "./RenderPath.js";
import { useGeographic } from "ol/proj.js";

function parseIcon(rawSvg){

    const div = document.createElement('div');

    div.innerHTML = rawSvg;

    return div;
}



useGeographic();


//MARK: Class OpenMap
/**
 * @typedef {Object} MapConfig
 *  @property {number[]} center center the map `[LONGITUDE, LATITUDE]`, default: Tucuman
 * 
 */

export default class OpenMap {

    /** @type {MapConfig} */
    static defaultValues = {
        zoom: 12,
        zoomMin: 1,
        zoomMax: 18,
        tilesURL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        center: [-65.2087, -26.83,],
        rotate: 0,
    }

    #tilesLayer = null;

    /**
     * @constructor
     * @param {MapConfig} params 
     */
    constructor(params = {}){

        for (const key in OpenMap.defaultValues) {
            
            params[key] ??= OpenMap.defaultValues[key];
        }
        
        if(!params.element) throw new Error('The map need a DOM Element to render');

        //MARK: Init Map
        this.#tilesLayer = new TileLayer({
            source: new XYZ({
                url: params.tilesURL
            })
        });

        this.map = new Map({

            target: params.element,

            layers: [ 
                this.#tilesLayer 
            ],

            view: new View({
                center: params.center,
                zoom: params.zoom,
                maxZoom: params.zoomMax,
                minZoom: params.zoomMin,
                rotation: params.rotate
            }),

            controls: [
                new Zoom({
                    zoomInLabel: parseIcon(zoomIn_icon), 
                    zoomInTipLabel: 'Acercar',
                    zoomOutLabel: parseIcon(zoomOut_icon), 
                    zoomOutTipLabel: 'Alejar'
                }),
                new FullScreen({
                    tipLabel: 'Pantalla completa',
                    label: parseIcon(fullscreen_icon)
                }),
                new Rotate({
                    label: parseIcon(rotation_icon)
                })
            ],

            interactions: InteractionDefaults({

                shiftDragZoom: false,
                altShiftDragRotate: false,
                mouseWheelZoom: true
            })
            .extend([
                new DragRotate({
                    condition: (e) => Condition.shiftKeyOnly(e)
                }),
            ]),

        })

        this.renderPath();
    }


    rotate(angle){

        this.map.getView().setRotation(angle * (Math.PI / 180));
    }

    changeTilesURL(url){

        this.#tilesLayer.getSource().setUrl(url);
    }

    changeCenter(center){

        this.map.getView().setCenter(center);
    }

    changeZoom({zoom, zoomMin, zoomMax}){

        if(zoom != null) this.map.getView().setZoom(zoom);

        if(zoomMin != null) this.map.getView().setMinZoom(zoomMin);

        if(zoomMax != null) this.map.getView().setMaxZoom(this.zoomMax);
    }


    async renderPath(src = 'http://localhost:4321/data/urbano/7/aget/recorrido.v2.geojson'){

        const response = await fetch(src);

        const json = await response.json();

        const layer = renderPath(json);

        this.map.getLayers().push(layer);
    }

}