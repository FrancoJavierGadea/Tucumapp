

export class SavedBusPaths {

    constructor() {

        //Init Local Storage
        if (localStorage.getItem('busPaths') === null) {

            localStorage.setItem('busPaths', JSON.stringify([]));
        }

        this.busPaths = JSON.parse(localStorage.getItem('busPaths'));
    }

    
}