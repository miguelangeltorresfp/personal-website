const express = require("express")
const app = express()
const router = express.Router()
const getStravaData = require("./getApiData").getStravaData
const getMediumData = require("./getApiData").getMediumData
const getRescuetimeData = require("./getApiData").getRescuetimeData
const getGithubData = require("./getApiData").getGithubData

let rootStaticPath
if (process.env.NODE_ENV === "development") {
    rootStaticPath = "app"
} else {
    rootStaticPath = "public"
}
app.use("/documents", express.static(`${rootStaticPath}/documents`))
app.use("/css", express.static(`${rootStaticPath}/css`))
app.use("/js", express.static(`${rootStaticPath}/js`))
app.use("/img", express.static(`${rootStaticPath}/img`))
app.use("/fonts", express.static(`${rootStaticPath}/fonts`))
app.use("/public", express.static(`${rootStaticPath}`))

app.set("views")
app.set("view engine", "pug")

app.use(router)

// Make sure all URLs use www.
router.all(/.*/, function(request, response, next) {
    const host = request.get("host")
    if (host === "robertcooper.me") {
        if (host.match(/^www\..*/i)) {
            next()
        } else {
            response.redirect(301, "https://www." + host)
        }
    }
    next()
})

router.get("/", (request, response) => {
    response.render("index", { environment: process.env.NODE_ENV })
})

router.get("/rescuetimeData", (request, response) => {
    getRescuetimeData()
        .then(rescuetimeData => {
            response.json(rescuetimeData)
        })
        .catch(error => {
            response.send(error)
        })
})

router.get("/githubData", (request, response) => {
    getGithubData()
        .then(githubData => {
            response.json(githubData)
        })
        .catch(error => {
            response.send(error)
        })
})

router.get("/stravaData", (request, response) => {
    getStravaData
        .then(stravaData => {
            response.json(stravaData)
        })
        .catch(error => {
            response.send(error)
        })
})

router.get("/mediumData", (request, response) => {
    getMediumData
        .then(mediumData => {
            response.json(mediumData)
        })
        .catch(error => {
            response.send(error)
        })
})

app.use((request, response, next) => {
    const err = new Error("Not Found")
    err.status = 404
    next(err)
})

app.use((err, request, response) => {
    response.status(err.status)
    console.error(err.stack)
    response.send(err.stack)
})

app.listen(8080, () => {
    process.env.NODE_ENV === "development"
        ? console.log("The application is running on localhost:8080!")
        : console.log("The application is running at www.robertcooper.me!")
})
