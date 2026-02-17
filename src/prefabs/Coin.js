// Coin prefab
class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture) // call Sprite parent class

        this.scale = 0.25
        scene.add.existing(this)           // add Coin to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setCircle(this.width/4, this.width/4, this.height/4)
        //this.body.setSize(this.width / 4, this.height / 4, true)

        // set custom Coin properties
        this.setDepth(5)
        this.value = 2
        this.minHeight = config.height - 90
        this.collectible = true

        this.setVelocityY(40)
        
        switch (Phaser.Math.Between(0, 5)) { //direction of coin movement
            case 0: //P2's left
                this.setVelocityX(25)
                break
            case 1: //P2's top
                this.minHeight = config.height - 130
                this.setVelocityX(30)
                this.setVelocityY(30)
                this.x += 100
                break
            case 2: //P2's right
                this.setVelocityX(25)
                this.x += 200
                break
            case 3: //P1's right
                this.setVelocityX(-15)
                break
            case 4: //P1's top
                this.minHeight = config.height - 150
                this.setVelocityX(-25)
                //this.setVelocityY(30)
                this.x -= 35
                break
            case 5: //P1's left
                this.setVelocityX(-35)
                this.x -= 65
                break
        }
    }

    update() {
        this.scale += 0.005
        if (this.y > this.minHeight) {
            this.setDepth(11)
            this.setTint(0xff0000)
            this.collectible = false
            //this.scene.mainLayer.bringToTop(this)
        }
        if (this.y > config.height + this.height) {
            this.destroy()
        }
    }
}

