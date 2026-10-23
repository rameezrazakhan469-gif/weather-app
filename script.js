const cityInput = document.querySelector("#city");
const searchBtn = document.querySelector("#searchBtn");
const result = document.querySelector("#result");
const weatherForm = document.querySelector("#weatherForm");
const unitToggle = document.querySelector("#unitToggle");

// STATE: app ki current preference (last time konsi use ki thi) aur  current city
let unit = localStorage.getItem("unit") === "imperial"// comparison hai ki theek imperial hai ya nhi
    ? "imperial"
    : "metric";


let currentCity = "";

// Button par agla option dikhana 
function updateUnitButton() {
     if (unit === "metric") {
        unitToggle.textContent = "Switch to ℉";
     }  else {
        unitToggle.textContent = "Switch to ℃";
     }
}

updateUnitButton();
               
// Search form
weatherForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
       result.textContent = "Please enter a city ";
       return;}

    await
     showWeatherForCity(city); 
    });     
    

// Togggle Celsius / Farenheit
unitToggle.addEventListener("click", async function() {
    unit = unit === "metric" ? "imperial" : "metric";
    

    localStorage.setItem("unit",unit);
    updateUnitButton();

    // City search hui hai to naya unit mein weather dobara lao
    if (currentCity) {
        await
        showWeatherForCity(currentCity);
    }
});

// Weather load krne ka common function
async function showWeatherForCity(city) {
    searchBtn.disabled = true;
    unitToggle.disabled = true;
    result.textContent = "Loading...";
    
    try {
        const data = await getWeather(city);

renderWeather(data);


// sirf succesful response ke baad current city update karo
currentCity = city;

localStorage.setItem("lastCity", city);

//error handle karna
       } catch (error) {
        if (error.message === "CITY_NOT_FOUND") {
            result.textContent = "City not found.";
        } else {

            result.textContent =  "something went wrong. Please try again later.";

            console.error(error);
        }
        
}
finally {
    searchBtn.disabled = false;
    unitToggle.disabled = false;
}
}


// API se weather lena
async function getWeather(city) {
    const url =  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;
        
    
        const response = await fetch(url);
       
            
        //error pehchanna

        
            if (response.status === 404) {
                throw new Error('CITY_NOT_FOUND');
            }

        if (!response.ok) {
            
            throw new Error("unable to fetch weather. please try again.");
        }
        
    
     return await
     response.json();
}


// API data ko page per dikhana
    function renderWeather(data) {
        const iconCode = data.weather[0].icon;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const temperatureUnit = unit === "metric" ? "°C" : "°F";
        const windUnit = unit === "metric" ? "m/s" : "mph";

        result.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp} ${temperatureUnit}</p>
            <p>Feels like: ${data.main.feels_like} ${temperatureUnit}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind speed: ${data.wind.speed} ${windUnit}</p>`;
    }


//page load hone par saved city ka weather dikhana
async function loadSavedWeather() {
    const savedCity = localStorage.getItem("lastCity");

    if (savedCity) {
        // pehle se saved city ka toggle ke liye bhi available rakho
        currentCity = savedCity;
        cityInput.value = savedCity;

        await
        showWeatherForCity(savedCity);
     
    }
    
}    

loadSavedWeather();
 
        

       