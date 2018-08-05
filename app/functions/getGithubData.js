require('dotenv').config();

let statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const https = require("https");
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

exports.handler = function (event, context, callback) {
    async function fetchWeekContributions(username, format = '') {
        https
            .get(
                'https://robertcooper-github-contributions-api.now.sh/v1/robertcoopercode',
                (res) => {
                    res.headers['content-type'];
                    res.setEncoding('utf8');
                    let rawData = "";
                    res.on("data", chunk => {
                        rawData += chunk
                    });
                    res.on("end", () => {
                        callback(null, {statusCode, headers, body: rawData})
                    })
                },
            )
      }
      
      fetchWeekContributions('robertcoopercode')
};