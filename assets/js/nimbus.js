// Function to make an HTTP request and return JSON
async function fetchWeather() {
    try {
        var response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=7a870ed4880f4ba98b845519232111&q=auto:ip&days=1&aqi=yes&alerts=yes');
        var data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function formatTime(time) {

    // Parse the input string into a Date object
    var date = new Date(time.datetime);
    date.setTime(date.getTime() + time.raw_offset * 1000);
    // Define the days of the week and months arrays
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get the day, month, and year
    var dayOfWeek = daysOfWeek[date.getUTCDay()];
    var day = date.getUTCDate();
    var month = months[date.getUTCMonth()];
    var year = date.getUTCFullYear();

    // Get the hours and minutes
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();

    var dateTimeObject = {
        date: `${dayOfWeek}, ${month} ${day}, ${year}`,
        time: `${hours}:${minutes < 10 ? '0' : ''}${minutes}`
      };

    return dateTimeObject

}

async function fetchTime() {
    try {
        var response = await fetch('http://worldtimeapi.org/api/ip');
        r = await response.json()
        time = await formatTime(r);
        return time
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to modify HTML using the JSON response
function updateHTMLweather(jsonData) {
    var wctitle = document.getElementById('wctitle');
    wctitle.innerHTML = `
                ${jsonData.location.name}
            `;
    var wctemp = document.getElementById('wctemp');
    wctemp.innerHTML = `
                ${jsonData.current.temp_c} °C
            `;
    var wcstatus = document.getElementById('wcstatus');
    wcstatus.innerHTML = `
                ${jsonData.current.condition.text}
            `;
    var wcicon = document.getElementById('wcicon');
    wcicon.innerHTML = `
            <img src="https:${jsonData.current.condition.icon}" />
            `;
    var wcsunset = document.getElementById('wcsunset');
    wcsunset.innerHTML = `
                ${jsonData.forecast.forecastday[0].astro.sunset}
            `;
    var wchum = document.getElementById('wchum');
    wchum.innerHTML = `
                ${jsonData.current.humidity}%
            `;
    var wcwind = document.getElementById('wcwind');
    wcwind.innerHTML = `
                ${jsonData.current.wind_kph} Km/h
            `;
    var wcwinddir = document.getElementById('wcwinddir');
    wcwinddir.innerHTML = `
                ${jsonData.current.wind_dir}
            `;
}

function updateHTMLtime(jsonData) {
    var day = document.getElementById('tcday');
    var time = document.getElementById('tctime');

    day.innerHTML = `${jsonData.date}`;
    time.innerHTML = `${jsonData.time}`;
}

// Function to be called on page load
async function onPageLoad() {
    var wData = await fetchWeather();
    var time = await fetchTime();
    updateHTMLtime(time);
    updateHTMLweather(wData);
}

// Function to be called every x minutes
function getWeather() {
    setInterval(async () => {
        var jsonData = await fetchWeather();
        updateHTMLweather(jsonData);
    }, 180000); // 60000 milliseconds = 1 minute
}

function getTime() {
    setInterval(async () => {
        var time = await fetchTime();
        updateHTMLtime(time);
    }, 10000); // 60000 milliseconds = 1 minute
}

// Call functions on page load
onPageLoad();

// Call function every x minutes
getWeather();

getTime();