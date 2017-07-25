// screen loader
$(window).load(function() {
    "use strict";
    $('.screen-loader').fadeOut('slow');
});

// preload
$(document).ready(function() {
    "use strict";
    $('#preload').css({
        display: 'table'
    });
});


// preload function
$(window).load(preLoader);
"use strict";

function preLoader() {
    setTimeout(function() {
        $('#preload').fadeOut(1500);
    });
};

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

$.get('https://www.strava.com/api/v3/athlete/activities?access_token=6f1ce73011107949166d10ea05e522443eab24c2', function(data) {
	for (i=0; i < data.length; i++) {
		if (data[i]["type"] == "Run") {
			var duration = new Date(null);
			duration.setSeconds(data[i]["moving_time"]);
			var converted_duration = duration.toISOString().substr(11, 8);
			var distance_meters = data[i]["distance"];
			var distance_km = distance_meters/1000;
			distance_km = distance_km.toFixed(2);
			var date_string = data[i]["start_date_local"];
			var date = new Date(date_string);
			var dateStr = date.toLocaleDateString();
			$(".running-date").html("<span class='api-data'>" + dateStr + "</span> is the date of my last run.");
			$(".running-distance").html("<span class='api-data'>" + distance_km + "</span>km ran.");
			$(".running-duration").html("<span class='api-data'>" + converted_duration + "</span> in duration.");
			break;
		}
	}
});
