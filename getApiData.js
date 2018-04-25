const https = require("https");
const apiKeys = require("./apiKeys.json");
const moment = require("moment-timezone");
const githubId = apiKeys.github.id;
const githubSecret = apiKeys.github.secret;
const stravaToken = apiKeys.strava.token;
const goodreadsKey = apiKeys.goodreads.key;



const getGoodreadsData = () => new Promise((resolve, reject) => {
    https
        .get(
            {
                host: "www.goodreads.com",
                path: `/review/list/62347534.xml?key=${goodreadsKey}&v=2&shelf=currently-reading`
            },
            res => {
                let rawData = "";
                res.on("data", chunk => {
                    rawData += chunk
                });
                res.on("end", () => {
                    try {
                        // Get all the titles of the books i'm currently reading and add them to an array
                        const parseXml = require('xml2js').parseString;
                        let currentlyReadingBooks = [];
                        parseXml(rawData, function (err, result) {
                            result.GoodreadsResponse["reviews"][0].review.forEach( (book) => {
                                currentlyReadingBooks.push(book.book[0].title[0])
                            });
                        });
                        resolve(currentlyReadingBooks)
                    } catch (e) {
                        reject({ error: "Goodreads API call fail." })
                    }
                })
            }
        )
});

getGoodreadsData;

const githubRecentRepos = new Promise((resolve, reject) => {
    https
        .get(
            {
                host: "api.github.com",
                path:
                    "/users/robertcoopercode/repos?sort=pushed&client_id=" +
                    githubId +
                    "&client_secret=" +
                    githubSecret,
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "robertcoopercode",
                },
            },
            res => {
                let rawData = "";
                res.on("data", chunk => {
                    rawData += chunk
                });
                res.on("end", () => {
                    try {
                        let recentRepos = [];
                        /**
                         * @param {Object} repositories - List of recently used Github repositories
                         * @param {string} repositories.full_name - Full name of a repository
                         */
                        let repositories = JSON.parse(rawData);
                        for (let i = 0; i < 5; i++) {
                            recentRepos.push(repositories[i].full_name)
                        }
                        resolve(recentRepos)
                    } catch (e) {
                        reject({ error: "Github API call fail." })
                    }
                })
            },
        )
        .on("error", () => {
            reject({ error: "Github API call fail." })
        })
});

const githubCommits = repositoryName =>
    new Promise((resolve, reject) => {
        let today = moment()
            .tz("America/Toronto")
            .hour(0)
            .minute(0)
            .second(0)
            .format();
        https
            .get(
                {
                    host: "api.github.com",
                    path: `/repos/${repositoryName}/commits?since=${today}&client_id=${githubId}&client_secret=${githubSecret}`,
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        "User-Agent": "robertcoopercode",
                    },
                },
                res => {
                    let rawData = "";
                    res.on("data", chunk => {
                        rawData += chunk
                    });
                    res.on("end", () => {
                        try {
                            let commits = JSON.parse(rawData);
                            let commitCount = commits.length;
                            if (commitCount === undefined) {
                                reject({ error: "Github API call fail." })
                            } else {
                                resolve(commitCount)
                            }
                        } catch (e) {
                            reject({ error: "Github API call fail." })
                        }
                    })
                },
            )
            .on("error", () => {
                reject({ error: "Github API call fail." })
            })
    });

async function getGithubData() {
    try {
        let totalCommits = 0;
        let repositories = await githubRecentRepos;
        let count = repositories.length;
        for (let i = 0; i < repositories.length; i++) {
            let repositoryName = repositories[i];
            let commits = await githubCommits(repositoryName);
            count--;
            totalCommits += commits;
            if (count === 0) {
                return {
                    commits: totalCommits,
                }
            }
        }
    } catch (error) {
        throw error
    }
}

const getStravaData = () => new Promise((resolve, reject) => {
    let stravaData = {};
    https
        .get(
            "https://www.strava.com/api/v3/athlete/activities?access_token=" +
                stravaToken,
            res => {
                res.setEncoding("utf8");
                let rawData = "";
                res.on("data", chunk => {
                    rawData += chunk
                });
                res.on("end", () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        for (let i = 0; i < parsedData.length; i++) {
                            if (parsedData[i]["type"] === "Run") {
                                let duration = new Date(null);
                                duration.setSeconds(
                                    parsedData[i]["moving_time"],
                                );
                                duration = duration.toISOString().substr(11, 8);
                                // Remove leading zeros from run duration
                                if (duration.startsWith("00:")) {
                                    duration = duration.slice(3)
                                } else if (duration.startsWith("0")) {
                                    duration = duration.slice(2)
                                }
                                let distance_meters = parsedData[i]["distance"];
                                let distance_km = distance_meters / 1000;
                                distance_km = distance_km.toFixed(2);
                                let date_string =
                                    parsedData[i]["start_date_local"];
                                let date = new Date(date_string);
                                let dateStr = date.toLocaleDateString();
                                stravaData.distance = distance_km;
                                stravaData.date = dateStr;
                                stravaData.duration = duration;
                                break
                            }
                        }
                    } catch (e) {
                        reject({ error: "Strava API call error." })
                    }
                    resolve(stravaData)
                })
            },
        )
        .on("error", () => {
            reject({ error: "Strava API call error." })
        })
});

const getMediumData = () => new Promise((resolve, reject) => {
    let mediumData = {};
    https
        .get(
            {
                host: "medium.com",
                path: "/@robertcooper_rc/latest",
                headers: {
                    Accept: "application/json",
                },
            },
            res => {
                res.setEncoding("utf8");
                let rawData = "";
                res.on("data", chunk => {
                    rawData += chunk
                });
                res.on("end", () => {
                    rawData = rawData.replace("])}while(1);</x>", "");
                    try {
                        let parsedData = JSON.parse(rawData);
                        let posts = parsedData["payload"]["references"]["Post"];
                        for (let i = 1; i <= 6; i++) {
                            let post = posts[Object.keys(posts)[i - 1]];
                            mediumData["readingTime" + i] = Math.ceil(post["virtuals"]["readingTime"]);
                            let tags = [];
                            post["virtuals"]["tags"].forEach( (tag) => {
                                tags.push(tag);
                            });
                            mediumData["tags" + i] = tags;
                            mediumData["title" + i] = post["title"];
                            mediumData["excerpt" + i] =
                                post["content"]["subtitle"];
                            mediumData["url" + i] =
                                "https://medium.com/@robertcooper_18384/" +
                                post["uniqueSlug"];
                            mediumData["claps" + i] =
                                post["virtuals"]["totalClapCount"]
                        }
                    } catch (e) {
                        reject({ error: "Medium API call error." })
                    }
                    resolve(mediumData)
                })
            },
        )
        .on("error", () => {
            reject({ error: "Medium API call error." })
        })
});

module.exports = {
    getMediumData: getMediumData,
    getStravaData: getStravaData,
    getGithubData: getGithubData,
    getGoodreadsData: getGoodreadsData
};
