$(document).ready( () => {
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
      let claps = 'claps' + i;

      $(postId + ' .post__title-link').attr('href', result[url])
      $(postId + ' .post__title').text(result[title])
      $(postId + ' .post__excerpt').text(result[excerpt])
      $(postId + ' .post__button').attr('href', result[url])
      $(postId + ' .post__claps').text('👏 ' + result[claps] + ' 👏')
    }
    $('#blog .loader').fadeOut(500, () => {
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

// .carousel-wrapper to display: flex; on click of screenshots button
$('a.button.screenshots').click( (e) => {
  e.preventDefault();
  $(e.target).parent().parent().siblings('.carousel-wrapper').css('display', 'flex');
});

$('.carousel-wrapper').click( (e) => {
  if ($(e.target).hasClass('carousel-wrapper'))
    $(e.target).hide();
})

$('.carousel').carousel({
  interval: false
})
