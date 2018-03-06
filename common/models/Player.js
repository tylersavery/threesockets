var Player = function ( name, color, identifier ) {

    this.name = name;
    this.color = color;
    this.identifier = identifier;

    this.sprite = null;

    this.serialize = function ( ) {
        return {
            name: this.name,
            color: this.color,
            identifier: this.identifier,
        }
    }
}

module.exports.Player = Player;