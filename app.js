const express = require('express');
const app = express();
const router = express.Router();
const getStravaData = require('./getApiData').getStravaData;
const getMediumData = require('./getApiData').getMediumData;
const getRescuetimeData = require('./getApiData').getRescuetimeData;
const getGithubData = require('./getApiData').getGithubData;

app.use('/documents', express.static('public/documents'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/public', express.static('public'));

app.set('views');
app.set('view engine', 'pug');

app.use(router);

router.get('/stravaData', (request, response) => {
  getStravaData( (stravaData) => {
    response.send(stravaData);
  });
});

router.get('/githubData', (request, response) => {
  getGithubData( (githubData) => {
    response.send(githubData);
  });
});

router.get('/mediumData', (request, response) => {
  getMediumData( (mediumData) => {
    response.send(mediumData);
  });
});

router.get('/rescuetimeData', (request, response) => {
  getRescuetimeData( (rescuetimeData) => {
    response.send(rescuetimeData);
  });
});

// Make sure all URLs use www.
router.all(/.*/, function(req, res, next) {
  var host = req.header("host");
  if (host.match(/^www\..*/i)) {
    next();
  } else {
    res.redirect(301, "https://www." + host);
  }
});

router.get('/', (req, res) => {
  res.render('index');
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use( (err, req, res, next) => {
  res.status(err.status);
  console.error(err.stack);
  res.send(err.stack);
});

app.listen(8080, () => {
  console.log("The application is running on localhost:8080!");
});
