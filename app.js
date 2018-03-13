let OAuth = require('oauth').OAuth;
let qs = require('qs');

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

//
function Twitter(config) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
    this.accessToken = config.accessToken;
    this.accessTokenSecret = config.accessTokenSecret;
    this.callBackUrl = config.callBackUrl;
    this.baseUrl = 'https://api.twitter.com/1.1';
    this.oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        this.consumerKey,
        this.consumerSecret,
        '1.0',
        this.callBackUrl,
        'HMAC-SHA1'
    );
}

Twitter.prototype.getOAuthRequestToken = function (next) {
    this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log('ERROR: ' + error);
            next();
        }
        else {
            var oauth = {};
            oauth.token = oauth_token;
            oauth.token_secret = oauth_token_secret;
            console.log('oauth.token: ' + oauth.token);
            console.log('oauth.token_secret: ' + oauth.token_secret);
            next(oauth);
        }
    });
};

Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
            if (error) {
                console.log('ERROR: ' + error);
                next();
            } else {
                oauth.access_token = oauth_access_token;
                oauth.access_token_secret = oauth_access_token_secret;

                console.log('oauth.token: ' + oauth.token);
                console.log('oauth.token_secret: ' + oauth.token_secret);
                console.log('oauth.access_token: ' + access_token.token);
                console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
                next(oauth);
            }
        }
    );
};

Twitter.prototype.buildQS = function (params) {
    if (params && Object.keys(params).length > 0) {
        return '?' + qs.stringify(params);
    }
    return '';
};

Twitter.prototype.doRequest = function (url, error, success) {
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
    url = url.replace(/\!/g, "%21")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");

    this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
        console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            success(body);
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.getUserTimeline = function (params, error, success) {
    var path = '/statuses/user_timeline.json' + this.buildQS(params);
    var url = this.baseUrl + path;
    this.doRequest(url, error, success);
};



twitter.getUserTimeline({ screen_name: 'BoyCook', count: '10'}, error, success);














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