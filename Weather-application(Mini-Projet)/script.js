// weatherStiuation ---> "Clouds", "Clear" "Sany"
// Ville, Temp, Humidity, weatherStiuation( "Clouds", "Clear" "Sany")
import { Weather } from './weather.js';

import {
    clearWeather,
    cloudyWeather,
    rainyWeather,
    APIKEY,
    BASEURL
} from './constants/constant.js';

let dateTime = Date().split(' ').splice(0, 5);
let timeSplit = dateTime[dateTime.length - 1].split(':');

let date = dateTime.slice(0, 4).join('.');
let time = timeSplit.at(0) + ":" + timeSplit.at(1);

const weatherTime = document.querySelector(".weather-time");
const weatherDate = document.querySelector(".weather-date");

const weatherTempurator = document.getElementsByClassName("weather-data-tempurator");
const weatherState = document.getElementsByClassName("weather-data-state");

const weatherCity = document.querySelector(".weather-city");

const weatherDuration = document.querySelector(".weather-duration");

const weatherFeelsLike = document.querySelector(".weather-data-feels-like");

const weatherImage = document.getElementById("weather-image");

const weatherSearchCityBtn = document.getElementById("weather-search-city-btn");

// Building things while the load of page.
window.onload = buil();

// Initial city will be 'PARIS' as a default city, instead if the user enter a city will rebuild the UI and show the data corresponding to the city.
fetchWeatherData('paris')
    .then(response => {
        let weatherObj = new Weather(
            response.name,
            response.main.temp,
            response.main.humidity,
            response.weather[0].main,
            response.main.feels_like,
        );
        //clearPreviousUIData();
        // city.
        weatherCity.innerText = weatherObj.city;


        // Weather Tempurator & State (Cloudy, Suny, Clear ect...).
        weatherTempurator.item(0).textContent = weatherObj.temperature; 
        weatherState.item(0).textContent = weatherObj.state;

       weatherTempurator.item(1).textContent = weatherObj.temperature; 
        weatherState.item(1).textContent =  weatherObj.state;

        weatherFeelsLike.innerText = weatherObj.feelsLike;

        const supElement = document.createElement('sup');
        weatherFeelsLike.append(supElement)

        let currentWeatherState = checkWeather(weatherObj.state);
        weatherImage.src = '';
        weatherImage.src = currentWeatherState;
    })
    .catch(error => error);


// When the user entring a city and click on the button will rebuild the data corresponding to the city. 
weatherSearchCityBtn.onclick = () => {
    const searchCityInput = document.querySelector("input[type='text']");
    //searchCityInput.value == null ? searchCityInput.value = 'paris': searchCityInput.value;
    let city = "";
    if (searchCityInput.value == null) {
        city = "paris";
    } else {
        city = searchCityInput.value;
    }

fetchWeatherData(city)
    .then(response => {
        let weatherObj = new Weather(
            response.name,
            response.main.temp,
            response.main.humidity,
            response.weather[0].main,
            response.main.feels_like,
        );
        //clearPreviousUIData();
        // city.
        weatherCity.innerText = weatherObj.city;


        // Weather Tempurator & State (Cloudy, Suny, Clear ect...).
        weatherTempurator.item(0).textContent = weatherObj.temperature; 
        weatherState.item(0).textContent = weatherObj.state;

       weatherTempurator.item(1).textContent = weatherObj.temperature; 
        weatherState.item(1).textContent =  weatherObj.state;

        weatherFeelsLike.innerText = weatherObj.feelsLike;

        const supElement = document.createElement('sup');
        weatherFeelsLike.append(supElement)

        let currentWeatherState = checkWeather(weatherObj.state);
        weatherImage.src = '';
        weatherImage.src = currentWeatherState;
    })
    .catch(error => error);
};

function clearPreviousUIData() {
    weatherCity.textContent = "";
    weatherTempurator.item(0).innerHTML ="";
    weatherTempurator.item(1).innerHTML ="";
    weatherState.item(0).innerHTML ="";
    weatherState.item(1).innerHTML ="";
    weatherFeelsLike.innerHTML="";


}

async function fetchWeatherData(city) {
    let endPoint = `${BASEURL}q=${city}&appid=${APIKEY}&units=metric`;
    let response = await fetch(endPoint, { method: 'Get' });
    try {
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Something went wrong!');
    }
}

function checkWeather(currentWeatherState) {
    if (currentWeatherState == 'Clear') {
        return clearWeather;
    } if (currentWeatherState == 'Clouds') {
        return cloudyWeather;
    } else {
        return rainyWeather;
    }
}

function buil() {
    weatherTime.innerHTML = `${time}`;
    weatherDate.innerHTML = `${date}`;
    // weather duration
    weatherDuration.innerHTML = specifyDuration(time);
}
function leftPadTime(time) {
    return time.split(":")[0];
}

function specifyDuration(time) {

    let currentTime = leftPadTime(time);
    let good = "Good";
    // Morning time
    if (currentTime == 4 || currentTime <= 12 && currentTime != 0) {
        return `${good} Morning`;
    }
    // Evening time
    if (currentTime == 13 || currentTime < 20) {
        return `${good} Evening`;
    }
    // Night time
    else {
        return weatherDuration.textContent = `${good} Night`;
    }
}

