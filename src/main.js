// Name: Michael Wagoner
// Game: Iguana Run
// Hours: 25
/* Creative Tilt:
    -I am proud I was able to acheive an endless runner with two player characters
    and two sets of controls. It can also be played by one player controlling both
    characters, givving many different combinations of states between the two.
    
    -One specific programming feature I'm proud of is the way that the characters
    bob up and down according to a sign wave. I also got better at setting the
    depth of sprites to fake the 3D look.

    -The unique gimmick of my game is its perspective. Rather than "running"
    yourself, the characters run away from the camera and you only move their arms,
    something that no other endless runner I've played has done.
*/

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
    scene: [ Load, Title, Win, Play ]
}

const game = new Phaser.Game(config)

let { width, height } = game.config