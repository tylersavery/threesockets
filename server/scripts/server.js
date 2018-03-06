"use strict";

//dependencies
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const mongoose = require('mongoose');

//models
var World = require('./models/World.js').World;
var Player = require('../../common/models/Player.js').Player;
var Sprite = require('./models/Sprite.js').Sprite;

//config
const env = process.env.NODE_ENV || 'development';
const configFile = require('../../config/config.js');
const config = configFile[env];

//db
mongoose.connect(config.db);

//serve index
app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'))
});

//serve static
app.use('/dist', express.static(path.resolve(__dirname, '..', '..', 'dist')));
app.use('/static', express.static(path.resolve(__dirname, '..', '..', 'static')));


//game world
const world = new World();

let clearState = false
if(clearState) {
    world.clearState()
    process.exit()
}

world.loadState()
world.generateEnvironment()

// io
io.on('connection', function(socket) {

    console.log('a user connected');
    
    // when a new player joins
    socket.on('player-new', function ( data ) {

        console.log('player-new')
        console.log(data)

        var newPlayer = new Player(data.name, data.color, data.identifier);
        world.addPlayer(newPlayer);

        socket.emit('player-init', newPlayer.serialize())

        world.saveState()

    });

    // when a player with a cookie joins (likely returning)
    socket.on('player-returned', function ( data ) {

        console.log("player-returned")
        console.log(data)

        let player = null
        let playerPresent = world.getPlayerWithIdentifier(data.identifier)
        
        if ( playerPresent ) {
            console.log("Player is present")
            console.log(playerPresent)
            player = playerPresent
        } else {
            console.log("Player is NOT present...adding now")     
            player = new Player(data.name, data.color, data.identifier);
            world.addPlayer(player);
        }

        socket.emit('player-init', player.serialize())

        world.saveState()
        
    });

    // when player is ready
    socket.on('ready', function ( data ) {
        console.log("ready");
        socket.emit('update', world.serialize());
        socket.emit('environment', world.serializeEnvironment());
    });
    
    // when a sprite is updated
    socket.on('update-sprite', function ( data ) {
        if(data.identifier) {
            var sprite = world.getSpriteFromIdentifier(data.identifier);
            if(sprite) {
                sprite.position = data.position;
                sprite.rotation = data.rotation;
                socket.broadcast.emit('update', world.serialize());
            }
        }

        world.saveState() 
    });

    // TODO: Implement? Currently, we are saving on every action
    // when the client sends a save command
    socket.on('save-state', function ( data ) {
        world.saveState()        
    })

});

// web server 
http.listen(config.port, function(){
    console.log('listening on http://localhost:' + config.port);
});