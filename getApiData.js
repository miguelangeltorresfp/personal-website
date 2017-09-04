const https = require('https');

function githubRecentRepos(callback) {
  https.get( {
    host: 'api.github.com',
    path: '/users/engineering-robert/repos?sort=pushed&client_id=3f5aa7e51ab02b6d5d8b&client_secret=e4910aca21430393b7e585712fdaa3da8f29e23f',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Engineering-Robert'
    }
    }, (res) => {
      apiErrorHandling(res);
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          let recentRepos = [];
          const parsedData = JSON.parse(rawData);
          for (let i=0; i < 5; i++) {
            recentRepos.push(parsedData[i].full_name);
          }
          callback(recentRepos);
        } catch (e) {
         console.error(e.message);
        }
      });
    }
  ).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function githubCommits(repositoryName, callback) {
  let date = new Date();
  let dateString = date.toISOString().substring(0,11) + '00:00:00.000Z';
  https.get( {
    host: 'api.github.com',
    path: '/repos/' + repositoryName + '/commits?since=' + dateString + '&client_id=3f5aa7e51ab02b6d5d8b&client_secret=e4910aca21430393b7e585712fdaa3da8f29e23f',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Engineering-Robert'
    }
    }, (res) => {
      apiErrorHandling(res);
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          let commitCount = parsedData.length;
          return callback(commitCount);
        } catch (e) {
         console.error(e.message);
        }
      });
    }
  ).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

// totalCommits()
function getGithubData(callback) {
  githubRecentRepos((repositories) => {
    let totalCommits = 0;
    count = repositories.length;
    for (let i=0; i < repositories.length; i++) {
      repositoryName = repositories[i];
      githubCommits(repositoryName, (commits) => {
        count--;
        totalCommits += commits;
        if (count === 0) {
          let githubData = {
            'commits': totalCommits
          };
          callback(githubData);
        }
      });
    }
  });
}

function apiErrorHandling(res) {
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
}

function getRescuetimeWebData(callback) {
  let rescuetimeData = {};
  https.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', (res) => {
    apiErrorHandling(res);
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
        rescuetimeData.minutes = ("0" + minutes).slice(-2);
        rescuetimeData.hours = parseInt(hours);
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
    apiErrorHandling(res);
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

function getRescuetimeData(callback) {
  let rescuetimeData = {};
  getRescuetimeWebData((rescuetimeWebData) => {
    rescuetimeData.webMinutes = rescuetimeWebData.minutes;
    rescuetimeData.webHours = rescuetimeWebData.hours;
    getRescuetimeDistractedData((rescuetimeDistractedData) => {
      rescuetimeData.distractedMinutes = rescuetimeDistractedData.minutes;
      rescuetimeData.distractedHours = rescuetimeDistractedData.hours;
      callback(rescuetimeData);
    });
  });

}

function getStravaData(callback) {
  let stravaData = {};
  https.get('https://www.strava.com/api/v3/athlete/activities?access_token=6f1ce73011107949166d10ea05e522443eab24c2', (res) => {
    apiErrorHandling(res);
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

function getMediumData(callback) {
  let mediumData = {};
  https.get( {
      host: 'medium.com',
      path: '/@robertcooper_18384/latest',
      headers: {
        Accept: 'application/json'
      }
    }, (res) => {
    apiErrorHandling(res);
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      rawData = rawData.replace('])}while(1);</x>', '');
      try {
        const parsedData = JSON.parse(rawData);
        const posts = parsedData['payload']['references']['Post']
        for (let i = 1; i <= 3; i++) {
          let post = posts[Object.keys(posts)[i-1]];
          mediumData['title' + i] = post['title'];
          mediumData['excerpt' + i] = post['content']['subtitle'];
          mediumData['url' + i] = 'https://medium.com/@robertcooper_18384/' + post['uniqueSlug']
        }
      } catch (e) {
       console.error(e.message);
      }
      callback(mediumData);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

module.exports = {
  getMediumData: getMediumData,
  getStravaData: getStravaData,
  getRescuetimeData: getRescuetimeData,
  getGithubData: getGithubData
}
