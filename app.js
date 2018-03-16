let Twitter = require('twitter-node-client').Twitter;

let config = {
    "consumerKey": "Hf5ePvk7gctj7P0SSQuRCtKZb",
    "consumerSecret": "7romrCT0ilht1JmIKaE0WG0xGS5KiTSDSzyiR90IRetCJvINvT",
    "accessToken": "2417284658-DdzI9SV7Dn43CoERnlrGvC4Y6S0YLYeAOD5G3GQ",
    "accessTokenSecret": "aVKys4oz0yihVJ6e5gijCGHlmc8E0EzL6o0gy5nRbage6"
};

//Callback functions
let error = function (err, response, body) {
    console.log('ERROR [%s]', JSON.stringify(err));
};
let success = function (data) {
    console.log('Data [%s]', data);
};

let twitter = new Twitter(config);


// twitter.getUserTimeline({ screen_name: 'ksiabani', count: '10'}, error, success);
// Twitter.prototype.getUserTimeline = function (params, error, success) {
//     var path = '/statuses/user_timeline.json' + this.buildQS(params);
//     var url = this.baseUrl + path;
//     this.doRequest(url, error, success);
// };


// Get user timeline
function getUserTimeline() {
    let url = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=ksiabani&count=10';
    twitter.doRequest(url, error, success);
}

getUserTimeline();














// let Twitter = require('twitter-node-client').Twitter;






//Example calls























// twitter.getMentionsTimeline({ count: '10'}, error, success);
//
// twitter.getHomeTimeline({ count: '10'}, error, success);
//
// twitter.getReTweetsOfMe({ count: '10'}, error, success);
//
// twitter.getTweet({ id: '1111111111'}, error, success);


//
// Get 10 tweets containing the hashtag haiku
//

// twitter.getSearch({'q':'#haiku','count': 10}, error, success);

//
// Get 10 popular tweets with a positive attitude about a movie that is not scary
//

// twitter.getSearch({'q':' movie -scary :) since:2013-12-27', 'count': 10, 'result\_type':'popular'}, error, success);