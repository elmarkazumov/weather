import {elements, convertTime, renderCurrentData, renderFavoritesLocations, renderForecast} from "./additional.js";

let favoritesLocation = new Set();
// let favoritesLocation = Array();

// Нужны обработчики ошибок
async function getData(requestType, locationName){
    const serverUrl = `http://api.openweathermap.org/data/2.5/${requestType}`;
    const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
    const url = `${serverUrl}?q=${locationName}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        return response.json();        
    } catch (error) {
        alert(error);
    }
}

async function forecastDataHandler(location){
    while(elements.forecastBlock.firstChild){
        elements.forecastBlock.removeChild(elements.forecastBlock.firstChild);
    }

    let i = 0;
    const data = await getData('forecast', location);

    for(const item of data.list){
        if(i < 3){
            renderForecast(convertTime(item.dt), Math.round(item.main.temp - 273.15), 
            Math.round(item.main.feels_like - 273.15), item.weather[0].icon);
            i++;
        }
    }
}

// Нужны обработчики ошибок
async function changeCurrentData(location){
    const data = await getData('weather', location);
    renderCurrentData(data);

    localStorage.setItem('currentLocation', location);
    saveLocation();
}

function saveLocation(){
    elements.buttonSaveLocation.addEventListener('click', function(){
        const currentLocation = elements.currentLocation.textContent;

        // if(!favoritesLocation.includes(currentLocation)){
        //     favoritesLocation.push(currentLocation);
        // } else {
        //     console.log('Город уже находится в списке');
        // }

        favoritesLocation.add(currentLocation);

        localStorage.setItem('favoritesLocation', JSON.stringify([...favoritesLocation]));
        renderFavoritesLocations();
    })
}

function selectFavoritesLocation(){
    const favoritesLocations = elements.listSavedLocations.querySelectorAll('.savedCity > div');

    favoritesLocations.forEach(location => {
        location.addEventListener('click', (event) => {
            if(event.target.getAttribute('id') === 'locationName'){
                changeCurrentData(event.target.textContent);
                forecastDataHandler(event.target.textContent);    
            } 

            if(event.target.getAttribute('id') === 'buttonDeleteSavedLocation'){
                // favoritesLocation.splice(favoritesLocation.findIndex(findedLocation => findedLocation == location.firstChild.textContent), 1);
                favoritesLocation.delete(location.firstChild.textContent);
                localStorage.setItem('favoritesLocation', JSON.stringify([...favoritesLocation]));
                location.remove();
            }
        })
    })
}

document.addEventListener('DOMContentLoaded', () => {
    if(!localStorage.getItem('currentLocation').length){
        throw new Error('localStorage is empty!');
    } else{
        changeCurrentData(localStorage.getItem('currentLocation'));
        forecastDataHandler(localStorage.getItem('currentLocation'));
    }

    if(!localStorage.getItem('favoritesLocation').length){
        throw new Error('localStorage is empty!');
    } else{
        favoritesLocation.clear();
        favoritesLocation = new Set(JSON.parse(localStorage.getItem('favoritesLocation')));
        renderFavoritesLocations();
    }
})

elements.formInput.addEventListener('submit', function getLocation(event){
    event.preventDefault();

// Нужны обработчики ошибок, если поле пустое например или введены символы или цифры

    const location = document.querySelector('.weather__input').value;
    changeCurrentData(location);
    forecastDataHandler(location);

    document.querySelector('.weather__input').value = '';
})

export {favoritesLocation, selectFavoritesLocation}