class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.road = this.add.image(0, config.height / 5, 'road').setOrigin(0)
       // this.road.scaleX = config.width / this.road.width *1.01
        //this.road.scaleY = config.height / (this.road.height/2)
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

        // add new Hero to scene (scene, x, y, key, frame)
        this.p2 = new P1(this, config.width - 200, config.height-100, 'player2', 0)
        this.p1 = new P1(this, 200, config.height-100, 'player1', 0)
        //can switch order of these lines later
        
        // setup keyboard input
        this.keys = this.input.keyboard.createCursorKeys()
        this.keys.HKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
        this.keys.FKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // update instruction text
        document.getElementById('info').innerHTML = '<strong>CharacterFSM.js:</strong> Arrows: move | D: debug (toggle)'
        
        //variables
        this.score = 0
        this.stripeTimerLength = 1800
        this.stripeTimer = this.stripeTimerLength

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
            return (pickup.collectible && ((pickup.position === "left" && this.keys.left.isDown) || (pickup.position === "right" && this.keys.right.isDown) || (pickup.position === "top" && this.keys.up.isDown)))
        })

        //Player 2 collects pickups
        this.p2PickupOverlap = this.physics.add.overlap(this.p2, this.pickups, (p2, pickup) => {
            this.PickupPickup(p2, pickup)
        }, (p2, pickup) => {
            //if player is holding the right direction AND pickup.collectible
            return (pickup.collectible && ((pickup.position === "left" && this.keys.HKey.isDown) || (pickup.position === "right" && this.keys.FKey.isDown) || (pickup.position === "top" && this.keys.up.isDown)))
        })

        //Layer ordering
        //this.mainLayer = this.add.layer()
        //this.mainLayer.add([this.pickups, this.p1, this.p2])
        //this.mainLayer.sendToBack(this.pickups)

    }

    update() {
        //if(!this.gameOver){
        // make sure we step (ie update) the player's state machine
        this.P1FSM.step()
        this.P1FSM.step()

        //game speed increase
        if(config.speed < 100) {
            config.speed += 0.1
            //console.log(config.speed)
        }

        //player bobbing
        this.p1.y = Math.sin(this.gaitCounter/5)*5 + config.height -90

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
            if (this.pickupTimerLength > 1000) {
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
                this.stripes.remove(this.stripes.stripe[0], true, true)
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
                this.SpawnPickup(config.width/2, this.skyHeight)
                break
            case 1:
                //console.log("spike spawned")
                this.SpawnPickup(config.width/2, this.skyHeight)
                break
            case 2:
                //console.log("clothesline spawned")
                this.SpawnPickup(config.width/2, this.skyHeight)
                break
        }
    }

    SpawnPickup(x, y, value) {
        //console.log("pickup spawned")
        this.pickups.add(new Pickup(this, x, y, 'coin'))
    }

    PickupPickup(player, pickup) {
        this.score += pickup.value
        console.log(this.score)
        pickup.destroy()
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