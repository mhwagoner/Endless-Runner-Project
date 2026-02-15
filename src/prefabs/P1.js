// P1 prefab
class P1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        //this.scale = 0.75
        scene.add.existing(this)           // add P1 to existing scene
        scene.physics.add.existing(this)   // add physics body to scene

        this.body.setSize(this.width / 4, this.height / 4, true)

        // set custom P1 properties
        this.dashCooldown = 300    // in ms
        this.hurtTimer = 250       // in ms

        // initialize state machine managing P1 (initial state, possible states, state args[])
        scene.P1FSM = new StateMachine('idle', {
            idle: new IdleState(),
            hands: new HandsState(),
            duck: new DuckState(),
            hurt: new HurtState(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// P1-specific state classes
class IdleState extends State {
    enter(scene, P1) {
        P1.body.setSize(P1.width / 4, P1.height / 4, true)
        P1.anims.play('idle')
        P1.anims.stop()
        //P1.setTint(0xFF0000)
    }

    execute(scene, P1) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys

        // transition to hands up if pressing a direction key
        if(left.isDown || right.isDown || up.isDown) {
            this.stateMachine.transition('hands')
            return
        }

        // duck if down key pressed
        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }
    }
}

class HandsState extends State {
    execute(scene, P1) {
        //P1.setTint(0x00FF00)
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down, space, shift } = scene.keys
        const HKey = scene.keys.HKey
        const FKey = scene.keys.FKey

        /* transition to hurt if hitting obstacle
        if(Phaser.Input.Keyboard.JustDown(space)) {
            this.stateMachine.transition('swing')
            return
        }*/

        if(down.isDown){
            P1.anims.play('duck') //move hitbox

        } else if (left.isDown && right.isDown && up.isDown){ //idle

            this.stateMachine.transition('idle')

        } else if (left.isDown && right.isDown){ //left and right

            P1.anims.play('hand-left-right')
            P1.body.setOffset((P1.width / 2) - (P1.body.width / 2), P1.height / 2)
            P1.body.setSize(P1.width, P1.height / 4, false)
            

        } else if (left.isDown && up.isDown){ //left and up

            P1.anims.play('hand-left-up')
            P1.body.setOffset(0, 0)
            P1.body.setSize(P1.width / 2, P1.height * 3/4, false)

        } else if (right.isDown && up.isDown){ //right and up

            P1.anims.play('hand-right-up')
            P1.body.setOffset(P1.width / 2, 0)
            P1.body.setSize(P1.width / 2, P1.height * 3/4, false)

        } else if (left.isDown){ //left

            P1.anims.play('hand-left')
            P1.body.setOffset(0, P1.height / 2)
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        } else if (right.isDown){ //right

            P1.anims.play('hand-right')
            P1.body.setOffset(P1.width - P1.body.width, P1.height / 2)
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        } else if (up.isDown){ //up

            P1.anims.play('hand-up')
            P1.body.setOffset((P1.width / 2) - (P1.body.width / 2), P1.height /8)
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        }

        // transition to duck if pressing down key
        if(Phaser.Input.Keyboard.JustDown(down)) {
            this.stateMachine.transition('duck')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(left.isDown || right.isDown || up.isDown || down.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

        // handle hand movement


    }
}

class DuckState extends State {
    enter(scene, P1) {
        P1.body.enable = false;
        //P1.setTint(0x0000FF)
        P1.anims.play('duck')
    }

    execute(scene, P1) {
        const { down } = scene.keys
        //if down isn't held, return to idle
        if(!down.isDown) {
            P1.body.enable = true;
            this.stateMachine.transition('idle')
        }
    }
}

class HurtState extends State {
    enter(scene, P1) {
        P1.anims.play('duck')
        P1.anims.stop()
        P1.setTint(0xFF0000)     // turn red

        // set recovery timer
        scene.time.delayedCall(P1.hurtTimer, () => {
            P1.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}