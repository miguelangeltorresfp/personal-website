const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const performRequest = require('./apiCalls');
const https = require('https');

app.use('/documents', express.static('public/documents'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));

app.set('views');
app.set('view engine', 'pug');

app.use(router);

router.get('/', (req, res) => {
  getStravaData( (stravaData) => {
    res.render('index', {
      stravaDistance: stravaData.distance,
      stravaDate: stravaData.date,
      stravaDuration: stravaData.duration,
    });
    console.log(stravaData);
  });
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use( (err, req, res, next) => {
  res.status(err.status);
  console.error(err.stack);
  res.send(err.stack);
});

app.listen(8080, () => {
  console.log("The application is running on localhost:8080!");
});

function getStravaData(callback) {
  https.get('https://www.strava.com/api/v3/athlete/activities?access_token=6f1ce73011107949166d10ea05e522443eab24c2', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let stravaData = {};

    let error;
    if (statusCode !== 200) {
     error = new Error('Request Failed.\n' +
                       `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
     error = new Error('Invalid content-type.\n' +
                       `Expected application/json but received ${contentType}`);
    }
    if (error) {
     console.error(error.message);
     // consume response data to free up memory
     res.resume();
     return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        for (i=0; i < parsedData.length; i++) {
          if (parsedData[i]["type"] == "Run") {
            let duration = new Date(null);
            duration.setSeconds(parsedData[i]["moving_time"]);
            duration = duration.toISOString().substr(11, 8);
           // Remove leading zeros from run duration
           if (duration.startsWith("00:")) {
             duration = duration.slice(3);
           } else if (duration.startsWith("0")) {
             duration = duration.slice(2);
           }
            let distance_meters = parsedData[i]["distance"];
            let distance_km = distance_meters/1000;
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
      } catch (e) {
       console.error(e.message);
      }
      console.log("My last run was " + stravaData.distance + " kms")
      callback(stravaData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
