const API_KEY = "1918c2b2848e451b9b994035261606";

const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){
        themeToggle.innerHTML = "☀ Light Mode";
    }else{
        themeToggle.innerHTML = "🌙 Dark Mode";
    }

});

searchBtn.addEventListener("click", () => {

    const city =
    document.getElementById("locationInput").value.trim();

    if(city){
        getWeather(city);
    }

});

async function getWeather(location){

    try{

        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes`
        );

        const data = await response.json();

        if(data.error){
            alert(data.error.message);
            return;
        }

        updateCurrent(data);
        updateHourly(data);
        updateDaily(data);

    }
    catch(error){

        console.error(error);
        alert("Failed to load weather data");

    }

}

function updateCurrent(data){

    document.getElementById("city").textContent =
    `${data.location.name}, ${data.location.country}`;

    document.getElementById("temp").textContent =
    data.current.temp_c;

    document.getElementById("condition").textContent =
    data.current.condition.text;

    document.getElementById("humidity").textContent =
    data.current.humidity + "%";

    document.getElementById("wind").textContent =
    data.current.wind_kph + " km/h";

    document.getElementById("lat").textContent =
    data.location.lat;

    document.getElementById("lon").textContent =
    data.location.lon;

    document.getElementById("dbt").textContent =
    data.current.temp_c + " °C";

    const wetBulb =
    (
        data.current.temp_c -
        ((100 - data.current.humidity)/5)
    ).toFixed(1);

    document.getElementById("wbt").textContent =
    wetBulb + " °C";

    document.getElementById("sunrise").textContent =
    data.forecast.forecastday[0].astro.sunrise;

    document.getElementById("sunset").textContent =
    data.forecast.forecastday[0].astro.sunset;

}

function updateHourly(data){

    const container =
    document.getElementById("hourlyForecast");

    container.innerHTML = "";

    data.forecast.forecastday[0].hour.forEach(hour => {

        container.innerHTML += `
            <div class="hour-card">
                <h4>${hour.time.split(" ")[1]}</h4>
                <img src="${hour.condition.icon}">
                <p>${hour.temp_c}°C</p>
                <small>${hour.condition.text}</small>
            </div>
        `;

    });

}

function updateDaily(data){

    const container =
    document.getElementById("dailyForecast");

    container.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

        container.innerHTML += `
            <div class="day-card">

                <h3>${day.date}</h3>

                <img src="${day.day.condition.icon}">

                <h2>${day.day.avgtemp_c}°C</h2>

                <p>${day.day.condition.text}</p>

                <p>Max: ${day.day.maxtemp_c}°C</p>

                <p>Min: ${day.day.mintemp_c}°C</p>

            </div>
        `;

    });

}

/* AUTO LOCATION */

navigator.geolocation.getCurrentPosition(

(position)=>{

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeather(`${lat},${lon}`);

},

()=>{

    getWeather("London");

}

);