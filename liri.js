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
        count: 1
    }
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            console.log(JSON.stringify(tweets, null, 2));
            var resp = JSON.stringify(tweets, null, 2);
            console.log("1.-Created: " + resp.statuses);
        }
    });
}

function FunctionSpotify(song) {
    // console.log(song);

    spotify
        .search({ type: 'track', query: song, limit: 1 })
        .then(function(response) {
            console.log(JSON.stringify(response, null, 2));
            var resp = JSON.stringify(response);
            console.log(resp.tracks.items);
        })
        .catch(function(err) {
            console.log(err);
        });
    // spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
    //     if (err) {
    //         return console.log(song + " by Ace of Base" + err);
    //     }
    //     //JSON.stringify(data, null, 2);
    //     var resp = JSON.stringify(data, null, 2);
    //     //Artist(s)
    //     console.log("////////");
    //     var aux = resp;
    //     console.log("The artist is: " + aux.tracks.items.name);
    //     // The song's name
    //     // A preview link of the song from Spotify
    //     // The album that the song is from
    //     console.log(resp);

    // });
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
            //console.log(JSON.parse(body));
            // * Title of the movie.
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
        //  console.log(dataArray[1]);
        FunctionSpotify(dataArray[1]);
    })
}