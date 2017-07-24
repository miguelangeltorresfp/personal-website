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

$.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=overview', function(data) {

		for (i = 0; i < data["rows"].length; i++) {
			if (data["rows"][i][3] == "Software Development") {
				var seconds = data["rows"][i][1];
				var minutes = seconds/60;
				var hours = minutes/60;
				hours = hours.toFixed(2);
				console.log(hours);
				$(".web-development-hours").html("I've worked <span class='hours'>" + hours + "</span> hours on web development today.");
			};
		};
});

$.get('https://www.rescuetime.com/anapi/data?key=B63Yw5IF3RFY5pSxa4fnMnQS5adF_DFK4GWzPUOb&format=json&restrict_kind=productivity', function(data) {
	var total_hours_distracted = 0;
	for (i = 0; i < data["rows"].length; i++) {
		if (data["rows"][i][3] == -1 | data["rows"][i][3] == -2 ) {
			var seconds = data["rows"][i][1];
			var minutes = seconds/60;
			var hours = minutes/60;
			total_hours_distracted += hours;
		};
	};
	total_hours_distracted = total_hours_distracted.toFixed(2);
	console.log(total_hours_distracted);
	$(".distracted-hours").html("I've spent <span class='hours'>" + total_hours_distracted + "</span> hours on social media and other non productive things.");
});
