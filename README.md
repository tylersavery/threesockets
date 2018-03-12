# ThreeSockets
Three Sockets is a WebGL, 3D, and Multiplayer game framework using Javascript, Socket.IO, and ThreeJS.

## Overview
 This project is a work in progress being developed over a live stream on [Twitch](https://www.twitch.tv/youngastro). The goal is to create an agnostic framework for handling multiplayer gaming in purely web technologies.

## Dependencies
* NodeJS (Using 6.9.4 but should work in newer and older versions)
* NPM (Using 3.10.10 but should work in newer and older versions)
* Everything else is installed via NPM

## Libraries Used
* NodeJS
* SocketIO
* MongoDB (not in use currently)
* ThreeJS 
* Webpack


## Installing
It should be really easy to get this up and running! 
```
$ git clone git@github.com:tsavecodes/threesockets.git
$ npm install
$ npm run build
$ npm start
```

## Deploying
You can deploy to Heroku quite easily by setting up a dyno, installing the Heroku CLI, and pushing your code there. Everything Heroku requires is in place (Procfile, package.json, etc.). 

```
$ heroku login
$ heroku git:remote -a YOUR_DYNO_NAME
$ heroku push origin master
```

## Next Steps Todo
* UI/ GUI / HUD / Prompts (can't use prompt boxes as they trigger a disconnect event)
* spawn points
* better environment
  * models
  * lighting
  * skybox
  * etc.
* player chat
* gamify
* rooms / lobbies


## Bigger Picture Todo
* player model / utils
* better getter / setter in scene (_var)
* spawn player cube
* spawn points
* populate world with other objects (not just cube)
* saving game state to mongo
* better keyboard interface?
* refactor scene / base scene
* make new scenes / states
* interface / states for menu/ui/input (not just confirm boxes) - use vue.js?
* improved config / folder structure / model loading / xmen stuff
* masterize es6 stuff / babel?
* deployment considerations
* package.json + scripts + test units

