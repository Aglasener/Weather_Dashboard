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
            var cityHistoryEntry=$("<a href='#' class = 'list-group-item-action city-list-item'>").text(searchHistory[i]);
            $(".city-list").append(cityHistoryEntry);
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

function fiveDayForecast (x, y){
    var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + 
    APIKey + "&lat=" + x + "&lon=" + y;
    console.log(queryURL3);

    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function (response){
        console.log(response);
        for (var i = 1; i <= 5; i++){
            var id = 8*Number(i)-3;
            var d = new Date(response.list[id].dt_txt);
            $("#day-"+i+"-title").text(d.toLocaleDateString("en-US"));

            var iconID = response.list[id].weather[0].icon;
            console.log("id is " + iconID);
            var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+iconID+"@2x.png");
            $("#day-"+i+"-title").append(weatherIcon);
    
            $("#day-"+i+"-temp").text("Temp: " + response.list[id].main.temp + " " + String.fromCharCode(176)+"F");
            $("#day-"+i+"-humidity").text("Humidity: " + response.list[id].main.humidity +" %");           
            }
    
    })
    
};

function getInfo(citySearch){
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
        var iconID = response.weather[0].icon;
        var weatherIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/"+iconID+"@2x.png");
        var d = new Date();
       
        $(".city").text(response.name + " " + d.toLocaleDateString("en-US"));
        $(".city").append(weatherIcon);
        $(".wind").text("Wind Speed: " + response.wind.speed + " mph");
        $(".humidity").text("Humidity: " + response.main.humidity+" %");
        $(".temp").text("Temperature: " + response.main.temp + " " + String.fromCharCode(176)+"F");
        lat = response.coord.lat;
        lon = response.coord.lon;

        UVIndex(lat, lon);
        fiveDayForecast(lat, lon);
    })
       
}

getInfo(searchHistory[0]);

$("#run-search").on("click", function(event) {
    event.preventDefault();
    citySearch = $("#city-search").val().trim();
    getInfo(citySearch);    
});

$("#list-wrapper").on("click", ".city-list-item", function(event) {
    event.preventDefault();
    citySearch = $(this).text();
    console.log(citySearch);
    getInfo(citySearch);
});