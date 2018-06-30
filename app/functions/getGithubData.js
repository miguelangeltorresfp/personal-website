require('dotenv').config();

const statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const https = require("https");
const moment = require("moment-timezone");
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

exports.handler = function (event, context, callback) {
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

    getGithubData()
        .then(githubData => {
            callback(null, {statusCode, headers, body: JSON.stringify(githubData)})
        })
        .catch(error => {
            return;
        })
};