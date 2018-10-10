require("dotenv").config();

var request = require("request")
var moment = require("moment")
    moment().format();

var keys = require("./key.js")
var Spotify = require("node-spotify-api")
var spotifySearch = new Spotify (keys.spotify) 

var fs = require("fs")

var action = process.argv[2]
var search = process.argv.slice(3)
for (var i = 0; i < search.length; i++) {
    search = search.toString().replace(",", "%20")
}

switch (action) {
    case "movie-this":
        movieThis()
        break
    case "spotify-this-song":
        spotifyThis()
        break
    case "concert-this":
        concertThis()
        break
    case "do-what-it-says":
        doThis()
        break
}

function spotifyThis() {
    if(search.length === 0){
        search = "The%20Sign"
    }
      spotifySearch.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log(data) 
      });
}

function movieThis() {
    var movies = keys.Movies
    var searchMovie = movies.id    
    if(search.length === 0){ 
        search = "Mr%20Nobody"
    }
    var queryOMDB = "http://www.omdbapi.com/?apikey=" + searchMovie + "&t=" + search
    request(queryOMDB, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("-----------------------" + 
                        "\nTitle: " + JSON.parse(body).Title +
                        "\nReleased: " + JSON.parse(body).Year +
                        "\nIMDB Rating: " + JSON.parse(body).imdbRating +
                        "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
                        "\nCountry: " + JSON.parse(body).Country +
                        "\nLanguage: " + JSON.parse(body).Language +
                        "\nPlot: " + JSON.parse(body).Plot +
                        "\nStarring: " + JSON.parse(body).Actors +
                        "\n-----------------------")
        }
    })
}

function concertThis() {
    var bands = keys.Bands
    var searchBand = bands.id
    var queryBIT = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + searchBand
    request(queryBIT, function (error, response, body) {
        if (!error && response.statusCode === 200) {
                var name = JSON.parse(body)
                var city = JSON.parse(body)
                var region = JSON.parse(body)
                var country = JSON.parse(body)
                var date = JSON.parse(body)
            console.log("-----------------------" +
                        "\nArtist: " + search.toString().replace("%20", " ") +               
                        "\nVenue Name: " + name[0].venue.name +               
                        "\nLocation: " + city[0].venue.city + ", " + region[0].venue.region  + " " + country[0].venue.country +              
                        "\nDate: " + moment(date[0].datetime).format("MM/DD/YYYY") + " at " + moment(date[0].datetime).format("hh:mm A") +
                        "\n-----------------------")
        }
    })
}

function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        var holder = []
        var text = JSON.stringify(data)
        for(var i = 0; i < text.length; i++){
            text = text.replace('"', " ")
        }
        holder = text.split(",")
        action = holder[0]
        search = holder[1]

        console.log(holder[0])
        console.log(holder[1].replace("\\", ""))
        spotifyThis()
    })
}