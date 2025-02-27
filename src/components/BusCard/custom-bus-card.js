import bookmark_icon from "bootstrap-icons/icons/bookmark.svg?raw";
import bookmark_fill_icon from "bootstrap-icons/icons/bookmark-fill.svg?raw";
import stops_icon from "bootstrap-icons/icons/geo-alt.svg?raw";
import report_icon from "bootstrap-icons/icons/exclamation-triangle.svg?raw";

import SAVED_BUS_PATHS from '@/scripts/localStorage/SavedBusPaths.js';

export class CustomCardBus extends HTMLElement {

    constructor() {
        super();

        this.src = this.getAttribute('src');

        this.innerHTML = `
            <div class="Bus-content" role="button">
                <img class="Bus-image" />

                <div class="Bus-info">
                    <h4 class="Bus-title"></h4>
                    <p class="Bus-direction"></p>

                    <div class="Bus-footer">
                        <span class="Bus-provider"></span>
                        <span class="Bus-path-length"></span>
                    </div>
                </div>
            </div>
            
            <div class="Bus-controls">
                <button class="Save-btn btn" title="Guardar">
                    <div class="save-icon">${bookmark_icon}</div>
                    <div class="saved-icon">${bookmark_fill_icon}</div>
                </button>
                <button class="Stops-btn btn" title="Mostrar paradas">
                    <div class="stops-icon">${stops_icon}</div>
                </button>
                <button class="Report-btn btn" title="Corregir recorrido">
                    <div class="report-icon">${report_icon}</div>
                </button>
            </div>
        `;

        this.$ = (selector) => this.querySelector(selector);
        
        this.init();
    }

    async init(){

        const response = await fetch(this.src);
        const data = await response.json();

        this.data = data;

        this.$('.Bus-image').src = data.image.square;
        this.$('.Bus-title').textContent = data.name;

        this.$('.Bus-direction').textContent = data.direction;
        this.$('.Bus-path-length').textContent = data.length_km + ' km';
        this.$('.Bus-provider').textContent = data.provider.name;

        //Save Bus Path
        this.initSaveBtn();

        this.initMainButton();
    }

    saved = false;

    initSaveBtn(){

        this.saved = SAVED_BUS_PATHS.has(this.data.id);
        this.saved && this.setAttribute('saved', '');

        SAVED_BUS_PATHS.on((busPaths) => {

            this.saved = busPaths.includes(this.data.id);
            this.saved ? this.setAttribute('saved', '') : this.removeAttribute('saved');
        });

        this.$('.Save-btn').addEventListener('click', () => {

            if(!this.saved){

                SAVED_BUS_PATHS.add(this.data.id);
                this.setAttribute('saved', ''); 
            }
            else {
    
                SAVED_BUS_PATHS.remove(this.data.id);
                this.removeAttribute('saved'); 
            }
    
            this.saved = SAVED_BUS_PATHS.has(this.data.id);
        });
    }

    active = false;

    initMainButton(){

        this.$('.Bus-content').addEventListener('click', () => {

            this.active = !this.active;
            this.active ? this.setAttribute('active', '') : this.removeAttribute('active');
        });
    }
}