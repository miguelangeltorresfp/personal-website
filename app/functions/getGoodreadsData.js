require("dotenv").config();

const statusCode = 200;
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type"
};

const https = require("https");
const goodreadsKey = process.env.GOODREADS_KEY;

exports.handler = function(event, context, callback) {
  https.get(
    {
      host: "www.goodreads.com",
      path: `/review/list/62347534.xml?key=${goodreadsKey}&v=2&shelf=currently-reading`
    },
    res => {
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          // Get all the titles of the books i'm currently reading and add them to an array
          const parseXml = require("xml2js").parseString;
          let currentlyReadingBooks = [];
          parseXml(rawData, function(err, result) {
            result.GoodreadsResponse["reviews"][0].review.forEach(book => {
              currentlyReadingBooks.push(book.book[0].title[0]);
            });
          });
          callback(null, {
            statusCode,
            headers,
            body: JSON.stringify(currentlyReadingBooks)
          });
        } catch (error) {
          return;
        }
      });
    }
  );
};
