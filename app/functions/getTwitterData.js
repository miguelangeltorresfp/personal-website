require('dotenv').config();

const statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const Twit = require('twit');

const twitterOauthConsumerKey = process.env.TWITTER_OAUTH_CONSUMER_KEY;
const twitterOauthConsumerSecret = process.env.TWITTER_OAUTH_CONSUMER_SECRET;
const twitterOauthToken = process.env.TWITTER_OAUTH_TOKEN;
const twitterOauthTokenSecret = process.env.TWITTER_OAUTH_SECRET;

const T = new Twit({
    consumer_key:         twitterOauthConsumerKey,
    consumer_secret:      twitterOauthConsumerSecret,
    access_token:         twitterOauthToken,
    access_token_secret:  twitterOauthTokenSecret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

exports.handler = function (event, context, callback) {
    T.get('statuses/user_timeline', { screen_name: 'RobertCooper_RC', tweet_mode: 'extended' }, function (err, data) {
        data.some(tweet => {
            if (tweet.retweeted === false && tweet.in_reply_to_status_id === null && tweet.is_quote_status === false) {
                console.log(tweet)
                // To remove the twitter link at the end of the tweet, uncomment the line below
                // const tweetText = tweet.full_text.slice(0, tweet.full_text.indexOf('https://t.co/'));
                const tweetText = tweet.full_text;
                callback(null, {statusCode,
                    headers,body: JSON.stringify(tweetText)});
                return true;
            }
            return false;
        });
    });
};