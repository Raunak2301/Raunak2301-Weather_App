const apiKey = "4808b18d10c390e93a4557d8413ee896";

function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleString();
}
setInterval(updateDateTime, 30000);
updateDateTime();

document.getElementById("search-btn").addEventListener("click", getWeather);

function getWeather() {
  const city = document.getElementById("city-input").value.trim();
  const weatherInfo = document.getElementById("weather-info");
  const forecastScroll = document.getElementById("forecast-scroll");

  if (!city) {
    weatherInfo.innerHTML = "<p>Please enter a city name.</p>";
    forecastScroll.innerHTML = "";
    return;
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  // Get current weather
  fetch(weatherUrl)
    .then(response => {
      if (!response.ok) throw new Error("City not found.");
      return response.json();
    })
    .then(data => {
      const icon = data.weather[0].icon;
      const desc = data.weather[0].description;
      weatherInfo.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Condition:</strong> ${desc}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Feels like:</strong> ${data.main.feels_like} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
      `;
    })
    .catch(err => {
      weatherInfo.innerHTML = `<p style="color:red;">${err.message}</p>`;
      forecastScroll.innerHTML = "";
    });

  // Get forecast
  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) throw new Error("Forecast not available.");
      return response.json();
    })
    .then(data => {
      let forecastHTML = "";
      for (let i = 0; i < 6; i++) {
        const forecast = data.list[i];
        const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const icon = forecast.weather[0].icon;
        forecastHTML += `
          <div class="hour-box">
            <p>${time}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
            <p>${forecast.main.temp} °C</p>
          </div>
        `;
      }
      forecastScroll.innerHTML = forecastHTML;
    })
    .catch(err => {
      forecastScroll.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
}
