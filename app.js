/**
 * App dependencies
 */
const axios = require('axios');
const Twitter = require('twitter');

const serviceBaseUrl = 'https://campus.cs.le.ac.uk/tyche/CO7214Rest3/rest/soa/';
const accessCode = 'ks4513';
const baseUrl = serviceBaseUrl + 'getUserName/' + accessCode;
const getUserName = url => axios.get(url);

let twitter = new Twitter({
    consumer_key: "Hf5ePvk7gctj7P0SSQuRCtKZb",
    consumer_secret: "7romrCT0ilht1JmIKaE0WG0xGS5KiTSDSzyiR90IRetCJvINvT",
    access_token_key: "2417284658-DdzI9SV7Dn43CoERnlrGvC4Y6S0YLYeAOD5G3GQ",
    access_token_secret: "aVKys4oz0yihVJ6e5gijCGHlmc8E0EzL6o0gy5nRbage6"
});
let friends = [];

// Ready? Go!
runAnalytics();

// Run analytics
function runAnalytics() {
    // Request a user name from SOA2018CW3 service
    getUserName(baseUrl)
        .then(response => {

            // This is our username to use for the operations below
            const userName = response.data;

            /**
             * Operation submitNumberFollowed
             */

            // Get number of users followed
            getFriendsList(userName)
                .then(data => {

                    friends = data.users;
                    const numberFollowed = friends.length;
                    const numberOfTweetsReceived = friends.reduce((a, b) => {
                        return a + b.statuses_count;
                    }, 0);
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


            /**
             * Operation submitNumberOfTweetsReceived
             */

            /**
             * Operation submitNumberOfRetweets
             */
            getTimeline(userName)
                .then(tweets => {

                    // get number of retweets
                    const numberOfRetweets = tweets.filter((tweet) => {
                        return tweet.created_at.indexOf('Jan') > -1
                            && tweet.created_at.indexOf('2018') > -1
                            && tweet.retweeted_status;
                    }).length;

                    // Submit the results
                    submitNumberOfRetweets(userName, numberOfRetweets)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitNumberOfRetweets ', response.data);
                        });
                });

            /**
             * Operation submitMostActiveFollowed
             */

        })
        .catch(() => {
            console.log('Oooops... Something went wrong!');
        });
}

// Twitter calls

// Get the number of users a user identified by userName is following
// function getNumberFollowed(userName) {
// function getFriendsIds(userName) {
//     let url = 'friends/ids.json';
//     let params = {cursor: -1, screen_name: userName, count: 5000};
//     return twitter.get(url, params);
// }

// Get timeline (tweets posted) of a user
function getTimeline(userName) {
    // https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
    let url = 'statuses/user_timeline.json';
    let params = {screen_name: userName};
    return twitter.get(url, params);
}

// Get friends list // Get NumberOfTweetsReceived
// https://api.twitter.com/1.1/friends/list.json?cursor=-1&screen_name=twitterapi&skip_status=true&include_user_entities=false
function getFriendsList(userName) {
    let url = 'friends/list.json';
    let params = {cursor: -1, screen_name: userName, count: 200, skip_status: true, include_user_entities: false};
    return twitter.get(url, params);
}

// SOA2018CW3 service calls
function submitNumberFollowed(userName, followed) {
    const url = serviceBaseUrl + `submitNumberFollowed/${accessCode}/${userName}/${followed}`;
    return axios.get(url);
}

function submitNumberOfTweetsReceived(userName, tweetsReceived) {
    const url = serviceBaseUrl + `submitNumberOfTweetsReceived/${accessCode}/${userName}/${tweetsReceived}`;
    return axios.get(url);
}

// number of retweets made by account name during January 2018
function submitNumberOfRetweets(userName, numberOfRetweets) {
    const url = serviceBaseUrl + `submitNumberOfRetweets/${accessCode}/${userName}/${numberOfRetweets}`;
    return axios.get(url);
}

function submitMostActiveFollowed(userName, account) {
    const url = serviceBaseUrl + `submitMostActiveFollowed/${accessCode}/${userName}/${account}`;
    return axios.get(url);
}
