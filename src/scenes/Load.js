class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // load the visual goodz
        this.load.path = './assets/'
        this.load.spritesheet('hero', 'hero-sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('player1', 'Temp_Spritesheet.png', {
            frameWidth: 200,
            frameHeight: 200,
        })
        this.load.image('map', 'map-scroll.jpg')
        this.load.image('coin', 'coin.jpg')
    }

    create() {
        // player1 animations
        this.anims.create({
            key: 'duck',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 4, end: 4 }),
        })
        this.anims.create({
            key: 'hand-right',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 2, end: 2 }),
        })
        this.anims.create({
            key: 'hand-up',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 3, end: 3 }),
        })
        this.anims.create({
            key: 'hand-left',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 1, end: 1 }),
        })
        this.anims.create({
            key: 'hand-left-right',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 5, end: 5 }),
        })
        this.anims.create({
            key: 'hand-left-up',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 6, end: 6 }),
        })
        this.anims.create({
            key: 'hand-right-up',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 7, end: 7 }),
        })
        this.anims.create({
            key: 'idle',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('player1', { start: 0, end: 0 }),
        })

        // proceed once loading completes
        this.scene.start('playScene')
    }
}