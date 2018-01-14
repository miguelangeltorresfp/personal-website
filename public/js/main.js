$(document).ready( () => {
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
    $('.blog .api__loader').fadeOut(500, () => {
      $('.blog__posts').fadeIn(500);
    });
  });
  $.get('/githubData', (result) => {
      $('#github .api__data').text(result.commits);
      $('#github .api__loader').fadeOut(500, () => {
          $('#github .api > *:not(.api__loader)').fadeIn(500);
      });
  });
  $.get('/stravaData', (result) => {
    $('.running-date .api__data').text(result.date);
    $('.running-distance .api__data').text(result.distance);
    $('.running-duration .api__data').text(result.duration);
    $('#strava .api__loader').fadeOut(500, () => {
      $('#strava .api > *:not(.api__loader)').fadeIn(500);
    });
  });
  $.get( '/rescuetimeData', (result) => {
    $('.web-development-hours .api__data').text(result.webHours + ':' + result.webMinutes);
    $('.distracted-hours .api__data').text(result.distractedHours + ':' + result.distractedMinutes);
    $('#rescuetime .api__loader').fadeOut(500, () => {
      $('#rescuetime .api > *:not(.api__loader)').fadeIn(500);
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
