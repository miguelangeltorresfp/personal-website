const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static('public'));
app.use('/css', express.static('/public/css'));
app.use('/js', express.static('/public/js'));
app.use('/img', express.static('/public/img'));

router.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use( (err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  console.error(err.stack);
  res.send("There is an error");
});

app.listen(8080, () => {
  console.log("The application is running on localhost:8080!");
});
