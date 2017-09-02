# Personal Website
My own personal website used to showcase my resume and other things I so choose.

## Local Development
When working on the repository locally, make sure to run `gulp serve` in order to watch for changes to files. When certain files get changed, the server will restart, Sass will be compiled, or JavaScript files will be concatenated.

## Deploy Live Instructions
When I need to update the live website I need to follow these steps:

1) Make sure to run `gulp` in your terminal and push changes to Github in order to build up the correct files for deployment.

2 )Log In using ssh
Go into terminal and type `ssh robert@159.203.4.207`.

3) Run `git pull origin master` to get the most recent changes from the Github repository.

4) Run `npm install` to install any new dependencies.

5) Run `pm2 restart all`.

The website should now be updated!
