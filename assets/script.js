var apiKey = "d8d4f05b50b7d94eb4d9780e42b2fccf";
var currently = dayjs().format("MM/DD/YYYY");
var savedSearches = [];
var forecast = document.getElementById("forecast");
var cityInfo = document.getElementById("cityInfo");
var fiveDay = document.getElementById("fiveDay");

function search(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#forecast").css("display", "block");
      $("#cityInfo").empty();

      var iconCode = data.weather[0].icon;
      var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

      var currentCity = $(`
            <h2 id="currentCity">
                ${data.name} ${currently} <img src="${iconURL}" alt="${data.weather[0].description}" />
            </h2>
            <p>Temperature: ${data.main.temp} °Celsius</p>
            <p>Humidity: ${data.main.humidity}\%</p>
            <p>Wind Speed: ${data.wind.speed} KM/H</p>
        `);

      $("#cityInfo").append(currentCity);

      var lat = data.coord.lat;
      var lon = data.coord.lon;

      fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (uvStat) {
          console.log(uvStat);

          var uvIndex = uvStat.value;
          var uvIndexP = $(`
                            <p>UV Index: 
                                <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                            </p>
                        `);

          $("#cityInfo").append(uvIndexP);

          if (uvIndex < 3) {
            $("#uvIndexColor").css("background-color", "green");
          } else if (uvIndex < 6) {
            $("#uvIndexColor").css("background-color", "yellow");
          } else if (uvIndex < 8) {
            $("#uvIndexColor").css("background-color", "orange");
          } else if (uvIndex < 11) {
            $("#uvIndexColor").css("background-color", "red");
          } else {
            $("#uvIndexColor").css("background-color", "grey");
          }
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (futureResponse) {
              console.log(futureResponse);
              $("#fiveDay").empty();

              let fiveDayArray = futureResponse.list.filter(day => day.dt_txt.includes('12:00:00'));
                    for (let i = 0; i < fiveDayArray.length; i++) {

                var currDate =  new Date(fiveDayArray[i].dt_txt).toLocaleString().split(',')[0];
                var iconURL = fiveDayArray[i].weather[0].icon;
                var iconPic = `<img src="http://openweathermap.org/img/wn/${iconURL}@2x.png"/>`        
                var futureCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                        <div class="card-body">
                            <p>${iconPic}</p>
                            <p>${currDate}</p>
                            <p>Temperature: ${fiveDayArray[i].main.temp} °Celsius</p>
                            <p>Humidity: ${fiveDayArray[i].main.humidity}\%</p>
                        </div>
                    </div>
                <div>
            `);

                $("#fiveDay").append(futureCard);
              }
            });
        });
    });
}

// Function to save search data to local storage and display it under search history
function saveSearch(cityName) {
  var storedCity = document.getElementById("cityName").value;
  localStorage.setItem(cityName, storedCity);
  var createLi = document.createElement("li");
  createLi.textContent = storedCity;
  document.getElementById("searchHistory").appendChild(createLi);
}

// Event listener for search button
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  saveSearch();
  var city = $("#cityName").val().trim();
  search(city);
});

$(document).on("click", "#searchHistory li", function() {
    var listCity = $(this).text();
    search(listCity);
});