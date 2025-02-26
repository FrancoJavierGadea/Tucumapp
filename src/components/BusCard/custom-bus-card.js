import BusCard_css from './custom-bus-card.css?url';
import bookmark_icon from "bootstrap-icons/icons/bookmark.svg?raw";
import bookmark_fill_icon from "bootstrap-icons/icons/bookmark-fill.svg?raw";
import bootstrap_css from "bootstrap/dist/css/bootstrap.min.css?url";

export class CustomCardBus extends HTMLElement {

    constructor() {
        super();

        this.src = this.getAttribute('src');

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${BusCard_css}">
            <link rel="stylesheet" href="${bootstrap_css}">

            <div class="Bus-content" role="button">
                <img class="Bus-image" />

                <div class="Bus-info">
                    <h4 class="Bus-title"></h4>
                    <p class="Bus-direction"></p>

                    <div class="Bus-footer">
                        <span class="Bus-path-length"></span>
                        <span class="Bus-provider"></span>
                    </div>
                </div>
            </div>
            
            <div class="Bus-controls">
                <button class="Save-btn btn">
                    <div class="save-icon">${bookmark_icon}</div>
                    <div class="saved-icon">${bookmark_fill_icon}</div>
                </button>
            </div>
        `;
        
        this.init();
    }

    async init(){

        const response = await fetch(this.src);
        const data = await response.json();

        this.data = data;

        this.shadowRoot.querySelector('.Bus-image').src = data.image;
        this.shadowRoot.querySelector('.Bus-title').textContent = data.name;

        this.shadowRoot.querySelector('.Bus-direction').textContent = data.direction;
        this.shadowRoot.querySelector('.Bus-path-length').textContent = data.length_km + ' km';
        this.shadowRoot.querySelector('.Bus-provider').textContent = data.provider.name;

        this.saved = JSON.parse(localStorage.getItem('busPaths'))?.includes(data.id);

        this.saved && this.setAttribute('saved', '');

        this.shadowRoot.querySelector('.Save-btn').addEventListener('click', () => this.saveBusPath());
    }

    saved = false;
    
    saveBusPath(){

        //Init Local Storage
        const savedBuspaths = (() => {

            const existing = localStorage.getItem('busPaths');

            if(!existing) localStorage.setItem('busPaths', JSON.stringify([]));

            return existing ? JSON.parse(existing) : [];
        })();

        if(!this.saved){

            localStorage.setItem('busPaths', JSON.stringify([...savedBuspaths, this.data.id]));
            this.setAttribute('saved', ''); 
        }
        else {

            localStorage.setItem('busPaths', JSON.stringify(savedBuspaths.filter(id => id !== this.data.id)));
            this.removeAttribute('saved'); 
        }

        this.saved = !this.saved;
    }
}