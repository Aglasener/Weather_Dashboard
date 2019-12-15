var APIKey = "166a433c57516f51dfab1f7edaed8413";
var citySearch = "";
var lat = "";
var lon = "";
var searchHistory = [];

function history () {
    var cityHistory = JSON.parse(localStorage.getItem("cities"));
    console.log(cityHistory);
    if (cityHistory !== null){
        $(".city-list").empty();
        if (cityHistory.length > 10){
            cityHistory.length = 10;
        };
        for (var i = 0; i < cityHistory.length; i++){

            searchHistory = cityHistory;
            console.log(searchHistory);
            var cityHistoryEntry=$("<li class = 'list-group-item city-search'>").text(searchHistory[i]);
            $(".city-list").prepend(cityHistoryEntry);
        };
    };    
};

history();

function UVIndex (x, y){
    var queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?appid=" + 
    APIKey + "&lat=" + x + "&lon=" + y;

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response){
        console.log(response);
        $(".uvindex").text("UV Index: " + response.value);
    })
};

function getInfo(){
    citySearch = $("#city-search").val().trim();
    console.log(citySearch);
    searchHistory.unshift(citySearch);
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    history();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q="+citySearch+"&units=imperial&appid=" + APIKey;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $(".city").text(response.name + " Weather");
        $(".wind").text("Wind Speed: " + response.wind.speed + " mph");
        $(".humidity").text("Humidity: " + response.main.humidity+" %");
        $(".temp").text("Temperature: " + response.main.temp + " " + String.fromCharCode(176)+"F");
        lat = response.coord.lat;
        lon = response.coord.lon;

        UVIndex(lat, lon);
    })
    
    
}


$("#run-search").on("click", function(event) {
    event.preventDefault();
    getInfo();    
});

/*

  $(".city").html("<h1>" + response.name + " Weather Details</h1>");
  $(".wind").text("Wind Speed: " + response.wind.speed);
  $(".humidity").text("Humidity: " + response.main.humidity);
  $(".temp").text("Temperature (F) " + response.main.temp);

  // Converts the temp to Kelvin with the below formula
  var tempF = (response.main.temp - 273.15) * 1.80 + 32;
  $(".tempF").text("Temperature (Kelvin) " + tempF);

  // Log the data in the console as well
  console.log("Wind Speed: " + response.wind.speed);
  console.log("Humidity: " + response.main.humidity);
  console.log("Temperature (F): " + response.main.temp);
});
*/