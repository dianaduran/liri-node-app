require("dotenv").config();

var Twitter = require('twitter');
var keys = require('./keys');
var client = new Twitter(keys.twitter);



var action = process.argv[2];

switch (action) {
    case "my-tweets":
        FunctionTwitter();
        break;
}

function FunctionTwitter() {
    console.log(Twitter);
    console.log(client);
    var params = {
        q: 'nasa',
        count: 20
    }

    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
}