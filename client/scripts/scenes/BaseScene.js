import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls'
import io from 'socket.io-client'

import * as Utils from '../../../common/scripts/utils'

class BaseScene {
  constructor (options) {

    let defaultOptions = {
      useOrbitalControls: false
    }

    this._settings = Utils.extend(defaultOptions, options);
    this._sprites = {};
    this._environmentSprites = {};
    this._player = null;

    this._clock = new THREE.Clock();

    this._camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    this._camera.position.z = 400

    this._scene = new THREE.Scene()

    this._renderer = new THREE.WebGLRenderer()
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this._renderer.domElement)

    if(this._settings.useOrbitalControls){
      this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement)
      this._controls.enableDamping = true
      this._controls.dampingFactor = 0.25
      this._controls.enableZoom = true
      this._controls.enableKeys = false
    }
    
    window.addEventListener('resize', this.onWindowResize.bind(this), false)


    this._socket = io();

    this._keyboard = new Utils.KeyboardState;

  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(window.innerWidth, window.innerHeight)
  }

  update() {
    //console.log("SUPER UPDATE");
  }

  render() {
    this._renderer.render(this._scene, this._camera)
  }

  animate() {
    requestAnimationFrame( this.animate.bind(this) );
    this.render();
    this.update();
  }

  getPlayerName() {
    let playerName = prompt("What is your name?");
    if(!playerName || playerName == ''){
      return this.getPlayerName();
    }
    return playerName;
  }

  getPlayerColor() {
    let playerColor = prompt("Choose a color.");
    if(!playerColor || playerColor == ''){
      return this.getPlayerColor();
    }
    return playerColor;
  }
  
}

export default BaseScene