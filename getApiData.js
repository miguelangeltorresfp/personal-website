const https = require('https');
const apiKeys = require('./apiKeys.json');
const moment = require('moment-timezone');
const githubId = apiKeys.github.id;
const githubSecret = apiKeys.github.secret;
const rescuetimeKey = apiKeys.rescuetime.key;
const stravaToken = apiKeys.strava.token;

const githubRecentRepos = new Promise((resolve, reject) => {
    https.get( {
            host: 'api.github.com',
            path: '/users/robertcoopercode/repos?sort=pushed&client_id=' + githubId + '&client_secret=' + githubSecret,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'robertcoopercode'
            }
        }, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    let recentRepos = [];
                    const parsedData = JSON.parse(rawData);
                    for (let i=0; i < 5; i++) {
                        recentRepos.push(parsedData[i].full_name);
                    }
                    resolve(recentRepos);
                } catch (e) {
                    reject({error: "Github API call fail."});
                }
            });
        }
    ).on('error', (e) => {
        reject({error: "Github API call fail."});
    });
})

const githubCommits = repositoryName => new Promise((resolve, reject) => {
    let today = moment().tz("America/Toronto").hour(0).minute(0).second(0).format();
    https.get( {
            host: 'api.github.com',
            path: '/repos/' + repositoryName + '/commits?since=' + today + '&client_id=' + githubId  + '&client_secret=' + githubSecret,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'robertcoopercode'
            }
        }, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    let commitCount = parsedData.length;
                    if (commitCount === undefined) {
                        reject({error: "Github API call fail."})
                    } else {
                        resolve(commitCount);
                    }
                } catch (e) {
                    reject({error: "Github API call fail."})
                }
            });
        }
    ).on('error', (e) => {
        reject({error: "Github API call fail."});
    });
})

async function getGithubData() {
    try {
        let totalCommits = 0;
        const repositories = await githubRecentRepos
        let count = repositories.length;
        for (let i = 0; i < repositories.length; i++) {
            let repositoryName = repositories[i];
            const commits = await githubCommits(repositoryName)
            count--;
            totalCommits += commits;
            if (count === 0) {
                return {
                    'commits': totalCommits
                }
            }
        }
    } catch (error) {
        throw error
    }
}

const getRescuetimeWebData = new Promise((resolve, reject) => {
    let rescuetimeData = {};
    https.get('https://www.rescuetime.com/anapi/data?key=' + rescuetimeKey + '&format=json&restrict_kind=overview', (res) => {
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
                        hours = minutes/60;
                        break;
                    };
                };
                minutes = Math.round((hours-parseInt(hours)) * 60);
                rescuetimeData.minutes = ("0" + minutes).slice(-2);
                rescuetimeData.hours = parseInt(hours);
            } catch (e) {
                reject({error: 'Rescuetime Web Time Data API error.'})
            }
            resolve(rescuetimeData);
        });
    }).on('error', (e) => {
        reject({error: 'Rescuetime Web Time Data API error.'})
    });
})

const getRescuetimeDistractedData = new Promise((resolve, reject) => {
    let rescuetimeData = {};
    https.get('https://www.rescuetime.com/anapi/data?key=' + rescuetimeKey + '&format=json&restrict_kind=productivity', (res) => {
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
                reject({error: 'Rescuetime Distracted Time Data API error.'})
            }
            resolve(rescuetimeData);
        });
    }).on('error', (e) => {
        reject({error: 'Rescuetime Distracted Time Data API error.'})
    });  
})

async function getRescuetimeData() {
    try {
        let rescuetimeData = {};
        const rescuetimeWebData = await getRescuetimeWebData;
        const rescuetimeDistractedData = await getRescuetimeDistractedData;
        rescuetimeData.webMinutes = rescuetimeWebData.minutes;
        rescuetimeData.webHours = rescuetimeWebData.hours;
        rescuetimeData.distractedMinutes = rescuetimeDistractedData.minutes;
        rescuetimeData.distractedHours = rescuetimeDistractedData.hours;
        return rescuetimeData    
    } catch (error) {
        throw error
    }
}

const getStravaData = new Promise((resolve, reject) => {
    let stravaData = {};
    https.get('https://www.strava.com/api/v3/athlete/activities?access_token=' + stravaToken, (res) => {
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
                reject({error: 'Strava API call error.'})
            }
            resolve(stravaData);
        });
    }).on('error', (e) => {
        reject({error: 'Strava API call error.'})
    });
})

const getMediumData = new Promise((resolve, reject) => {
    let mediumData = {};
    https.get( {
        host: 'medium.com',
        path: '/@robertcooper_rc/latest',
        headers: {
            Accept: 'application/json'
        }
    }, (res) => {
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
                    mediumData['url' + i] = 'https://medium.com/@robertcooper_18384/' + post['uniqueSlug'];
                    mediumData['claps' + i] = post['virtuals']['totalClapCount'];
                }
            } catch (e) {
                reject({error: 'Medium API call error.'})
            }
            resolve(mediumData);
        });
    }).on('error', (e) => {
        reject({error: 'Medium API call error.'})
    });  
})

module.exports = {
  getMediumData: getMediumData,
  getStravaData: getStravaData,
  getRescuetimeData: getRescuetimeData,
  getGithubData: getGithubData
}
