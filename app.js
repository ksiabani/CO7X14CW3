/**
 * App dependencies
 */
const axios = require('axios');
const Mock = require('./mock');
const Twitter = require('twitter');


const serviceBaseUrl = 'https://campus.cs.le.ac.uk/tyche/CO7214Rest3/rest/soa/';
const accessCode = 'ks4513';
const baseUrl = serviceBaseUrl + 'getUserName/' + accessCode;
const getUserName = url => axios.get(url);
const mock = Mock.data;

let twitter = new Twitter({
    consumer_key: "Hf5ePvk7gctj7P0SSQuRCtKZb",
    consumer_secret: "7romrCT0ilht1JmIKaE0WG0xGS5KiTSDSzyiR90IRetCJvINvT",
    access_token_key: "2417284658-DdzI9SV7Dn43CoERnlrGvC4Y6S0YLYeAOD5G3GQ",
    access_token_secret: "aVKys4oz0yihVJ6e5gijCGHlmc8E0EzL6o0gy5nRbage6"
});

// Ready? Go!
runAnalytics();

// Run analytics
function runAnalytics() {
    // Request a user name from SOA2018CW3 service
    getUserName(baseUrl)
        .then(response => {

            // This is our username to use for the operations below
            const screenName = response.data;

            /**
             * Operation submitNumberFollowed
             */

            // Get number of users followed with Twitter API
            getNumberFollowed(screenName)
                .then(data => {

                    // NumberFollowed is the length of the array returned
                    const numberFollowed = data.ids.length;

                    // Submit the results to the SOA2018CW3 service
                    submitNumberFollowed(screenName, numberFollowed)
                        .then(response => {
                            // Pass or fail
                            console.log('Operation submitNumberFollowed ', response.data);
                        })
                });


            /**
             * Operation submitNumberOfTweetsReceived
             */

            /**
             * Operation submitNumberOfRetweets
             */

            /**
             * Operation submitMostActiveFollowed
             */

        })
        .catch(() => {
            console.log('Oooops... Something went wrong!');
        });
}

// Twitter calls
function getNumberFollowed(screenName) {
    let url = 'friends/ids.json';
    let params = {cursor: -1, screen_name: screenName, count: 5000};
    return twitter.get(url, params);
}


// SOA2018CW3 service calls
function submitNumberFollowed(screenName, numberFollowed) {
    const url = `https://campus.cs.le.ac.uk/tyche/CO7214Rest3/rest/soa/submitNumberFollowed/ks4513/${screenName}/${numberFollowed}`;
    // console.log(url);
    return axios.get(url);
}





