# Personal Website
My [personal website](https://www.robertcooper.me/) used to showcase my portfolio of projects, blog posts, and some other random things. The site is hosted on Digital Ocean and uses a Node backend.

## Local Development
To develop the application locally, first clone the repository.

```bash
git clone git@github.com:robertcoopercode/personal-website.git
```

Next, install the project dependencies using `yarn`.

Run `gulp` or `gulp dev` to watch for changes and automatically compile assets. When certain files get changed Sass will be compiled, JavaScript files will be concatenated, and the server will restart.

## Deploy to Production
When the live website needs to be updated, follow these steps:

1) Ensure the latest verion of the website is pushed to this repository on Github.

2) ssh into the server with `ssh robert@159.203.4.207`.

3) Run `git pull origin master` to get the most recent changes from the Github repository.

4) Run `yarn` to install any new dependencies.

5) Run `gulp build` to create the `public` folder.

6) Run `pm2 restart all` to restart the server with the newest files.

The website should now be updated! Congratulations. You did good.
