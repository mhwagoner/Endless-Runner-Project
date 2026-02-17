class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // add background image
        this.map = this.add.image(0, 0, 'map').setOrigin(0)
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
        this.p1 = new P1(this, 150, config.height-100, 'player1', 0)
        this.p2 = new P1(this, config.width - 150, config.height-100, 'player2', 0)
        

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
        this.startTimer = 2000
        this.timer = this.startTimer

        this.coins = this.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true,
        });
    }

    update() {
        //if(!this.gameOver){
        // make sure we step (ie update) the player's state machine
        this.P1FSM.step()
        this.P1FSM.step()

        this.timer -= this.game.loop.delta
        if (this.timer <= 0) {
            this.ObjectSpawner()
            this.startTimer = this.startTimer -= 10
            this.timer = this.startTimer
        };

    }

    ObjectSpawner() {
        console.log("object spawned")
        switch (Phaser.Math.Between(0, 2)) { //what is being spawned?
            case 0:
                this.Coin(config.width/2, this.skyHeight)
                break
            case 1:
                console.log("spike spawned")
                this.Coin(config.width/2, this.skyHeight)
                break
            case 2:
                console.log("clothesline spawned")
                this.Coin(config.width/2, this.skyHeight)
                break
        }
    }

    Coin(x, y, value) {
        console.log("coin spawned")
        this.coins.add(new Coin(this, x, y, 'coin'))
    }
}