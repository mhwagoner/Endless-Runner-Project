// Coin prefab
class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture) // call Sprite parent class

        this.scale = 0.25
        scene.add.existing(this)           // add Coin to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setSize(this.width / 4, this.height / 4, true)
        this.body.enabled = false
        this.setVelocityY(50)
        
        switch (Phaser.Math.Between(0, 5)) { //direction of coin movement
            case 0:
                this.setVelocityX(25)
                break
            case 1:
                this.setVelocityX(30)
                this.setVelocityY(30)
                this.x += 100
                break
            case 2:
                this.setVelocityX(25)
                this.x += 200
                break
            case 3:
                this.setVelocityX(-25)
                break
            case 4:
                this.setVelocityX(-30)
                this.setVelocityY(30)
                this.x -= 100
                break
            case 5:
                this.setVelocityX(-25)
                this.x -= 200
                break
        }
    }

    update() {
        this.scale += 0.005
        if (this.y > config.height + this.height) {
            this.destroy()
        }
    }
}

