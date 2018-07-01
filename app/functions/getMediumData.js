require('dotenv').config();

const statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const https = require('https');

exports.handler = function (event, context, callback) {
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
                        } catch (error) {
                            return
                        }
                        callback(null, {statusCode, headers, body: JSON.stringify(mediumData)})
                    })
                },
            )
            .on("error", (error) => {
                return
            })
};