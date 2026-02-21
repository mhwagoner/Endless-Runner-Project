class Title extends Phaser.Scene {
    constructor() {
        super("titleScene")
    }

    create() {
        this.add.image(0, 0, 'titlePNG').setOrigin(0)
    }

    update() {
        // proceed once player inputs spacebar
        if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            this.scene.start('playScene')
        }
    }
}