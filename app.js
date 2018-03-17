/**
 * App dependencies:
 * Axios is an HTTP client (https://github.com/axios/axios)
 * Twitter is the a twitter client for JavaScript (https://github.com/desmondmorris/node-twitter)
 * The following solution makes heavy use of JS promises (https://github.com/mattdesl/promise-cookbook)
 */
const axios = require('axios');
const Twitter = require('twitter');

// Basic variables
const serviceBaseUrl = 'https://campus.cs.le.ac.uk/tyche/CO7214Rest3/rest/soa/';
const accessCode = 'ks4513';
const baseUrl = serviceBaseUrl + 'getUserName/' + accessCode;

// Start the Twitter client
let twitter = new Twitter({
    consumer_key: "Hf5ePvk7gctj7P0SSQuRCtKZb",
    consumer_secret: "7romrCT0ilht1JmIKaE0WG0xGS5KiTSDSzyiR90IRetCJvINvT",
    access_token_key: "2417284658-DdzI9SV7Dn43CoERnlrGvC4Y6S0YLYeAOD5G3GQ",
    access_token_secret: "aVKys4oz0yihVJ6e5gijCGHlmc8E0EzL6o0gy5nRbage6"
});

// Ready? Go!
runAnalytics();

/**
 * Functions definitions
 * runAnalytis is the main function of the program, will do all Twitter API calls and all calls to SOA2018CW3 service
 */
function runAnalytics() {

    // Instantiate friends array
    let friends = [];

    // Request a user name from SOA2018CW3 service
    getUserName(baseUrl)
        .then(response => {

            // This is our username to use for the operations below
            const userName = response.data;

            // Use Twitter API to get the friends for our user (users followed)
            // This list of friends will allows us to cover and submit three of our service operations
            getFriendsList(userName)
                .then(data => {

                    // Returns an array of friends
                    friends = data.users;

                    // The length of this array is the number of friends our user follows
                    const numberFollowed = friends.length;

                    // Friends array also includes how many tweets (statuses) each one has, so we sum them up
                    const numberOfTweetsReceived = friends.reduce((a, b) => {
                        return a + b.statuses_count;
                    }, 0);

                    // The friends with the more tweets is the most active one. To get it we:
                    // 1. Sort and reverse the array of friends based on field "statuses_count"
                    // 2. Return the name of the first one in the array
                    const mostActiveFollowed = friends.sort((a,b) => {
                        return (a.statuses_count || 0) - b.statuses_count;
                    }).reverse()[0].screen_name;

                    // Submit the results to the SOA2018CW3 service
                    submitNumberFollowed(userName, numberFollowed)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitNumberFollowed ', response.data);
                        });

                    // Submit the results to the SOA2018CW3 service
                    submitNumberOfTweetsReceived(userName, numberOfTweetsReceived)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitNumberOfTweetsReceived ', response.data);
                        });

                    // Submit the results to the SOA2018CW3 service
                    submitMostActiveFollowed(userName, mostActiveFollowed)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitMostActiveFollowed ', response.data);
                        });

                });

            // Use Twitter API to get the timeline (the tweets) of a user
            // This returns an array of tweets
            getTimeline(userName)
                .then(tweets => {

                    // Get number of retweets  by filtering the array of tweets for only those tweets that:
                    // 1. Contain the keywords 'Jan' and '2018' within the field "created_at"
                    // 2. The field retweeted_status is not empty (hence this tweet has been retweeted)
                    // Last, we get the length of this array
                    const numberOfRetweets = tweets.filter((tweet) => {
                        return tweet.created_at.indexOf('Jan') > -1
                            && tweet.created_at.indexOf('2018') > -1
                            && tweet.retweeted_status;
                    }).length;

                    // Submit the results to the SOA2018CW3 service
                    submitNumberOfRetweets(userName, numberOfRetweets)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitNumberOfRetweets ', response.data);
                        });
                });
        })
        .catch(() => {
            // Some very basic error handling if one of the promises above fails
            console.log('Oooops... Something went wrong!');
        });
}

/**
 * API functions
 * Functions that call the Twitter API
 * All functions return the response body of the API call
 */

// Get timeline (tweets posted) of a user
function getTimeline(userName) {
    let url = 'statuses/user_timeline.json';
    let params = {screen_name: userName};
    return twitter.get(url, params);
}

// Returns users followed (friends) by a certain user
function getFriendsList(userName) {
    let url = 'friends/list.json';
    let params = {cursor: -1, screen_name: userName, count: 200, skip_status: true, include_user_entities: false};
    return twitter.get(url, params);
}

/**
 * Service functions
 * Functions that call the SOA2018CW3 service
 * All functions return the response body of the service call
 */

// Get username from SOA2018CW3 service
function getUserName(url) {
    return axios.get(url);
}

// Operation submitNumberFollowed
function submitNumberFollowed(userName, followed) {
    const url = serviceBaseUrl + `submitNumberFollowed/${accessCode}/${userName}/${followed}`;
    return axios.get(url);
}

// Operation submitNumberOfTweetsReceived
function submitNumberOfTweetsReceived(userName, tweetsReceived) {
    const url = serviceBaseUrl + `submitNumberOfTweetsReceived/${accessCode}/${userName}/${tweetsReceived}`;
    return axios.get(url);
}

// Operation submitNumberOfRetweets
function submitNumberOfRetweets(userName, numberOfRetweets) {
    const url = serviceBaseUrl + `submitNumberOfRetweets/${accessCode}/${userName}/${numberOfRetweets}`;
    return axios.get(url);
}

// Operation submitMostActiveFollowed
function submitMostActiveFollowed(userName, account) {
    const url = serviceBaseUrl + `submitMostActiveFollowed/${accessCode}/${userName}/${account}`;
    return axios.get(url);
}
