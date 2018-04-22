# Personal Website
My own personal website used to showcase my portfolio and other neat things. The site is hosted on Digital Ocean and uses a Node backend.

## Local Development
To develop the application locally, first clone the repository.

```bash
git clone git@github.com:robertcoopercode/personal-website.git
```

Next, install the project dependencies using `yarn`.

Run `gulp` or `gulp dev` to watch for changes and automatically compile assets. When certain files get changed Sass will be compiled, JavaScript files will be concatenated, and the server will restart.

## Deploy to Production
When the live website needs to be updated, follow these steps:

1) Run `gulp build` in the terminal and commit/push changes to Github in order to have the most up to date files for deployment.

2) Log in using ssh
Go into terminal and type `ssh robert@159.203.4.207`.

3) Run `git pull` to get the most recent changes from the Github repository.

4) Run `npm install` to install any new dependencies.

5) Run `pm2 restart all`.

The website should now be updated!
