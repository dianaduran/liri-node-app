require("dotenv").config();
var inquirer = require("inquirer");
var fs = require("fs");


//twitter
var Twitter = require('twitter');
var keys = require('./keys');
var client = new Twitter(keys.twitter);


//spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var action = 'spotify-this-song';


inquirer
    .prompt([{
        type: "checkbox",
        message: "What do you want to do?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "action"
    }])
    .then(function(response) {
        if (response.action == 'my-tweets') {
            action = 'my-tweets';
            GetData();
        }
        if (response.action == 'spotify-this-song') {
            action = 'spotify-this-song';
            GetData();
        }
        if (response.action == 'movie-this') {
            action = 'movie-this';
            GetData();
        }
        if (response.action == 'do-what-it-says')
            FunctionWhatSays();
    });




function GetData() {
    inquirer
        .prompt([{
            type: "input",
            message: "What do you want to search?",
            name: "search"
        }])
        .then(function(response) {
            if (response.search !== "" && action == 'spotify-this-song') {
                FunctionSpotify(response.search);
            } else if (response.search == "" && action == 'spotify-this-song') {
                FunctionSpotify('te quiero');
            } else if (response.search !== "" && action == 'movie-this') {
                FunctionMovie(response.search);
            } else if (response.search == "" && action == 'movie-this') {
                FunctionMovie('Mr.Nobody');
            }
            if (response.search !== "" && action == 'my-tweets') {
                FunctionTwitter(response.search);
            } else if (response.search == "" && action == 'my-tweets') {
                FunctionTwitter('nasa');
            }
        });
}


function FunctionTwitter(tweet) {

    var params = {
        q: tweet,
        count: 20
    }
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log("-----------Tweet: " + i + " -----------------------");
                console.log("1.-Created: " + tweets.statuses[i].created_at);
                console.log("2.-Text: " + tweets.statuses[i].text);
            }
        }
        saveData(tweet);
    });

}


function FunctionSpotify(song) {

    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
            return console.log(song + " not provided in Spotify");
        }
        console.log("---------------SONG----------------");
        //Artist(s)
        console.log("The artist is: " + data.tracks.items[0].album.artists[0].name);
        // Song's name
        console.log("Song name: " + data.tracks.items[0].name);
        // A preview link of the song from Spotify
        console.log("Preview link: " + data.tracks.items[0].album.external_urls.spotify);
        // The album that the song is from
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("--------------END--------------------");
        saveData(song);
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
            console.log("----------------Movie-----------------");
            console.log("The correct movie's title is: -----" + JSON.parse(body).Title);
            // * Year the movie came out.
            console.log("The year the movie came out is: ----" + JSON.parse(body).Year);
            // * IMDB Rating of the movie.
            console.log("The IMDB rating is: ----" + JSON.parse(body).imdbRating);
            // * Rotten Tomatoes Rating of the movie.
            var rottenT = JSON.parse(body).Ratings;
            if (rottenT[1] != undefined) {
                console.log("The rotten tomatoes rating is: ----" + rottenT[1].Value);
            } else { console.log("This movie has not this clasification"); }
            // * Country where the movie was produced.
            console.log("The movie was produced in: ----" + JSON.parse(body).Country);
            // * Language of the movie.
            console.log("The movie is in: ----" + JSON.parse(body).Language);
            // * Plot of the movie.
            console.log("The plot of the movie is: ----" + JSON.parse(body).Plot);
            // * Actors in the movie.
            console.log("The actors are: ----" + JSON.parse(body).Actors);
            console.log("----------------END---------------------");
            saveData(movie);
        }

    });

}

function FunctionWhatSays() {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        }
        var dataArray = data.split(",");
        if (dataArray[0] == 'spotify-this-song') // that is if you change the option in the file random
            FunctionSpotify(dataArray[1]);
        if (dataArray[0] == 'movie-this')
            FunctionMovie(dataArray[1]);
    })
}

function saveData(inf) {

    fs.appendFileSync("log.txt", inf + " \n", "UTF-8", { 'flags': 'a+' });

    console.log("The information was saved!");

}