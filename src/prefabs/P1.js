// P1 prefab
class P1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame) // call Sprite parent class
        //this.scale = 0.75
        scene.add.existing(this)           // add P1 to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setSize(this.width / 4, this.height / 4, true)
        this.hurtTimer = 1000

        this.setDepth(10)

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
    }

    execute(scene, P1) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey

        // transition to hands up if pressing a direction key
        if(AKey.isDown || DKey.isDown || WKey.isDown) {
            this.stateMachine.transition('hands')
            return
        }

        // duck if down key pressed
        if(Phaser.Input.Keyboard.JustDown(SKey)) {
            this.stateMachine.transition('duck')
            return
        }
    }
}

class HandsState extends State {
    execute(scene, P1) {
        // use destructuring to make a local copy of the keyboard object
        const WKey = scene.keys.WKey
        const AKey = scene.keys.AKey
        const SKey = scene.keys.SKey
        const DKey = scene.keys.DKey

        if(SKey.isDown){
            P1.anims.play('duck') //move hitbox

        } else if (AKey.isDown && DKey.isDown && WKey.isDown){ //idle

            this.stateMachine.transition('idle')

        } else if (AKey.isDown && DKey.isDown){ //left and right

            P1.anims.play('hand-left-right')
            P1.body.setOffset((P1.width / 2) - (P1.body.width / 2), P1.height / 2)
            P1.body.setSize(P1.width, P1.height / 4, false)
            

        } else if (AKey.isDown && WKey.isDown){ //left and up

            P1.anims.play('hand-left-up')
            P1.body.setOffset(0, P1.height / 6)
            P1.body.setSize(P1.width * 5/8, P1.height / 2, false)

        } else if (DKey.isDown && WKey.isDown){ //right and up

            P1.anims.play('hand-right-up')
            P1.body.setOffset(P1.width * 3/8, P1.height / 6)
            P1.body.setSize(P1.width * 5/8, P1.height / 2, false)

        } else if (AKey.isDown){ //left

            P1.anims.play('hand-left')
            P1.body.setOffset(0, (P1.height / 2) - (P1.body.height / 2))
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        } else if (DKey.isDown){ //right

            P1.anims.play('hand-right')
            P1.body.setOffset(P1.width - P1.body.width, (P1.height / 2) - (P1.body.height / 2))
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        } else if (WKey.isDown){ //up

            P1.anims.play('hand-up')
            P1.body.setOffset((P1.width / 2) - (P1.body.width / 2), P1.height / 6)
            P1.body.setSize(P1.width / 4, P1.height / 4, false)

        }

        // transition to duck if pressing down key
        if(Phaser.Input.Keyboard.JustDown(SKey)) {
            this.stateMachine.transition('duck')
            return
        }

        // transition to idle if not pressing movement keys
        if(!(AKey.isDown || DKey.isDown || WKey.isDown || SKey.isDown)) {
            this.stateMachine.transition('idle')
            return
        }

    }
}

class DuckState extends State {
    enter(scene, P1) {
        P1.body.enable = false;
        //P1.setTint(0x0000FF)
        P1.anims.play('duck')
    }

    execute(scene, P1) {
        //const { down } = scene.keys
        const SKey = scene.keys.SKey
        //if down isn't held, return to idle
        if(!SKey.isDown) {
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
        P1.body.enable = false;

        // set recovery timer
        scene.time.delayedCall(P1.hurtTimer, () => {
            P1.body.enable = true;
            P1.clearTint()
            this.stateMachine.transition('idle')
        })
    }
}