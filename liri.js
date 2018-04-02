require("dotenv").config();


//twitter
var Twitter = require('twitter');
var keys = require('./keys');
var client = new Twitter(keys.twitter);


//spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var arrayWord = process.argv;
var action = process.argv[2];

var searchWord = "";
for (var i = 3; i < arrayWord.length; i++) {
    searchWord = searchWord + " " + arrayWord[i];
}

//console.log(action);
switch (action) {
    case "my-tweets":
        FunctionTwitter();
        break;
    case "spotify-this-song":
        FunctionSpotify(searchWord);
        break;
    case "movie-this":
        FunctionMovie(searchWord);
        break;
    case "do-what-it-says":
        FunctionWhatSays();
        break;
}

function FunctionTwitter() {
    var params = {
        q: 'nasa',
        count: 20
    }
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log("///Tweet: " + i);
                console.log("1.-Created: " + tweets.statuses[i].created_at);
                console.log("2.-Text: " + tweets.statuses[i].text);
            }
        }
    });
}

function FunctionSpotify(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
            return console.log(song + " not provided in Spotify");
        }
        console.log("///SONG///");
        //Artist(s)
        console.log("The artist is: " + data.tracks.items[0].album.artists[0].name);
        // Song's name
        console.log("Song name: " + data.tracks.items[0].name);
        // A preview link of the song from Spotify
        console.log("Preview link: " + data.tracks.items[0].album.external_urls.spotify);
        // The album that the song is from
        console.log("Preview link: " + data.tracks.items[0].album.name);
        console.log("///END///");
    });
}

function FunctionMovie(movie) {
    var request = require("request");
    // console.log(movie);
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(err, response, body) {
        if (JSON.parse(body).Error == "Movie not found!") {
            console.log("Not find that movie, sorry!!, but this is other movie");
            FunctionMovie("Mr.Nobody");
        } else {
            // * Title of the movie.
            console.log("///Movie///");
            console.log("The correct movie's title is: " + JSON.parse(body).Title);
            // * Year the movie came out.
            console.log("The year the movie came out is: " + JSON.parse(body).Year);
            // * IMDB Rating of the movie.
            console.log("The IMDB rating is: " + JSON.parse(body).imdbRating);
            // * Rotten Tomatoes Rating of the movie.
            var rottenT = JSON.parse(body).Ratings;
            if (rottenT[1] != undefined) {
                console.log("The rotten tomatoes rating is: " + rottenT[1].Value);
            } else { console.log("This movie has not this clasification"); }
            // * Country where the movie was produced.
            console.log("The movie was produced in: " + JSON.parse(body).Country);
            // * Language of the movie.
            console.log("The movie is in: " + JSON.parse(body).Language);
            // * Plot of the movie.
            console.log("The plot of the movie is: " + JSON.parse(body).Plot);
            // * Actors in the movie.
            console.log("The actors are: " + JSON.parse(body).Actors);
            console.log("///END///");
        }

    });
}

function FunctionWhatSays() {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }
        var dataArray = data.split(",");
        FunctionSpotify(dataArray[1]);
    })
}