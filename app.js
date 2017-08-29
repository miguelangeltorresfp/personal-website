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
app.use('/public', express.static('public'));

app.set('views');
app.set('view engine', 'pug');

app.use(router);

router.get('/', (req, res) => {
  getApiData( (apiData) => {
    res.render('index', {
      stravaDate: apiData.stravaDate,
      stravaDuration: apiData.stravaDuration,
      stravaDistance: apiData.stravaDistance,
      rescuetimeWebHours: apiData.rescuetimeWebHours,
      rescuetimeWebMinutes: apiData.rescuetimeWebMinutes,
      rescuetimeDistractedHours: apiData.rescuetimeDistractedHours,
      rescuetimeDistractedMinutes: apiData.rescuetimeDistractedMinutes
    });
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

function getApiData(callback) {
  let apiData = {}
  getRescuetimeDistractedData( (rescuetimeData) => {
    apiData.rescuetimeDistractedHours = rescuetimeData.hours;
    apiData.rescuetimeDistractedMinutes = rescuetimeData.minutes;
    getRescuetimeWebData( (rescuetimeData) => {
      apiData.rescuetimeWebHours = rescuetimeData.hours;
      apiData.rescuetimeWebMinutes = rescuetimeData.minutes;
      getStravaData( (stravaData) => {
        apiData.stravaDate = stravaData.date;
        apiData.stravaDistance = stravaData.distance;
        apiData.stravaDuration = stravaData.duration;
        callback(apiData);
      })
    });
  });
}
function getRescuetimeWebData(callback) {
  let rescuetimeData = {};
  https.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
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
        var hours = 0;
    		for (i = 0; i < parsedData["rows"].length; i++) {
    			if (parsedData["rows"][i][3] == "Software Development") {
    				var seconds = parsedData["rows"][i][1];
    				var minutes = seconds/60;
    				var hours = minutes/60;
    				break;
    			};
    		};
        minutes = Math.round((hours-parseInt(hours)) * 60);
        minutes = ("0" + minutes).slice(-2);
        hours = parseInt(hours);
        rescuetimeData.hours = hours;
        rescuetimeData.minutes = minutes;
      } catch (e) {
       console.error(e.message);
      }
      callback(rescuetimeData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function getRescuetimeDistractedData(callback) {
  let rescuetimeData = {};
  https.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=productivity', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
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
        var total_hours_distracted = 0;
      	for (i = 0; i < parsedData["rows"].length; i++) {
      		if (parsedData["rows"][i][3] == -1 | parsedData["rows"][i][3] == -2 ) {
      			var seconds = parsedData["rows"][i][1];
      			var minutes = seconds/60;
      			var hours = minutes/60;
      			total_hours_distracted += hours;
      		};
      	};
        minutes = Math.round((total_hours_distracted-parseInt(total_hours_distracted)) * 60);
        minutes = ("0" + minutes).slice(-2);
        hours = parseInt(total_hours_distracted);
        rescuetimeData.hours = hours;
        rescuetimeData.minutes = minutes;
      } catch (e) {
       console.error(e.message);
      }
      callback(rescuetimeData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

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
      callback(stravaData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
