// Toggle Script
(function() {
	var container = document.getElementById( 'container' ),
		trigger = container.querySelector( 'button.trigger' );

	function toggleContent() {
		if( classie.has( container, 'container-open' ) ) {
			classie.remove( container, 'container-open' );
			classie.remove( trigger, 'trigger-active' );
			window.addEventListener( 'scroll', noscroll );
		}
		else {
			classie.add( container, 'container-open' );
			classie.add( trigger, 'trigger-active' );
			window.removeEventListener( 'scroll', noscroll );
		}
	}

	function noscroll() {
		window.scrollTo( 0, 0 );
	}

	// reset scrolling position
	document.body.scrollTop = document.documentElement.scrollTop = 0;

	// disable scrolling
	window.addEventListener( 'scroll', noscroll );

	// For Demo purposes only (prevent jump on click)
	[].slice.call( document.querySelectorAll('.content-wrapper a') ).forEach( function(el) { el.onclick = function() { return false; } } );
})();

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
        $('#preload').delay(1000).fadeOut(1500);
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

// $.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', function(data) {
// 		var hours = 0;
// 		for (i = 0; i < data["rows"].length; i++) {
// 			if (data["rows"][i][3] == "Software Development") {
// 				var seconds = data["rows"][i][1];
// 				var minutes = seconds/60;
// 				var hours = minutes/60;
// 				break;
// 			};
// 		};
// 		hours = hours.toFixed(2);
// 		$(".web-development-hours").html("<span class='api-data'>" + hours + "</span> hours on web development.");
// });

// $.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=productivity', function(data) {
// 	var total_hours_distracted = 0;
// 	for (i = 0; i < data["rows"].length; i++) {
// 		if (data["rows"][i][3] == -1 | data["rows"][i][3] == -2 ) {
// 			var seconds = data["rows"][i][1];
// 			var minutes = seconds/60;
// 			var hours = minutes/60;
// 			total_hours_distracted += hours;
// 		};
// 	};
// 	total_hours_distracted = total_hours_distracted.toFixed(2);
// 	$(".distracted-hours").html("<span class='api-data'>" + total_hours_distracted + "</span> hours on social media and other non productive things.");
// });

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
