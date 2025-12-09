// weatherStiuation ---> "Clouds", "Clear" "Sany"
// Ville, Temp, Humidity, weatherStiuation( "Clouds", "Clear" "Sany")
import { Weather } from './weather.js';

const APIKEY = "d4f29ce30cac920b59ea3366eb8444d9"

const BASEURL = "https://api.openweathermap.org/data/2.5/weather?";

const clearWeather = "amcharts_weather_icons_1.0.0/animated/day.svg";
const cloudyWeather = "amcharts_weather_icons_1.0.0/animated/cloudy-day-1.svg";
const rainyWeather = "amcharts_weather_icons_1.0.0/animated/rainy-6.svg";

let dateTime = Date().split(' ').splice(0, 5);
let timeSplit = dateTime[dateTime.length - 1].split(':');

let date = dateTime.slice(0, 4).join('.');
let time = timeSplit.at(0) + ":" + timeSplit.at(1);

const weatherTime = document.querySelector(".weather-time");
const weatherDate = document.querySelector(".weather-date");

const weatherTempurator = document.getElementsByClassName("weather-tempurator");
const weatherState = document.getElementsByClassName("weather-state");

const weatherCity = document.querySelector(".weather-city");

const weatherDuration = document.querySelector(".weather-duration");

const weatherFeelsLike = document.querySelector(".weather-feels-like");

const weatherImage = document.getElementById("weather-image");

// Building things while the load of page.
window.onload = buil();



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


fetchWeatherData("london")
    .then(response => {
        let weatherObj = new Weather(
            response.name,
            response.main.temp,
            response.main.humidity,
            response.weather[0].main,
            response.main.feels_like,
        );

        // city.
        weatherCity.innerText = weatherObj.city;

        // Weather Tempurator & State (Cloudy, Suny, Clear ect...).
        weatherTempurator.item(0).insertAdjacentText("afterbegin", weatherObj.temperature);
        weatherState.item(0).insertAdjacentText("afterbegin", weatherObj.state);

        weatherTempurator.item(1).insertAdjacentText("afterbegin", weatherObj.temperature);
        weatherState.item(1).insertAdjacentText("afterbegin", weatherObj.state);

        weatherFeelsLike.insertAdjacentText(
            "beforeend",
            weatherObj.feelsLike,
        );

        const supElement = document.createElement('sup');
        weatherFeelsLike.appendChild(supElement);

        let currentWeatherState = checkWeather(weatherObj.state);
        weatherImage.src ='';
        weatherImage.src = currentWeatherState;
    })
    .catch(error => error);

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

