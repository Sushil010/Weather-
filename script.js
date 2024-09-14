

const place = document.querySelector('#city');
const icon = document.querySelector('#search button');
const date = document.querySelector('#date');
const wimg = document.querySelector('#Weather img');
const footerBlocks = document.querySelectorAll('footer .end'); 


document.querySelector("#loader-info").style.display = "block";
document.querySelector("#loader-error-info").style.display = "none";
document.querySelector("#initial").style.display = "none";

async function Weather(cityName) {
    try {
        document.querySelector("#loader-info").style.display = "block";
        document.querySelector("#loader-error-info").style.display = "none";
        document.querySelector("#initial").style.display = "none";

        var out = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=35a80b0bfc3b98ce626b21c0bfd7d635&units=metric`);
        var result = await out.json();

        if (out.status === 200) {
            document.querySelector("#loader-info").style.display = "none";
            document.querySelector("#initial").style.display = "block";

            
            document.querySelector("#info #temp").innerHTML = Math.round(result.main.temp_max) + "°C";
            document.querySelector("#windspeed #wind").innerHTML = Math.round(result.wind.speed) + " Km/H";
            document.querySelector("#humidity #humid").innerHTML = Math.round(result.main.humidity) + "%";
            document.querySelector("#location #place").innerHTML = result.name;
            document.querySelector('#condition').innerHTML = result.weather[0].main;

            const localDate = getLocalDate(result.timezone);
            date.innerHTML = localDate;

            const ids = result.weather[0].id;
            const ret_img = getImages(ids);
            wimg.src = ret_img;

            
    
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=35a80b0bfc3b98ce626b21c0bfd7d635&units=metric`);
            const forecastData = await forecastResponse.json();

            updateFooter(forecastData.list);

        } else {
            
            showError();
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError();
    }
}

function showError() {
    document.querySelector("#loader-info").style.display = "none";
    document.querySelector("#initial").style.display = "none";
    document.querySelector("#loader-error-info").style.display = "block";
}

function getLocalDate(timezoneOffset) {
    const currentTime = new Date();
    const localTime = new Date(currentTime.getTime() + timezoneOffset * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return localTime.toLocaleDateString('en-US', options);
}

function getImages(weatherId) {
    if (weatherId >= 200 && weatherId <= 232) {
        return 'thunderstorm.svg';
    } else if (weatherId >= 300 && weatherId <= 321) {
        return 'drizzle.svg';
    } else if (weatherId >= 500 && weatherId <= 531) {
        return 'rain.svg';
    } else if (weatherId >= 600 && weatherId <= 622) {
        return 'snow.svg';
    } else if (weatherId === 800) {
        return 'clear.svg';
    } else if (weatherId >= 801 && weatherId <= 804) {
        return 'clouds.svg';
    } else {
        return 'atmosphere.svg';
    }
}

function updateFooter(forecastList) {
    const now = new Date();
    for (let i = 0; i < footerBlocks.length; i++) {
        if (i >= 5) break; 
        const forecast = forecastList[i * 8]; 
        const block = footerBlocks[i];
        const date = new Date(now.getTime() + ((i + 1) * 24 * 60 * 60 * 1000));
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        block.querySelector('h3').textContent = formattedDate;
        block.querySelector('#forecast img').src = getImages(forecast.weather[0].id);
        block.querySelector('#forecast h3').textContent = Math.round(forecast.main.temp) + "°C";
    }
}

icon.addEventListener('click', () => {
    const cityName = place.value.trim();
    if (cityName) {
        Weather(cityName);
    }
});

place.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const cityName = place.value.trim();
        if (cityName) {
            Weather(cityName);
        }
    }
});