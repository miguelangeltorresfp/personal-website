const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

$(document).ready(() => {
  $.get("/.netlify/functions/getMediumData", result => {
    result = JSON.parse(result);
    for (let i = 1; i <= 6; i++) {
      let postId = "#post" + i;
      let title = "title" + i;
      let excerpt = "excerpt" + i;
      let url = "url" + i;
      let claps = "claps" + i;
      let readingTime = "readingTime" + i;
      let tags = "tags" + i;

      $(postId + " .post__title-link").attr("href", result[url]);
      $(postId + " .post__title").text(result[title]);
      $(postId + " .post__excerpt").text(result[excerpt]);
      $(postId + " .post__button").attr("href", result[url]);
      $(postId + " .post__reading-time").text(
        "🕘 " + result[readingTime] + " min."
      );
      $(postId + " .post__claps").text("👏 " + result[claps]);
      if (result[tags].length > 0) {
        result[tags].forEach(tag => {
          $(postId + " .post__tags").append(
            "<span class='tags__tag  post__tag'>" + tag.name + "</span>"
          );
        });
      }
    }
    $(".blog .api__loader").fadeOut(500, () => {
      $(".blog__posts")
        .fadeIn(500)
        .css("display", "flex");
    });
  });
  $.get("/.netlify/functions/getGithubData", result => {
    result = JSON.parse(result);
    result.forEach((item, index) => {
      const elementId = `contribution-${index}`;
      const $div = $("<div>");
      const $weekday = $("<span>")
        .text(WEEKDAYS[index])
        .addClass("github-contributions__weekday");
      const [y, m, d] = item.date.split("-");
      let date = dateFns.format(new Date(y, m - 1, d), "MMMM Do");
      let contributionText;
      if (item.count > 1) {
        contributionText = `${item.count} countributions`;
      } else {
        contributionText = `${item.count} countribution`;
      }
      const $square = $("<span>")
        .attr("data-intensity", item.intensity)
        .addClass(
          `contribution-square contribution-square--intensity-${item.intensity}`
        )
        .attr("title", `${contributionText}${date}`)
        .attr("id", elementId);
      $div.append($weekday);
      $div.append($square);
      $(".github-contributions").append($div);

      // Tooltip template
      const tooltipTemplate = document.createElement("div");
      tooltipTemplate.innerHTML = `<p class="github-contributions__tooltip">${contributionText}<span class="github-contributions__tooltip-date"> on ${date}</span></p>`;

      tippy(`#${elementId}`, {
        arrow: true,
        arrowType: "round",
        placement: "bottom",
        animation: "scale",
        size: "small",
        duration: [200, 100],
        html: tooltipTemplate
      });
    });

    const todaysContributions = result.find(item => item.today);
    $("#github .api__data").text(todaysContributions.count);
    $("#github .api__loader").fadeOut(500, () => {
      $("#github .api > *:not(.api__loader)").fadeIn(500);
      $(".github-contributions").css("display", "flex");
    });
  }).fail(function() {
    $("#github .api__loader").fadeOut(500, () => {
      $("#github .api").append("<p class='api__error'></p>");
      $("#github .api__error")
        .text("API Error 😢")
        .fadeIn(500);
    });
  });
  $.get("/.netlify/functions/getStravaData", result => {
    result = JSON.parse(result);
    $(".running-date .api__data").text(result.date);
    $(".running-distance .api__data").text(result.distance);
    $(".running-duration .api__data").text(result.duration);
    $("#strava .api__loader").fadeOut(500, () => {
      $("#strava .api > *:not(.api__loader)").fadeIn(500);
    });
  }).fail(function() {
    $("#strava .api__loader").fadeOut(500, () => {
      $("#strava .api").append("<p class='api__error'></p>");
      $("#strava .api__error")
        .text("Strava API Error 😢")
        .fadeIn(500);
    });
  });
  $.get("/.netlify/functions/getGoodreadsData", result => {
    result = JSON.parse(result);
    let bookTitle = result[0];
    // Create a child element: span.api__data.api__data--books
    $("#goodreads .api__data").text(bookTitle);
    $("#goodreads .api__loader").fadeOut(500, () => {
      $("#goodreads .api > *:not(.api__loader)").fadeIn(500);
    });
  }).fail(function() {
    $("#goodreads .api__loader").fadeOut(500, () => {
      $("#goodreads .api").append("<p class='api__error'></p>");
      $("#goodreads .api__error")
        .text("Goodreads API Error 😢")
        .fadeIn(500);
    });
  });
  $.get("/.netlify/functions/getTwitterData", result => {
    const text = JSON.parse(result);
    const linkifiedText = replaceURLWithHTMLLinks(text);
    $("#twitter .api__data").html(linkifiedText);
    $("#twitter .api__loader").fadeOut(500, () => {
      $("#twitter .api > *:not(.api__loader)").fadeIn(500);
    });
  }).fail(function() {
    $("#twitter .api__loader").fadeOut(500, () => {
      $("#twitter .api").append("<p class='api__error'></p>");
      $("#twitter .api__error")
        .text("Twitter API Error 😢")
        .fadeIn(500);
    });
  });
});

// Add focusable class on keyboard events to properly style outlines
const body = document.querySelector("body");

document.addEventListener("keyup", e => {
  if (e.keyCode === 9 && body.contains(e.target)) {
    body.classList.add("focusable");
  } else {
    body.classList.remove("focusable");
  }
});
document.addEventListener("mousedown", e => {
  if (body.contains(e.target)) {
    body.classList.remove("focusable");
  }
});

function replaceURLWithHTMLLinks(text) {
  const exp = /(\b(http|ftp|https):\/\/([\w-]+\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?)/gi;
  return text.replace(exp, "<a href='$1' target='_blank'>[link]</a>");
}
