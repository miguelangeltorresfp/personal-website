const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/img', express.static('public/img'));

app.set('views');
app.set('view engine', 'pug');

app.use(router);

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
