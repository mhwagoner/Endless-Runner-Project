class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.road = this.add.image(0, config.height / 5, 'road').setOrigin(0)
        this.graphicsSet = this.add.graphics({
            x: 0,
            y: 0,

            fillStyle: {
                color: 0x87CEEB,
                alpha: 1
            },

            add: true
        })
        this.skyHeight = config.height / 5
        this.sky = this.graphicsSet.fillRect(0, 0, config.width, this.skyHeight)

        //add music
        this.bgm = this.sound.add('bgm', { 
            loop: true, volume: 0.5 
        })
        this.bgm.play()

        //add players
        this.p2 = new P2(this, config.width - 200, config.height-100, 'player2', 0)
        this.p1 = new P1(this, 200, config.height-100, 'player1', 0)
        //can switch order of these lines later
        
        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keys.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keys.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keys.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-Q', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
        this.physics.world.drawDebug = false

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>Endless Runner:</strong> Miguel: Move arms with WASD | Carlos: Move arms with arrow keys | Q: debug (toggle)'
        
        //variables
        this.score = 0
        this.stripeTimerLength = 1800
        this.stripeTimer = this.stripeTimerLength

        //for player bobbing effect
        this.gaitCounter = 0
        this.gaitMax = 359
        
        this.pickupTimerLength = 2000
        this.pickupTimer = 3000

        this.pickups = this.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true,
        })

        this.stripes = this.add.group({
            classType: Phaser.Physics.Sprite,
            active: true,
            maxSize: -1
        })


        //Player 1 collects pickups
        this.p1PickupOverlap = this.physics.add.overlap(this.p1, this.pickups, (p1, pickup) => {
            this.PickupPickup(p1, pickup)
        }, (p1, pickup) => {
            //if player is holding the right direction AND pickup.collectible
            return (!this.keys.SKey.isDown && pickup.unavoidable || (pickup.collectible && ((pickup.position === "left" && this.keys.AKey.isDown) || (pickup.position === "right" && this.keys.DKey.isDown) || (pickup.position === "top" && this.keys.WKey.isDown))))
        })

        //Player 2 collects pickups
        this.p2PickupOverlap = this.physics.add.overlap(this.p2, this.pickups, (p2, pickup) => {
            this.PickupPickup(p2, pickup)
        }, (p2, pickup) => {
            //if player is holding the right direction AND pickup.collectible
            return (!this.keys.down.isDown && pickup.unavoidable || (pickup.collectible && ((pickup.position === "left" && this.keys.left.isDown) || (pickup.position === "right" && this.keys.right.isDown) || (pickup.position === "top" && this.keys.up.isDown))))
        })

        // display score
        this.scoreConfig = {
            fontFamily: 'Lucida Console',
            fontSize: '28px',
            backgroundColor: '#eb9a0e',
            color: '#1be0f1',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            }
            //fixedWidth: 60
        }
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, this.scoreConfig)

    }

    update() {
        if(this.score >= 30) {
            this.scene.start('winScene')
        }
        // make sure we step (ie update) the player's state machine
        this.P1FSM.step()
        this.P2FSM.step()

        //game speed increase
        if(config.speed < 100) {
            config.speed += 0.1
            //console.log(config.speed)
        }

        //player bobbing
        this.p1.y = Math.sin(this.gaitCounter/3)*5 + config.height -90
        this.p2.y = Math.sin(1+this.gaitCounter/3)*5 + config.height -90

        //reset player bobbing timer
        if(this.gaitCounter <= this.gaitMax){
            this.gaitCounter++
        } else {
            this.gaitCounter = 0
        }

        //spawn obstacles and pickups
        this.pickupTimer -= this.game.loop.delta
        if (this.pickupTimer <= 0) {
            this.ObjectSpawner()
            if (this.pickupTimerLength > 500) { //timer shouldn't become faster than 500ms
                this.pickupTimerLength -= 50
            }
            this.pickupTimer = this.pickupTimerLength
        }

        //spawn stripes
        this.stripeTimer -= this.game.loop.delta
        if (this.stripeTimer <= 0) {
            this.StripeSpawner()
            this.stripeTimer = this.stripeTimerLength - (config.speed*20) + 800
        }

        //stripe child updates
        //this.stripes.scaleXY(0.0005*(config.speed/40))
        this.stripes.children.iterate((stripe) => {
            if(stripe.y > config.height) {
                //this.stripes.remove(this.stripes.stripe[0], true, true) //not working!!!
            }
            stripe.scaleX = stripe.y / 1000
            stripe.scaleY = stripe.y / 1000
            this.stripe.setVelocityY(config.speed)
        })

    }

    ObjectSpawner() {
        //console.log("object spawned")
        switch (Phaser.Math.Between(0, 2)) { //what is being spawned?
            case 0:
                //spawn coin
                this.pickups.add(new Pickup(this, config.width/2, this.skyHeight, 'coin', 2))
                break
            case 1:
                //spawn bomb
                this.pickups.add(new Pickup(this, config.width/2, this.skyHeight, 'bomb', -2))
                break
            case 2:
                //spawn clothesline OR coin
                if(Phaser.Math.Between(0, 4) == 0) {
                    this.pickups.add(new Clothesline(this, config.width/2, this.skyHeight, 'clothesline', -5))
                } else {
                    this.pickups.add(new Pickup(this, config.width/2, this.skyHeight, 'coin', 2))
                }
                break
        }
    }

    PickupPickup(player, pickup) {
        this.score += pickup.value
        if (pickup.value > 0) {
            this.sound.play('sfx-coin')
        } else if (player === this.p1) {
            this.P1FSM.transition('hurt')
            this.sound.play('sfx-bomb')
        } else if (player === this.p2) {
            this.P2FSM.transition('hurt')
            this.sound.play('sfx-bomb')
        }
        console.log(this.score)
        if(pickup.unavoidable && !this.keys.down.isDown) {
            this.sound.play('sfx-bonk')
            pickup.body.checkCollision.none = true
        } else {
            pickup.destroy()
        }
        this.scoreText.text = `Score: ${this.score}`
    }

    StripeSpawner(){
        this.stripe = this.physics.add.sprite(config.width/2, 0, 'stripe').setBelow(this.sky)
        //this.stripe.setVelocityY(config.speed)
        //this.stripe.scale = 0.1
        this.stripes.add(this.stripe)
    }

    StripeUpdater(stripe){    
        stripe.scaleX = stripe.y / 1000
        stripe.scaleY = stripe.y / 1000
        this.stripe.setVelocityY(config.speed)
    }
}