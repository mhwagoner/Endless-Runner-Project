// Clothesline prefab
class Clothesline extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, value) {
        super(scene, x, y, texture) // call Sprite parent class

        this.scale = 0.1
        scene.add.existing(this)           // add Sclothesline to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setSize(this.width, this.height / 50, true)
        this.body.setOffset(0, this.height / 3)

        // set custom Clothesline properties
        this.position = "false"
        //this.collectible = false
        this.unavoidable = true
        this.setDepth(5)
        this.setToBack()
        this.minHeight = config.height - 30
        //set value
        this.value = value

        this.setVelocityY(config.speed)
    }

    update() {
        this.scale = this.y / 250

        if (this.y > this.minHeight) { //if leaving collectible range
            this.setDepth(11)
            this.unavoidable = false
            this.body.checkCollision.none = true
            //this.setTint(0xff0000)
        }
        if (this.y > config.height + this.height) {
            this.destroy()
        }
    }
}

