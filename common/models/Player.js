var Player = function ( name, color, identifier, socketIdentifier ) {

    this.name = name;
    this.color = color;
    this.identifier = identifier;
    this.socketIdentifier = socketIdentifier;

    this.sprite = null;

    this.serialize = function ( ) {

        var serializedSprite = null;
        if(this.sprite) {
            serializedSprite = this.sprite.serialize()
        }

        return {
            name: this.name,
            color: this.color,
            identifier: this.identifier,
            socketIdentifier: this.socketIdentifier,
            sprite: serializedSprite
        }
    }
}

module.exports.Player = Player;