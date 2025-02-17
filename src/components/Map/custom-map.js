
import L from 'leaflet';
import leafletCss from "leaflet/dist/leaflet.css?url";

export class CustomMap extends HTMLElement {

    static get observedAttributes() {
        return ['zoom', 'zoom-min', 'zoom-max', 'tiles-url', 'center', 'rotate'];
    }

    static defaultValues = {
        zoom: 14,
        zoomMin: 1,
        zoomMax: 18,
        tilesURL: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        center: [-26.83, -65.2087],
        rotate: 0 
    }

    attributeChangedCallback(name){

        switch(name){

            case 'zoom':
                this.map.setZoom(this.zoom);
                break;

            case 'zoom-min':
                this.map.setMinZoom(this.zoomMin);
                break;

            case 'zoom-max':
                this.map.setMaxZoom(this.zoomMax);
                break;

            case 'center':
                this.map.setView(this.center);
                break;

            case 'tiles-url':
                this.map.removeLayer(this.#tilesLayer);

                this.#tilesLayer = L.tileLayer(this.tilesURL)
                .addTo(this.map);
                break;

            case 'rotate':
                this.shadowRoot.querySelector('.Map-container > .leaflet-pane').style.rotate = `${this.rotate}deg`;
                break;
        }
    }

    #tilesLayer = null;
    #rotating = false;

    constructor(){
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                @import url("${leafletCss}");

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

        console.log(leafletCss);
        

        this.map = L.map(this.shadowRoot.querySelector('.Map-container'), {
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: true,
            dragging: true
        })
            .setView(this.center)
            .setZoom(this.zoom)
            .setMaxZoom(this.zoomMax)
            .setMinZoom(this.zoomMin);

        //Tiles    
        this.#tilesLayer = L.tileLayer(this.tilesURL, {})
            .addTo(this.map);

        this.#renderPath();
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
    

    //MARK: Render Path
    async #renderPath(source = 'http://localhost:4321/data/urbano/3/lavalle/recorrido.geojson'){
        
        const response = await fetch(source);

        const json = await response.json();

        L.geoJSON(json, {})
            .addTo(this.map);
        
    }
}