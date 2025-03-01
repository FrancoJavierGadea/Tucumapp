

import SAVED_BUS_PATHS from '@/scripts/localStorage/SavedBusPaths.js';

export class CustomCardBus extends HTMLElement {

    constructor() {
        super();

        this.id = this.getAttribute('data-bus-id');

        this.$ = (selector) => this.querySelector(selector);

        this.$('img.Bus-image').addEventListener('error', (e) => {

            console.log(e.target.src);

            e.target.src = '/square.default.png';
        });
        
        //Save Bus Path
        this.initSaveBtn();

        this.initMainButton();
    }

    saved = false;

    initSaveBtn(){

        this.saved = SAVED_BUS_PATHS.has(this.id);
        this.saved && this.setAttribute('saved', '');

        SAVED_BUS_PATHS.on((busPaths) => {

            this.saved = busPaths.includes(this.id);
            this.saved ? this.setAttribute('saved', '') : this.removeAttribute('saved');
        });

        this.$('.Save-btn').addEventListener('click', () => {

            if(!this.saved){

                SAVED_BUS_PATHS.add(this.id);
                this.setAttribute('saved', ''); 
            }
            else {
    
                SAVED_BUS_PATHS.remove(this.id);
                this.removeAttribute('saved'); 
            }
    
            this.saved = SAVED_BUS_PATHS.has(this.id);
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