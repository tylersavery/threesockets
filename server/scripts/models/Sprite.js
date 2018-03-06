var Sprite = function(type, identifier, position, rotation, scale, color, texture) {

    this.type = type;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.color = color;
    this.identifier = identifier;
    this.texture = texture || null;
    
    this.serialize = function ( ) {
        return {
            type: this.type,
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
            color: this.color,
            identifier: this.identifier,
            texture: this.texture
        }
    }

}

module.exports.Sprite = Sprite;