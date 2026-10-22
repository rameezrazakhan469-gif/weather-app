const cityInput = document.querySelector("#city");
const searchBtn = document.querySelector("#searchBtn");
const result = document.querySelector("#result");
const weatherForm = document.querySelector("#weatherForm");

weatherForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) {
       result.textContent = "Please enter a city ";
       return;}

       searchBtn.disabled = true;
       result.textContent = "Loading...";

       try {
        const data = await getWeather(city);

renderWeather(data);
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
}
});

async function getWeather(city) {
    const url =  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        
    
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

    function renderWeather(data) {
        const iconCode = data.weather[0].icon;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        result.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>`;
    }
 
        

       