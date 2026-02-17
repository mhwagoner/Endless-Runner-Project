class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.road = this.add.image(0, -300, 'road').setOrigin(0)
        this.road.scaleX = config.width / this.road.width *1.01
        this.road.scaleY = config.height / (this.road.height/2)
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
        this.graphicsSet.fillRect(0, 0, config.width, this.skyHeight)

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
        this.startTimer = 2000
        this.timer = this.startTimer

        this.coins = this.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true,
        });

        //Player 1 collects coins
        this.p1CoinOverlap = this.physics.add.overlap(this.p1, this.coins, (p1, coin) => {
            this.PickupCoin(p1, coin)
        }, (p1, coin) => {
            //if player is holding the right direction AND coin.collectible
            return coin.collectible
        })

        //Player 2 collects coins
        this.p2CoinOverlap = this.physics.add.overlap(this.p2, this.coins, (p2, coin) => {
            this.PickupCoin(p2, coin)
        }, (p2, coin) => {
            //if player is holding the right direction AND coin.collectible
            return coin.collectible
        })

        //Layer ordering
        this.mainLayer = this.add.layer()
        //this.mainLayer.add([this.coins, this.p1, this.p2])
        //this.mainLayer.sendToBack(this.coins)

    }

    update() {
        //if(!this.gameOver){
        // make sure we step (ie update) the player's state machine
        this.P1FSM.step()
        this.P1FSM.step()

        this.timer -= this.game.loop.delta
        if (this.timer <= 0) {
            this.ObjectSpawner()
            if (this.startTimer > 100) {
                this.startTimer -= 100
            }
            this.timer = this.startTimer
        };

    }

    ObjectSpawner() {
        //console.log("object spawned")
        switch (Phaser.Math.Between(0, 2)) { //what is being spawned?
            case 0:
                this.SpawnCoin(config.width/2, this.skyHeight)
                break
            case 1:
                //console.log("spike spawned")
                this.SpawnCoin(config.width/2, this.skyHeight)
                break
            case 2:
                //console.log("clothesline spawned")
                this.SpawnCoin(config.width/2, this.skyHeight)
                break
        }
    }

    SpawnCoin(x, y, value) {
        //console.log("coin spawned")
        this.coins.add(new Coin(this, x, y, 'coin'))
    }

    PickupCoin(player, coin) {
        this.score += coin.value
        console.log(this.score)
        coin.destroy()
    }
}