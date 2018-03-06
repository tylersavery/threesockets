import BaseScene from './BaseScene'
import * as Utils from '../../../common/scripts/utils'
import * as ClientUtils from '../utils';
import { Player } from '../../../common/models/Player'

class MainScene extends BaseScene {
  constructor () {
  
    var baseOptions = {
      useOrbitalControls: true
    }
    super(baseOptions)
    let self = this;

    self.animate()

    let useCookies = true;
    let cookieSet = ClientUtils.getCookie('playerIdentifier') ? true : false;

    if(cookieSet && useCookies){

      let playerIdentifier = ClientUtils.getCookie('playerIdentifier');
      self._socket.emit('player-returned', { 'identifier': playerIdentifier } );
   
    } else {

      let playerName = self.getPlayerName();
      let playerColor = self.getPlayerColor();
      let playerIdentifier = Utils.randomString(8);
    
      ClientUtils.setCookie('playerIdentifier', playerIdentifier);

      self._socket.emit('player-new', { 'identifier': playerIdentifier,'color': playerColor, 'name': playerName });

    }

    //socket events

    self._socket.on('player-init', function ( data ) {

      console.log("player-init")
      console.log(data)

      self._player = new Player(data.name, data.color, data.identifier)
      self._socket.emit('ready')

    });

    self._socket.on('environment', function ( data ) {
      
      var sprites = data.sprites;

      console.log("ENVIRONMENT SPRITES");
      console.log(sprites);

      for(var i=0; i<sprites.length; i++){
        
        var spriteData = sprites[i];
        let sprite = null;

        let geometry = new THREE.BoxGeometry(spriteData.scale.x, spriteData.scale.y, spriteData.scale.z);

        let material = null;
        if(spriteData.texture) {

          var texture = new THREE.TextureLoader().load( spriteData.texture );
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( 4, 4 );

          material = new THREE.MeshBasicMaterial({
            map: texture
          });

        } else {
          material = new THREE.MeshBasicMaterial({
            color: spriteData.color
          });
        }
        
        sprite = new THREE.Mesh(geometry, material);
        self._scene.add(sprite);
        self._environmentSprites[spriteData.identifier] = sprite;

        sprite.position.x = spriteData.position.x;
        sprite.position.y = spriteData.position.y;
        sprite.position.z = spriteData.position.z;
        sprite.rotation.x = spriteData.rotation.x;
        sprite.rotation.y = spriteData.rotation.y;
        sprite.rotation.z = spriteData.rotation.z;

        console.log("ENV Sprite:")
        console.log(sprite);

      }

      let lights = []

      lights[0] = new THREE.PointLight( 0xff0000, 1, 100 );
      lights[1] = new THREE.PointLight( 0xff0000, 1, 100 );
      lights[2] = new THREE.PointLight( 0xff0000, 1, 100 );

      lights[0].position.set( 0, 200, 0 );
			lights[1].position.set( 100, 200, 100 );
      lights[2].position.set( - 100, - 200, - 100 );
      
      self._scene.add( lights[0] );
      self._scene.add( lights[1] );
      self._scene.add( lights[2] );

    })

    self._socket.on('update', function ( data ) {

      var sprites = data.sprites;

      for(var i=0; i<sprites.length; i++) {

        var spriteData = sprites[i];

        if(spriteData.type == 'player') {
          
          let sprite = null;

          if(spriteData.identifier && self._sprites[spriteData.identifier]) {
            
            sprite = self._sprites[spriteData.identifier];
          
          } else {

            let geometry = new THREE.BoxGeometry(spriteData.scale.x, spriteData.scale.y, spriteData.scale.z);
            let material = new THREE.MeshBasicMaterial({
              color: spriteData.color
            });
          
            sprite = new THREE.Mesh(geometry, material);
            self._scene.add(sprite);
            self._sprites[spriteData.identifier] = sprite;

            console.log(self._sprites)

          }
          
          sprite.position.x = spriteData.position.x;
          sprite.position.y = spriteData.position.y;
          sprite.position.z = spriteData.position.z;
          sprite.rotation.x = spriteData.rotation.x;
          sprite.rotation.y = spriteData.rotation.y;
          sprite.rotation.z = spriteData.rotation.z;

        }
      }
    })
  }
  
  render() {
    super.render();
  }

  update () {

    super.update();

    this._keyboard.update();

    var moveDistance = 50 * this._clock.getDelta(); 
    var rotateDegrees = 1;
    var rotateRadians = Utils.degreesToRadians(rotateDegrees);

    var positionUpdated = false;
    var rotationUpdated = false;

    if(this._keyboard.pressed("left")){
      this._sprites['player-sprite-' + this._player.identifier ].translateX(-moveDistance);
      positionUpdated = true
    }
    if(this._keyboard.pressed("right")){
      this._sprites['player-sprite-' + this._player.identifier ].translateX(moveDistance);
      positionUpdated = true
    }
    if(this._keyboard.pressed("up")){
      this._sprites['player-sprite-' + this._player.identifier ].translateY(moveDistance);
      positionUpdated = true
    }
    if(this._keyboard.pressed("down")){
      this._sprites['player-sprite-' + this._player.identifier ].translateY(-moveDistance);
      positionUpdated = true
    }
    if(this._keyboard.pressed("w")){
      this._sprites['player-sprite-' + this._player.identifier ].rotateX(-rotateRadians)
      rotationUpdated = true;      
    }
    if(this._keyboard.pressed("s")){
      this._sprites['player-sprite-' + this._player.identifier ].rotateX(rotateRadians)
      rotationUpdated = true;      
    }
    if(this._keyboard.pressed("a")){
      this._sprites['player-sprite-' + this._player.identifier ].rotateY(-rotateRadians)
      rotationUpdated = true;      
    }
    if(this._keyboard.pressed("d")){
      this._sprites['player-sprite-' + this._player.identifier ].rotateY(rotateRadians)
      rotationUpdated = true;      
    }

    if( positionUpdated || rotationUpdated ) {
      this._socket.emit('update-sprite', { 
        identifier: 'player-sprite-' + this._player.identifier,
        position: {x: this._sprites['player-sprite-' + this._player.identifier ].position.x, y: this._sprites['player-sprite-' + this._player.identifier ].position.y, z: this._sprites['player-sprite-' + this._player.identifier ].position.z}, 
        rotation: {x: this._sprites['player-sprite-' + this._player.identifier ].rotation.x, y: this._sprites['player-sprite-' + this._player.identifier ].rotation.y, z: this._sprites['player-sprite-' + this._player.identifier ].rotation.z}, 
      });
    }
    
  }  
}

export default MainScene