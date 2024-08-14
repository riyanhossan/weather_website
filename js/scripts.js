let weatherSearch = document.getElementById("weatherSearch");
let cityNameHtml = document.getElementById("cityNameHtml");
let bigTempHtml = document.getElementById("bigTemp");
let windHtml = document.getElementById("wind");
let humidityHtml = document.getElementById("humidity");
let weatherMainHtml = document.getElementById("weatherMain");
let weatherDescriptionHtml = document.getElementById("weatherDescription");
let weatherDateHtml = document.getElementById("weatherDate");
let feelsLikeHtml = document.getElementById("feelsLike");

let cardTimeHtml = document.getElementsByClassName("cardTime");
let cardTempHtml = document.getElementsByClassName("cardTemp");
let cardWeatherHtml = document.getElementsByClassName("cardWeather");


// current data 
let keyId = "044d604bd4d59f4a466d43965fd7eea0"
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric"
// five days data 
let keyId2 = "044d604bd4d59f4a466d43965fd7eea0"
let apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast?&units=metric"
let weatherData;
let weatherData2;
let weatherday;
let weatherMonth;
let weatherYear;
let Month;
let weatherDateData;
let i = 0;

async function weatherCall() {
    await weatherDataProccess();
    await weatherRender();
    
}
async function weatherDataProccess(){
    const cityName = weatherSearch.value;
    // current data
    try{
        const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${keyId}`);
        weatherData = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }
    }catch(error){
        return alert('Not Found');
    }
    
    // five day data
    try{
        const response2 = await fetch(apiUrl2 + `&q=${cityName}` + `&appid=${keyId2}`);
        weatherData2 = await response2.json();
        console.log(weatherData2);
        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }
    }catch(error){
        return alert('Not Found five day');
    }
    
    const timestamp = weatherData.dt;
    
    console.log(timestamp);
    
    const weatherDate = new Date(timestamp * 1000);
    weatherDateData = weatherDate;
    console.log(weatherDateData);
    weatherday = weatherDate.getDate().toString().padStart(2, '0');
    Month = weatherDate.getMonth() + 1;
    weatherMonth =Month.toString().padStart(2, '0');
    weatherYear = weatherDate.getFullYear();
}

async function weatherRender(){
    cityNameHtml.innerHTML = weatherData.name;
    bigTempHtml.innerHTML = Math.round(weatherData.main.temp);
    windHtml.innerHTML = weatherData.wind.speed;
    humidityHtml.innerHTML = weatherData.main.humidity;
    weatherMainHtml.innerHTML = weatherData.weather[0].main;
    weatherDescriptionHtml.innerHTML = weatherData.weather[0].description;
    weatherDateHtml.innerHTML = `${weatherday}.${weatherMonth}.${weatherYear}`;
    feelsLikeHtml.innerHTML = Math.round(weatherData.main.feels_like);
    
    // card render
    await timeProccess();
}

async function timeProccess() {
    // current time
    let cityTimezoneOffset = weatherData.timezone;
    console.log(cityTimezoneOffset);
    let currentHour = new Date((weatherData.dt + cityTimezoneOffset) * 1000).getUTCHours();
    console.log(currentHour);
    if (currentHour <= 20) {
        while (i < weatherData2.list.length) {
            let forecastHour = new Date((weatherData2.list[i].dt + cityTimezoneOffset) * 1000).getHours();
            console.log(`Forecast hour: ${forecastHour}, Current hour: ${currentHour}`);
            
            if (forecastHour > currentHour) {
                break;
            }
            i++;
        }
    } else {
        i = 7;
    }
    console.log(i);
    await renderCard(i, cityTimezoneOffset);
    
}

async function renderCard(k, cityTimezoneOffset) {
    let classIndex = 0;
    for(let j = k; j<k+5; j++){
        let period = 'AM';
        const timestamp2 = weatherData2.list[j].dt + cityTimezoneOffset;
        const date2 = new Date(timestamp2 * 1000);

        let weatherHours = date2.getHours();
        console.log(weatherHours);

        if (weatherHours >= 12) {
            period = 'PM';
        }
        weatherHours = weatherHours % 12 || 12;
        cardTimeHtml[classIndex].innerHTML = `${weatherHours} ${period}`;
        cardTempHtml[classIndex].innerHTML = Math.round(weatherData2.list[j].main.temp);
        cardWeatherHtml[classIndex].innerHTML = weatherData2.list[j].weather[0].main;
        classIndex ++;
    }
}
