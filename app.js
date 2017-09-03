const express = require('express');
const app = express();
const router = express.Router();
const getApiData = require('./getApiData');

app.use('/documents', express.static('public/documents'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));
app.use('/public', express.static('public'));

app.set('views');
app.set('view engine', 'pug');

app.use(router);

router.get('/apiData', (request, response) => {
  let apiResult = {};
  getApiData( (apiData) => {
    apiResult.stravaDate = apiData.stravaDate;
    apiResult.stravaDuration = apiData.stravaDuration;
    apiResult.stravaDistance = apiData.stravaDistance;
    apiResult.rescuetimeWebHours = apiData.rescuetimeWebHours;
    apiResult.rescuetimeWebMinutes = apiData.rescuetimeWebMinutes;
    apiResult.rescuetimeDistractedHours = apiData.rescuetimeDistractedHours;
    apiResult.rescuetimeDistractedMinutes = apiData.rescuetimeDistractedMinutes;
    apiResult.mediumTitle1 = apiData.mediumTitle1;
    apiResult.mediumExcerpt1 = apiData.mediumExcerpt1;
    apiResult.mediumUrl1 = apiData.mediumUrl1;
    apiResult.mediumTitle2 = apiData.mediumTitle2;
    apiResult.mediumExcerpt2 = apiData.mediumExcerpt2;
    apiResult.mediumUrl2 = apiData.mediumUrl2;
    apiResult.mediumTitle3 = apiData.mediumTitle3;
    apiResult.mediumExcerpt3 = apiData.mediumExcerpt3;
    apiResult.mediumUrl3 = apiData.mediumUrl3;
    response.send(apiData);
  });
});

// Make sure all URLs use www.
router.all(/.*/, function(req, res, next) {
  var host = req.header("host");
  if (host.match(/^www\..*/i)) {
    next();
  } else {
    res.redirect(301, "http://www." + host);
  }
});

router.get('/', (req, res) => {
  getApiData( (apiData) => {
    res.render('index');
  });
});

// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });
//
// app.use( (err, req, res, next) => {
//   res.status(err.status);
//   console.error(err.stack);
//   res.send(err.stack);
// });

app.listen(8080, () => {
  console.log("The application is running on localhost:8080!");
});
