$(document).ready( () => {
  $.get('/healthData', (result) => {
    $('#health #heart-rate.api-data').text(result.heartRate);
    $('#health #steps.api-data').text(result.steps);
    $('#health #sleep.api-data').text(result.hoursSlept);
    $('#health .loader').fadeOut(500, () => {
      $('#health .api-data-section > *:not(.loader)').fadeIn(500);
    });
  });
  $.get('/githubData', (result) => {
    $('#github .api-data').text(result.commits);
    $('#github .loader').fadeOut(500, () => {
      $('#github .api-data-section > *:not(.loader)').fadeIn(500);
    });
  });
  $.get('/mediumData', (result) => {
    for (let i=1; i <= 3; i++) {
      let postId = '#post' + i;
      let title = 'title' + i;
      let excerpt = 'excerpt' + i;
      let url = 'url' + i;
      let $postDiv = $('<div>')
                      .addClass('post')
                      .attr('id', postId);
      let $title = $('<a>')
                    .attr('href', result[url])
                    .append($('<h3>').text(result[title]));
      let $excerpt = $('<p>')
                      .text(result[excerpt]);
      let $url = $('<a>')
                .text('Read More')
                .attr('href', result[url])
                .attr('target', '_blank')
                .addClass('button');
      $postDiv.append($title, $excerpt, $url);
      $('#blog-posts').append($postDiv);
    }
    $('.blog .loader').fadeOut(500, () => {
      $('#blog-posts').fadeIn(500);
    });
  });
  $.get('/stravaData', (result) => {
    $('.running-date .api-data').text(result.date);
    $('.running-distance .api-data').text(result.distance);
    $('.running-duration .api-data').text(result.duration);
    $('#strava .loader').fadeOut(500, () => {
      $('#strava .api-data-section > *:not(.loader)').fadeIn(500);
    });
  });
  $.get( '/rescuetimeData', (result) => {
    $('.web-development-hours .api-data').text(result.webHours + ':' + result.webMinutes);
    $('.distracted-hours .api-data').text(result.distractedHours + ':' + result.distractedMinutes);
    $('#rescuetime .loader').fadeOut(500, () => {
      $('#rescuetime .api-data-section > *:not(.loader)').fadeIn(500);
    });
  });

});
