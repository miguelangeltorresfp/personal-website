$(document).ready( () => {
    console.log("Document is ready.")
  $.get('/mediumData', (result) => {
      console.log("Fetching Medium results")
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
      console.log("Fetching Github results")
      if (result.error) {
          $('#github .api__error').text('Github API Error 😢');
          $('#github .api__loader').fadeOut(500, () => {
              $('#github .api__error').fadeIn(500);
          });
      } else {
          $('#github .api__data').text(result.commits);
          $('#github .api__loader').fadeOut(500, () => {
              $('#github .api > *:not(.api__loader)').fadeIn(500);
          });    
      }
  });
  $.get('/stravaData', (result) => {
      console.log("Fetching Strava results")
      if (result.error) {
          $('#strava .api__error').text('Strava API Error 😢');
          $('#strava .api__loader').fadeOut(500, () => {
              $('#strava .api__error').fadeIn(500);
          });
      } else {
          $('.running-date .api__data').text(result.date);
          $('.running-distance .api__data').text(result.distance);
          $('.running-duration .api__data').text(result.duration);
          $('#strava .api__loader').fadeOut(500, () => {
              $('#strava .api > *:not(.api__loader)').fadeIn(500);
          });    
      }
  });
  $.get( '/rescuetimeData', (result) => {
      console.log("Fetching RescueTime results")
      if (result.error) {
          $('#rescuetime .api__error').text('Rescue Time API Error 😢');
          $('#rescuetime .api__loader').fadeOut(500, () => {
              $('#rescuetime .api__error').fadeIn(500);
          });
      } else {
          $('.web-development-hours .api__data').text(result.webHours + ':' + result.webMinutes);
          $('.distracted-hours .api__data').text(result.distractedHours + ':' + result.distractedMinutes);
          $('#rescuetime .api__loader').fadeOut(500, () => {
              $('#rescuetime .api > *:not(.api__loader)').fadeIn(500);
          });
      }
  });
});

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
