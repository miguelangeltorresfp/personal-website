// screen loader
$(window).load(function() {
    "use strict";
    $('.screen-loader').fadeOut('slow');
});

// niceScroll
$(document).ready(function() {
    "use strict";
    $("body").niceScroll({
        cursorcolor: "#fff",
        cursorwidth: "5px",
        cursorborder: "1px solid #fff",
        cursorborderradius: "0px",
        zindex: "9999",
        scrollspeed: "60",
        mousescrollstep: "40"
    });
});

// niceScroll || scrollbars resize
$("body").getNiceScroll().resize();

// API Calls

$.get('https://cors-anywhere.herokuapp.com/https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', function(data) {
		var hours = 0;
		for (i = 0; i < data["rows"].length; i++) {
			if (data["rows"][i][3] == "Software Development") {
				var seconds = data["rows"][i][1];
				var minutes = seconds/60;
				var hours = minutes/60;
				break;
			};
		};
    minutes = Math.round((hours-parseInt(hours)) * 60);
    minutes = ("0" + minutes).slice(-2);
    hours = parseInt(hours);
		$(".web-development-hours").html("<span class='api-data'>" + hours + ":" + minutes + "</span> on web development.");
});

$.get('https://cors-anywhere.herokuapp.com/https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=productivity', function(data) {
	var total_hours_distracted = 0;
	for (i = 0; i < data["rows"].length; i++) {
		if (data["rows"][i][3] == -1 | data["rows"][i][3] == -2 ) {
			var seconds = data["rows"][i][1];
			var minutes = seconds/60;
			var hours = minutes/60;
			total_hours_distracted += hours;
		};
	};
  minutes = Math.round((total_hours_distracted-parseInt(total_hours_distracted)) * 60);
  minutes = ("0" + minutes).slice(-2);
  hours = parseInt(total_hours_distracted);
	$(".distracted-hours").html("<span class='api-data'>" + hours + ":" + minutes + "</span> on social media and other non productive things.");
});

$.get('https://www.strava.com/api/v3/athlete/activities?access_token=6f1ce73011107949166d10ea05e522443eab24c2', function(data) {
	for (i=0; i < data.length; i++) {
		if (data[i]["type"] == "Run") {
			var duration = new Date(null);
			duration.setSeconds(data[i]["moving_time"]);
			duration = duration.toISOString().substr(11, 8);
      // Remove leading zeros from run duration
      if (duration.startsWith("00:")) {
        duration = duration.slice(3);
      } else if (duration.startsWith("0")) {
        duration = duration.slice(2);
      }
			var distance_meters = data[i]["distance"];
			var distance_km = distance_meters/1000;
			distance_km = distance_km.toFixed(2);
			var date_string = data[i]["start_date_local"];
			var date = new Date(date_string);
			var dateStr = date.toLocaleDateString();
			$(".running-date").html("<span class='api-data'>" + dateStr + "</span> is the date of my last run.");
			$(".running-distance").html("<span class='api-data'>" + distance_km + "</span>km ran.");
			$(".running-duration").html("<span class='api-data'>" + duration + "</span> in duration.");
			break;
		}
	}
});
