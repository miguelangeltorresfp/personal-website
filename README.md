# Personal Website
My own personal website used to showcase my resume and other things I so choose.

## Deploy Live Instructions
When I need to update the live website I need to follow these steps:

1) Log In using ssh
Go into terminal and type `ssh USER@IP_ADDRESS`, where USER and IP_ADDRESS are values that I should know.

2) Run `git pull origin master` to get the most recent changes from the Github repository.

3) Run `npm install` to install any new dependencies.

4) Run `pm2 restall all`.

The website should now be updated!
