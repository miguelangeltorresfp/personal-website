require('dotenv').config();

const statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const https = require('https');
const stravaToken = process.env.STRAVA_TOKEN;

exports.handler = function (event, context, callback) {
    let stravaData = {};
    https.get("https://www.strava.com/api/v3/athlete/activities?access_token=" + stravaToken, res => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
            rawData += chunk;
        });
        res.on("end", () => {
            try {
                let parsedData = JSON.parse(rawData);
                for (let i = 0; i < parsedData.length; i++) {
                    if (parsedData[i]["type"] === "Run") {
                        let duration = new Date(null);
                        duration.setSeconds(parsedData[i]["moving_time"]);
                        duration = duration.toISOString().substr(11, 8);
                        // Remove leading zeros from run duration
                        if (duration.startsWith("00:")) {
                            duration = duration.slice(3);
                        } else if (duration.startsWith("0")) {
                            duration = duration.slice(1);
                        }
                        let distance_meters = parsedData[i]["distance"];
                        let distance_km = distance_meters / 1000;
                        distance_km = distance_km.toFixed(2);
                        let date_string = parsedData[i]["start_date_local"];
                        let date = new Date(date_string);
                        let dateStr = date.toLocaleDateString();
                        stravaData.distance = distance_km;
                        stravaData.date = dateStr;
                        stravaData.duration = duration;
                        break;
                    }
                }
                callback(null, { statusCode, headers, body: JSON.stringify(stravaData) });
            } catch (error) {
                return;
            }
        });
    }).on("error", (error) => {
        return;
    });
};