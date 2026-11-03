const cityInput = document.querySelector("#city");
const searchBtn = document.querySelector("#searchBtn");
const result = document.querySelector("#result");
const weatherForm = document.querySelector("#weatherForm");
const unitToggle = document.querySelector("#unitToggle");

// STATE: app ki current preference (last time konsi use ki thi) aur  current city, abhi konsi istemal ho rahi hai, ye localStorage mein save hoga taki page reload hone par bhi ye preference yaad rahe.
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
weatherForm.addEventListener("submit", async function(event) { // await use krne ke liye function ko async banana hoga taki hum promise ka intezar kar sakein
    event.preventDefault(); // default form submit behavior ko rokna taki page reload na ho
    const city = cityInput.value.trim();

    if (!city) {
       result.textContent = "Please enter a city ";
       return;}

    await // promise poora hone ka intezar karna
     showWeatherForCity(city); 
    });     
    

// Togggle Celsius / Farenheit
unitToggle.addEventListener("click", async function() {
    const city = cityInput.value.trim() || currentCity;

    if (!city) {
        result.textContent = "Please enter a city first.";
        return;
    }
    const nextUnit = unit === "metric" ? "imperial" : "metric"; // nextunit = agli baar konsi unit istemal karni hai, agar current unit metric hai to next unit imperial hoga aur vice versa
    

     await
        showWeatherForCity(city, nextUnit);
    }
);

// Weather load krne ka common function
async function showWeatherForCity(city, requestedUnit = unit) { // requestedunit = fn ko kon si unit mein call kiya gaya hai, agar user ne toggle kiya hai to next unit hoga aur agar user ne search kiya hai to current unit hoga
    searchBtn.disabled = true;
    unitToggle.disabled = true;
    result.textContent = "Loading...";
    document.querySelector("#forecast").replaceChildren(); // forecast section ko clear karna taki purana forecast dikhai na de jab tak naya forecast load nahi ho jata
    
    try { // jis code mein error aa skta hai usse try block mein rakhna taki agar error aaye to catch block mein handle kiya ja sake
       const [current, forecast] = await Promise.all([ // dono ke poora hone ka intezar karna taki dono ke data ek saath mile aur dono ke liye alag alag request na bhejna pade
        getWeather(city, requestedUnit),
        getForecast(city, requestedUnit)
       ]);

       renderWeather(current, requestedUnit);
       renderForecast(forecast, requestedUnit);
      
       // Dono requests succesful hone ke baad hi current city update karo, taki agar ek request fail ho jaye to current city update na ho
       unit = requestedUnit;

    localStorage.setItem("unit", unit);
     updateUnitButton();   
// sirf succesful response ke baad current city update karo
currentCity = city;

localStorage.setItem("lastCity", city);


//error handle karna
       } catch (error) { // error aane per kya kerna hai
        result.classList.add("error"); //error आने पर error वाली CSS लागू होगी।, notes mein dekho js html mein class jod rhi hai aur phir us class ke adhaar per styling kr rhi hai.
        document.querySelector("#forecast").replaceChildren();
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
async function getWeather(city, requestedUnit = unit) {
    const url =  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${requestedUnit}`;
        
    
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


async function getForecast(city, requestedUnit = unit) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${requestedUnit}`;

        const response = await fetch(url);

        // error handle karna

             if (response.status === 404) {
               throw new Error('CITY_NOT_FOUND');
            }

        if (!response.ok) {
           throw new Error("Unable to fetch forecast. Please try again.");
        }

    return await response.json();
}    
    
 
// forecast ko din ke hisaab se group karna
function groupForecastByDay(forecast) {// forecast nhi likhogey toh fn ko kese pta chalega ki usey kis input per kaam karna hai, isliye humne forecast parameter pass kiya hai taki fn ko pata chale ki usey kis input per kaam karna hai
    const days = {}; // object bnmaya hai usme key, values hoti hai . shuruaat mein koi date group nahi hai hum har nayi date ke liye is object mein ek naya key-value pair banayenge

    for (const item of forecast.list) { // forecast.list ek array hai jisme har 3 ghante ka forecast data/record hai. ek ek krke har record ko uthaao aur usey item naam ke variable mein rakho . hum isme se har item ko process karenge for... of iteration mein agli entry item variable mein store hogi agar 40 entries hain to 40 baar chalega ye loop
        const localDateTime = new Date( // date js ka built-in object hai jisme hum date aur time ke saath kaam kar sakte hain. humne new Date() ka use kiya hai taki hum ek nayi date object create kar sakein. isme humne item.dt ko pass kiya hai jo ki unix timestamp hai aur forecast.city.timezone ko add kiya hai taki humein local time mile. ye dono values seconds mein hain isliye humne 1000 se multiply kiya hai taki milliseconds mein convert ho jaye 
            (item.dt + forecast.city.timezone) * 1000
        );

        const dayKey = localDateTime.toISOString().slice(0, 10); // ye date ko YYYY-MM-DD format mein convert karega taki hum isse days object ke key ke roop mein use kar sakein isi key se hum pehchaanenge ki ye forecast kis date ka hai aur kis din ke group mein jaayega
        const localHour = localDateTime.getUTCHours();
        
        // kya is din ka group pehle se maujood hai?
        if (!days[dayKey]) { // agar days object mein ye date key pehle se nahi hai to hum is date ke liye ek naya object create karenge jisme min aur max temperature aur icon store karenge
            days[dayKey] = {
                date: dayKey,
                min: Infinity, // in shuruaati values ka maqsad hai ki hum min aur max ko update kar sakein. Infinity se chhota koi bhi number hamesha min ko update karega aur -Infinity se bada koi bhi number hamesha max ko update karega jisse math.min aur math.max kaam karega
                max: -Infinity,
                icon: item.weather[0].icon,
                iconHourDistance: Infinity,
            };
        }

        const day = days[dayKey];

        day.min = Math.min(day.min, item.main.temp_min);
        day.max = Math.max(day.max, item.main.temp_max);

        const distanceFromNoon = Math.abs(localHour - 12); // 12 baje ke aas paas ka icon select karne ke liye hum noon se distance calculate karenge taki hum icon ko update kar sakein agar ye distance pehle se chhota hai to iska matlab hai ki ye icon noon ke kareeb hai aur isse select karna chahiye, agar entry dupaher 12 baje ki hai toh distance 0 hoga aur agar subah 9 baje ki hai toh distance 3 hoga aur agar shaam 6 baje ki hai toh distance 6 hoga. hum noon ke kareeb ka icon select karenge taki din ke beech ka icon dikh sake
        if (distanceFromNoon < day.iconHourDistance) {
            day.icon = item.weather[0].icon;
            day.iconHourDistance = distanceFromNoon;
            }
        }
        
        // object se array banana taki hum sirf pehle 5 din ka forecast dikhayein
        return Object.values(days).slice(0, 5); // object.values(days) se humein days object ke saare values ka array milega jisme har value ek din ka forecast hai aur slice(0, 5) se hum sirf pehle 5 din groups ka forecast le rahe hain 
    }



// API data ko page per dikhana
    function renderWeather(data, requestedUnit = unit) { // requestedUnit use ki kyunki jis unit mein request ki gayi thi ussi unit mein data dikhana chahiye
        const iconCode = data.weather[0].icon;
        const condition = data.weather[0].main.toLowerCase(); // API मौसम का नाम देती है, जैसे "Clear", "Clouds" या "Rain"। - data.weather[0].main → API से मौसम का नाम। - .toLowerCase() → नाम को छोटे अक्षरों में बदलता है। जैसे "Clear" → "clear"। - condition → उस नाम को रखने वाला variable।
        document.body.className = condition; // यह <body> की class को मौसम के नाम के बराबर कर देती है। उदाहरण: अगर मौसम "Clouds" है, तो class "clouds" हो जाएगी।


        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const temperatureUnit = requestedUnit === "metric" ? "°C" : "°F";
        const windUnit = requestedUnit === "metric" ? "m/s" : "mph";

        result.classList.remove("error"); // अगली सफल search पर error वाली styling हट जाएगी।

        result.innerHTML = `
         <article class="weather-card">
            <h2>${data.name}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p>Temperature: ${Math.round(data.main.temp)} ${temperatureUnit}</p>
            <p>Feels like: ${Math.round(data.main.feels_like)} ${temperatureUnit}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind speed: ${Math.round(data.wind.speed)} ${windUnit}</p>;
        </article>
    `}


    
    function renderForecast(forecast, requestedUnit = unit) {
        const days = groupForecastByDay(forecast);

        const temperatureUnit = requestedUnit === "metric" ? "°C" : "°F";

        const cards = days.map((day) => { // ye function har din ke liye ek card return karega jisme us din ka forecast dikhaya jayega
            const date = new Date(`${day.date}T12:00:00Z`); // ye date ko UTC timezone mein convert karega taki hum correct date dikhayein

            const weekday = date.toLocaleDateString("en-IN", // to...string() yeh date se weekday ka naam deta hai, date ko device timezone ke karan pichle ya agle din mein badalne se rokta hai
                { 
                    weekday: "short",
                timeZone: "UTC" }); // ye date ko local timezone mein convert karega taki hum correct weekday dikhayein

            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}.png`;

            return `
                <article class="forecast-card">
                    <h3>${weekday}</h3>
                    <img src="${iconUrl}" alt="Forecast weather">
                    <p>Min: ${Math.round(day.min)} ${temperatureUnit}</p>
                    <p>Max: ${Math.round(day.max)} ${temperatureUnit}</p>
                </article>`;
        });

        const forecastContainer = document.querySelector("#forecast");

        forecastContainer.replaceChildren();

        forecastContainer.innerHTML = cards.join(""); // ye cards array ke saare elements ko ek string mein join karega taki hum innerHTML mein set kar sakein
    } // ek hi baar mein saare cards container mein render ho jaate hai
    // yeh code maan kar chalta hai ki forecastContainer hamesha available hai, agar ye element page mein nahi hai to error aayega. isliye humne index.html mein forecast section add kiya hai taki ye code sahi se kaam karein





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




 
        

       