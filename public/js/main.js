$(document).ready( () => {
  console.log('Document is loaded :D');
  $.get( '/apiData', (result) => {
    $('.running-date .api-data').text(result.stravaDate);
    $('.running-distance .api-data').text(result.stravaDistance);
    $('.running-duration .api-data').text(result.stravaDuration);
    $('.web-development-hours .api-data').text(result.rescuetimeWebHours + ':' + result.rescuetimeWebMinutes);
    $('.distracted-hours .api-data').text(result.rescuetimeDistractedHours + ':' + result.rescuetimeDistractedMinutes);

    $('#first-post h3 a').text(result.mediumTitle1).attr('href', result.mediumUrl1);
    $('#first-post p:first-of-type').text(result.mediumExcerpt1);
    $('#first-post p:nth-of-type(2) a').attr('href', result.mediumUrl1);

    $('#second-post h3 a').text(result.mediumTitle2).attr('href', result.mediumUrl2);
    $('#second-post p:first-of-type').text(result.mediumExcerpt2);
    $('#second-post p:nth-of-type(2) a').attr('href', result.mediumUrl2);

    $('#third-post h3 a').text(result.mediumTitle3).attr('href', result.mediumUrl3);
    $('#third-post p:first-of-type').text(result.mediumExcerpt3);
    $('#third-post p:nth-of-type(2) a').attr('href', result.mediumUrl3);
  });
});
