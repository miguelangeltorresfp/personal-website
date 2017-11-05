# Personal Website
My own personal website used to showcase my portfolio and other neat things. The site is hosted on Digital Ocean.

## Local Development
When working on a local machine, make sure to run `gulp serve` in order to watch for changes to files. When certain files get changed Sass will be compiled, JavaScript files will be concatenated, and the server will restart.

## Deploy Live Instructions
When the live website needs to be updated, follow these steps:

1) Run `gulp` in the terminal and commit/push changes to Github in order to have the most up to date files for deployment.

2 )Log in using ssh
Go into terminal and type `ssh robert@159.203.4.207`.

3) Run `git pull origin master` to get the most recent changes from the Github repository.

4) Run `npm install` to install any new dependencies.

5) Run `pm2 restart all`.

The website should now be updated!
