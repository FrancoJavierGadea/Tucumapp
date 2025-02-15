import L from 'leaflet';

export class CustomMap extends HTMLElement {


    constructor(){
        super();

        this.tilesUrl = this.getAttribute('tiles-url') || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.zoom = {
            default: +this.getAttribute('zoom') || 13,
            min: +this.getAttribute('min-zoom') || 1,
            max: +this.getAttribute('max-zoom') || 18
        }

        this.center = {
            lat: +this.getAttribute('lat') || -26.8300,
            lng: +this.getAttribute('lng') || -65.2087
        }

        this.map = L.map(this, {})
            .setView([this.center.lat, this.center.lng], this.zoom.default)
            .setMaxZoom(this.zoom.max)
            .setMinZoom(this.zoom.min);

        //Tiles    
        L.tileLayer(this.tilesUrl, {})
            .addTo(this.map);
    }


    //MARK: Render Path
    renderPath(geojson){
        

        
    }
}