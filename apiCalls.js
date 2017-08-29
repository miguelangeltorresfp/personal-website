const express = require('express');
const app = express();
const querystring = require('querystring');
const https = require('https');
const host = 'https://www.strava.com/api/v3/athlete/activities?access_token=6f1ce73011107949166d10ea05e522443eab24c2';
const apiKey = '6f1ce73011107949166d10ea05e522443eab24c2';

function performRequest(endpoint, method, data, success) {
  const dataString = JSON.stringify(data);
  let headers = {};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  let options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  let req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    let responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      let responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

module.exports = performRequest;

// // API Calls
//
// $.get('https://cors-anywhere.herokuapp.com/https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', function(data) {
// 		var hours = 0;
// 		for (i = 0; i < data["rows"].length; i++) {
// 			if (data["rows"][i][3] == "Software Development") {
// 				var seconds = data["rows"][i][1];
// 				var minutes = seconds/60;
// 				var hours = minutes/60;
// 				break;
// 			};
// 		};
//     minutes = Math.round((hours-parseInt(hours)) * 60);
//     minutes = ("0" + minutes).slice(-2);
//     hours = parseInt(hours);
// 		$(".web-development-hours").html("<span class='api-data'>" + hours + ":" + minutes + "</span> on web development.");
// });
//
// $.get('https://cors-anywhere.herokuapp.com/https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=productivity', function(data) {
// 	var total_hours_distracted = 0;
// 	for (i = 0; i < data["rows"].length; i++) {
// 		if (data["rows"][i][3] == -1 | data["rows"][i][3] == -2 ) {
// 			var seconds = data["rows"][i][1];
// 			var minutes = seconds/60;
// 			var hours = minutes/60;
// 			total_hours_distracted += hours;
// 		};
// 	};
//   minutes = Math.round((total_hours_distracted-parseInt(total_hours_distracted)) * 60);
//   minutes = ("0" + minutes).slice(-2);
//   hours = parseInt(total_hours_distracted);
// 	$(".distracted-hours").html("<span class='api-data'>" + hours + ":" + minutes + "</span> on social media and other non productive things.");
// });


// Medium Posts
// $.get( {
// 	url: 'https://medium.com/@@robertcooper_18384/latest',
// 	headers: {'Accept': 'application/json'},
// 	success: () => {
// 		console.log("Medium GET request successful");
// 	}
// });
