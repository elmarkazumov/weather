import {favoritesLocation, selectFavoritesLocation} from "./main.js";

const elements = {
    formInput: document.querySelector('.weather__search'),
    currentTemp: document.querySelector('#currentTemp'),
    feelsLike: document.querySelector('#feelsLike'),
    currentSunrise: document.querySelector('#sunrise'),
    currentSunset: document.querySelector('#sunset'),
    currentLocation: document.querySelector('#currentSelectedLocation'),
    currentWeatherIcon: document.querySelector('#currentWeatherIcon'),
    listSavedLocations: document.querySelector('.savedCity'),
    buttonSaveLocation: document.querySelector('#saveLocation'),
    forecastBlock: document.querySelector('.weather__timing')
}

function convertTime(time) {
    const localTime = new Date(time * 1000);
    const localHours = localTime.getHours() < 10 ? `0${localTime.getHours()}`: localTime.getHours();
    const localMinutes = localTime.getMinutes() < 10 ? `0${localTime.getMinutes()}`: localTime.getMinutes();

    return `${localHours}:${localMinutes}`;
}

function renderCurrentData(data){
    elements.currentTemp.innerHTML = `${Math.round(data.main.temp - 273.15)}&deg;`;
    elements.feelsLike.innerHTML = `Feels like: ${Math.round(data.main.feels_like - 273.15)}&deg;`;
    elements.currentSunrise.textContent = `Sunrise: ${convertTime(data.sys.sunrise)}`;
    elements.currentSunset.textContent = `Sunset: ${convertTime(data.sys.sunset)}`;
    elements.currentLocation.textContent = data.name;
    elements.currentWeatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
}

function renderFavoritesLocations(){
    while(elements.listSavedLocations.firstChild){
        elements.listSavedLocations.removeChild(elements.listSavedLocations.firstChild);
    }

    for(let location of favoritesLocation){
        const div = document.createElement('div');
        const newSpan = document.createElement('span');
        newSpan.setAttribute('id', 'locationName');
        const buttonDelete = document.createElement('span');
        buttonDelete.setAttribute('id', 'buttonDeleteSavedLocation');
        buttonDelete.innerHTML = '&#x2715';
        newSpan.textContent = location;
        div.append(newSpan, buttonDelete);
        elements.listSavedLocations.append(div);
    }

    selectFavoritesLocation();
}

function renderForecast(time, temp, feels, icon){
    const div = document.createElement('div');
    div.classList.add('weather__afterward');
    const timeSpan = document.createElement('span');
    timeSpan.textContent = time;
    const tempSpan = document.createElement('span');
    tempSpan.textContent = `Temperature: ${temp}`;
    const feelsSpan = document.createElement('span');
    feelsSpan.textContent = `Feels Like: ${feels}`;
    const img = document.createElement('img');
    img.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    div.append(timeSpan, tempSpan, feelsSpan, img);
    elements.forecastBlock.append(div);
}

function showInfoWeather(mode){
    if(!mode){
        document.querySelector('.weather__window').style.display = 'none';
    } else {
        document.querySelector('.weather__window').style.display = 'grid';
    }
}

export {elements, convertTime, renderCurrentData, renderFavoritesLocations, renderForecast, showInfoWeather}