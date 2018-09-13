# Personal Website

My [personal website](https://www.robertcooper.me/) used to display blog posts, portfolio items, and some other random things. The site is hosted on Netlify and is easily updated with Netlify's continuous deployment system.

The information for the API used to display the recent github activity is found [in this repository](https://github.com/robertcoopercode/github-contributions).

## Local Development

To develop the application locally, first clone the repository.

```bash
$ git clone git@github.com:robertcoopercode/personal-website.git
```

Next, install the project dependencies using `yarn`.

Now you can run `yarn dev` to automatically watch and compile assets, start a local Express server at `localhost:8080`, and start a Lambda functions server at `localhost:9000`. The Express server is setup to proxy Lambda function requests to `localhost:9000`.

## Deploy to Production

Deploying to production is as easy as pushing local changes to Github's `master` branch on the repository 🙌.
