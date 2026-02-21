// Pickup prefab
class Pickup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, value) {
        super(scene, x, y, texture) // call Sprite parent class

        //set value
        this.value = value

        this.scale = 0.1
        scene.add.existing(this)           // add Pickup to existing scene
        scene.physics.add.existing(this)   // add physics body to scene
        this.body.setCircle(this.width/4, this.width/4, this.height/4)
        //this.body.setSize(this.width / 4, this.height / 4, true)

        // set custom Pickup properties
        this.setDepth(5)
        this.setToBack()
        this.position
        this.maxHeight = config.height - 100
        this.minHeight = config.height - 90
        this.collectible = false

        this.setVelocityY(config.speed)
        
        switch (Phaser.Math.Between(0, 5)) { //direction of pickup movement
            case 0: //P2's left
                this.position = "left"
                this.setVelocityX(15*(config.speed/40))
                break
            case 1: //P2's top
                this.position = "top"
                this.minHeight = config.height - 150
                this.maxHeight = config.height - 160
                this.setVelocityX(28*(config.speed/40))
                //this.setVelocityY(30)
                this.x += 35
                break
            case 2: //P2's right
                this.position = "right"
                this.setVelocityX(35*(config.speed/40))
                this.x += 65
                break
            case 3: //P1's right
                this.position = "right"
                this.setVelocityX(-15*(config.speed/40))
                break
            case 4: //P1's top
                this.position = "top"
                this.minHeight = config.height - 150
                this.maxHeight = config.height - 160
                this.setVelocityX(-28*(config.speed/40))
                //this.setVelocityY(30)
                this.x -= 35
                break
            case 5: //P1's left
                this.position = "left"
                this.setVelocityX(-35*(config.speed/40))
                this.x -= 65
                break
        }
    }

    update() {
        if(this.position == "top"){
            this.scale = (this.y + 60) / 250
        } else {
            this.scale = this.y / 250
        }
        if (this.y > this.minHeight) { //if leaving collectible range
            this.setDepth(11)
            this.setTint(0xff0000)
            this.collectible = false

        } else if (this.y > this.maxHeight) { //if within collectible range
            //console.log(this.scale)
            this.setDepth(5)
            this.setTint(0x00ff00)
            this.collectible = true
        }
        if (this.y > config.height + this.height) {
            this.destroy()
        }
    }
}

