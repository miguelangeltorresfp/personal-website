$(document).ready(() => {
    $.get("/mediumData", result => {
        for (let i = 1; i <= 3; i++) {
            let postId = "#post" + i;
            let title = "title" + i;
            let excerpt = "excerpt" + i;
            let url = "url" + i;
            let claps = "claps" + i;

            $(postId + " .post__title-link").attr("href", result[url]);
            $(postId + " .post__title").text(result[title]);
            $(postId + " .post__excerpt").text(result[excerpt]);
            $(postId + " .post__button").attr("href", result[url]);
            $(postId + " .post__claps").text("👏 " + result[claps] + " 👏")
        }
        $(".blog .api__loader").fadeOut(500, () => {
            $(".blog__posts").fadeIn(500)
        })
    });
    $.get("/githubData", result => {
        if (result.error) {
            $("#github .api__loader").fadeOut(500, () => {
                $("#github .api").append("<p class='api__error'></p>");
                $("#github .api__error").text("Github API Error 😢").fadeIn(500)
            })
        } else {
            $("#github .api__data").text(result.commits);
            $("#github .api__loader").fadeOut(500, () => {
                $("#github .api > *:not(.api__loader)").fadeIn(500)
            })
        }
    });
    $.get("/stravaData", result => {
        if (result.error) {
            $("#strava .api__loader").fadeOut(500, () => {
                $("#strava .api").append("<p class='api__error'></p>");
                $("#strava .api__error").text("Strava API Error 😢").fadeIn(500)
            })
        } else {
            $(".running-date .api__data").text(result.date);
            $(".running-distance .api__data").text(result.distance);
            $(".running-duration .api__data").text(result.duration);
            $("#strava .api__loader").fadeOut(500, () => {
                $("#strava .api > *:not(.api__loader)").fadeIn(500)
            })
        }
    });
    $.get("/goodreadsData", result => {
        if (result.error) {
            $("#goodreads .api__loader").fadeOut(500, () => {
                $("#goodreads .api").append("<p class='api__error'></p>");
                $("#goodreads .api__error").text("Goodreads API Error 😢").fadeIn(500)
            })
        } else {
            result.forEach( function(bookTitle) {
                // Create a child element: span.api__data.api__data--books
                $("#goodreads .api__data-container")
                    .append("<li class='api__data  api__data--book'>" + bookTitle + "</li>");
                $("#goodreads .api__loader").fadeOut(500, () => {
                    $("#goodreads .api > *:not(.api__loader)").fadeIn(500)
                })
            });
        }
        
    })
});

$("a.button.screenshots").click(e => {
    e.preventDefault();
    $(e.target)
        .parent()
        .parent()
        .siblings(".carousel-wrapper")
        .css("display", "flex")
});

$(".carousel-wrapper").click(e => {
    if ($(e.target).hasClass("carousel-wrapper")) $(e.target).hide()
});

$(".carousel").carousel({
    interval: false,
});
