const proxy = require('express-http-proxy');
const express = require("express");
const app = express();
const router = express.Router();

// Allow environment variables to be access through process.env
require('dotenv').config();

// Map URLs to folders
app.use("/documents", express.static(`app/documents`));
app.use("/css", express.static(`app/css`));
app.use("/js", express.static(`app/js`));
app.use("/img", express.static(`app/img`));
app.use("/fonts", express.static(`app/fonts`));
app.use("/public", express.static(`app`));

// Proxy requests to the local lambda functions server
app.use("/.netlify/functions", proxy("http://localhost:9000"));

app.set("views");
app.set("view engine", "pug");

app.use(router);

// Make sure all URLs use www.
router.all(/.*/, function(request, response, next) {
    const host = request.get("host");
    if (host === "robertcooper.me") {
        if (host.match(/^www\..*/i)) {
            next()
        } else {
            response.redirect(301, "https://www." + host)
        }
    }
    next()
});

router.get("/", (request, response) => {
    response.render("index", { environment: process.env.NODE_ENV })
});

app.use((request, response, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((error, request, response) => {
    response.status(error.status);
    console.error(error.stack);
    response.send(error.stack);
});

app.listen(8080, () => {
    console.log("The application is running on localhost:8080!");
});
