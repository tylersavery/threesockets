"use strict";

//dependencies
var fs = require('fs');

// other models
var Sprite = require('./Sprite.js').Sprite;
var Player = require('../../../common/models/Player.js').Player;


var World = function() {

    this.players = [];
    this.sprites = [];
    this.environmentSprites = [];

    this.spawnPoints = [
        {x: 0, y:0, z:0},
        {x: 0.1, y:0, z:0},
        {x: 0.2, y:0, z:0},
        {x: 0.3, y:0, z:0},
        {x: 0.4, y:0, z:0},
        {x: 0.5, y:0, z:0},
        {x: 0.6, y:0, z:0},
    ];

    this.addPlayer = function ( player ) {

        var spawnPosition = this.getNextSpawnPoint();
        console.log("Spawn Position")
        console.log(spawnPosition)
    
        var playerSprite = new Sprite(
            'player', 
            "player-sprite-" + player.identifier, 
            spawnPosition, 
            { x: 0, y:0, z:0 }, 
            { x: 100, y:100, z:100 }, 
            player.color
        );

        player.sprite = playerSprite;

        this.addSprite(playerSprite);
        this.players.push(player);

    }


    this.getPlayerWithIdentifier = function ( identifier ) {

        console.log("getPlayerWithIdentifier()")
        console.log("identifier: " + identifier)
        console.log("****")

        for( var i=0; i<this.players.length; i++ ) {
            var player = this.players[i];
            console.log("player?:")
            console.log(player)
            
            if(player.identifier == identifier) {
                console.log("FOUND!!!")
                return player;
            }
        }

        return false;
    }

    this.addSprite = function ( sprite ) {
        this.sprites.push(sprite);
    }

    this.addEnvironmentSprite = function ( sprite ) {
        this.environmentSprites.push(sprite);
    }


    this.getSpriteFromIdentifier = function ( identifier ) {

        for(var i=0; i<this.sprites.length; i++){
            var sprite = this.sprites[i];
            if(sprite.identifier == identifier) {
                return sprite;
            }
        }

        return null;
    }

    this.getPlayerFromSocketIdentifier = function ( socketIdentifier ) {

        for(var i=0; i<this.players.length; i++){
            var player = this.players[i];
            if(player.socketIdentifier == socketIdentifier) {
                return player;
            }
        }

        return null;
    }

    this.serialize = function() {

        let serializedSprites = [];
        for(var i=0;i<this.sprites.length;i++) {
            let sprite = this.sprites[i]
            if(sprite) {
                serializedSprites.push(sprite.serialize())
            }
        } 

        let serializedPlayers = [];
        for(var i=0;i<this.players.length;i++) {
            let player = this.players[i]
            if(player) {
                serializedPlayers.push(player.serialize())
            }
        } 

        return {
            sprites: serializedSprites,
            players: serializedPlayers
        }
    }

    this.serializeEnvironment = function() {

        let serializedSprites = [];
        for(var i=0;i<this.environmentSprites.length;i++) {
            let sprite = this.environmentSprites[i]
            if(sprite) {
                serializedSprites.push(sprite.serialize())
            }
        } 

        return {
            sprites: serializedSprites,
        }
    }


    this.getNextSpawnPoint = function ( ) {
        var index = this.players.length;
        return this.spawnPoints[index];
    }

    this.saveState = function () {

        let serializedString = JSON.stringify(this.serialize());
        fs.writeFileSync("./world.json", serializedString);

    }

    this.clearState = function () {

        let serializedString = '{"sprites":[],"players":[]}';
        fs.writeFileSync("./world.json", serializedString);

        this.players = []
        this.sprites = []

    }

    this.loadState = function () {

        var data = JSON.parse(fs.readFileSync('./world.json', 'utf8'));

        console.log("loading data")
        console.log(data)

        this.players = []
        this.sprites = []

        for(var i=0;i<data.sprites.length;i++) {
            var s = data.sprites[i]
            var sprite = new Sprite(s.type, s.identifier, s.position, s.rotation, s.scale, s.color)
            this.sprites.push(sprite)
        }

        for(var i=0;i<data.players.length;i++) {
            var p = data.players[i];
            var player = new Player(p.name, p.color, p.identifier)
            this.players.push(player)
        }

        console.log("SPRITE 0")
        console.log(this.sprites)

    }

    this.generateEnvironment = function ( ) {

        var floor = new Sprite(
            'cube', 
            'floor', 
            {x: 0, y: -50, z: 0},
            {x: 0, y: 0, z: 0},
            {x: 500, y: 5, z: 500},
            'gray',
            '/static/textures/floor.jpg'
        );

        this.addEnvironmentSprite(floor)

    }
    

}

module.exports.World = World;