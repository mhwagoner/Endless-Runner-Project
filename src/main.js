// Code Practice: Scrolling States
// Name:
// Date: 

'use strict'

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.WEBGL,     // for tinting
    width: 700,
    height: 350,
    pixelArt: true,
    speed: 40,
    zoom: 2,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [ Load, Play ]
}

const game = new Phaser.Game(config)

let { width, height } = game.config