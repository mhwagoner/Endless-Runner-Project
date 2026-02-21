// P2 prefab
class P2 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        //this.scale = 0.75
        scene.add.existing(this)           // add P2 to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setSize(this.width / 4, this.height / 4, true)
        this.hurtTimer = 1000

        this.setDepth(10)

        // initialize state machine managing P2 (initial state, possible states, state args[])
        scene.P2FSM = new StateMachine('idle', {
            idle: new IdleState2(),
            hands: new HandsState2(),
            duck: new DuckState2(),
            hurt: new HurtState2(),
        }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
    }
}

// P2-specific state classes
class IdleState2 extends State {
    enter(scene, P2) {
        P2.body.setSize(P2.width / 4, P2.height / 4, true)
        P2.anims.play('idle2')
        P2.anims.stop()
    }

    execute(scene, P2) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down } = scene.keys

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

class HandsState2 extends State {
    execute(scene, P2) {
        // use destructuring to make a local copy of the keyboard object
        const { left, right, up, down } = scene.keys

        if(down.isDown){
            P2.anims.play('duck2') //move hitbox

        } else if (left.isDown && right.isDown && up.isDown){ //idle

            this.stateMachine.transition('idle')

        } else if (left.isDown && right.isDown){ //left and right

            P2.anims.play('hand-left-right2')
            P2.body.setOffset((P2.width / 2) - (P2.body.width / 2), P2.height / 2)
            P2.body.setSize(P2.width, P2.height / 4, false)
            

        } else if (left.isDown && up.isDown){ //left and up

            P2.anims.play('hand-left-up2')
            P2.body.setOffset(0, P2.height / 6)
            P2.body.setSize(P2.width * 5/8, P2.height / 2, false)

        } else if (right.isDown && up.isDown){ //right and up

            P2.anims.play('hand-right-up2')
            P2.body.setOffset(P2.width * 3/8, P2.height / 6)
            P2.body.setSize(P2.width * 5/8, P2.height / 2, false)

        } else if (left.isDown){ //left

            P2.anims.play('hand-left2')
            P2.body.setOffset(0, (P2.height / 2) - (P2.body.height / 2))
            P2.body.setSize(P2.width / 4, P2.height / 4, false)

        } else if (right.isDown){ //right

            P2.anims.play('hand-right2')
            P2.body.setOffset(P2.width - P2.body.width, (P2.height / 2) - (P2.body.height / 2))
            P2.body.setSize(P2.width / 4, P2.height / 4, false)

        } else if (up.isDown){ //up

            P2.anims.play('hand-up2')
            P2.body.setOffset((P2.width / 2) - (P2.body.width / 2), P2.height / 6)
            P2.body.setSize(P2.width / 4, P2.height / 4, false)

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

    }
}

class DuckState2 extends State {
    enter(scene, P2) {
        P2.body.enable = false;
        //P2.setTint(0x0000FF)
        P2.anims.play('duck2')
    }

    execute(scene, P2) {
        const { down } = scene.keys
        //if down isn't held, return to idle
        if(!down.isDown) {
            P2.body.enable = true;
            this.stateMachine.transition('idle')
        }
    }
}

class HurtState2 extends State {
    enter(scene, P2) {
        P2.anims.play('duck2')
        P2.anims.stop()
        P2.setTint(0xFF0000)     // turn red
        P2.body.enable = false;

        // set recovery timer
        scene.time.delayedCall(P2.hurtTimer, () => {
            P2.body.enable = true;
            P2.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}