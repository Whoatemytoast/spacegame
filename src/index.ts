import { Game, Scene, Types } from "phaser";

class Ship {
    constructor(public sprite: any) {
        sprite.body.setMaxSpeed(300);
    }

    rotate(degrees: number) {
        this.sprite.angle += degrees

    }

    thrust(thrust: number) {
        const angle = this.sprite.angle * 0.017453;
        const yAccel = -Math.cos(angle) * thrust;
        const xAccel = Math.sin(angle) * thrust;

        this.sprite.setAcceleration(xAccel, yAccel);
    }
}

class MainScene extends Scene {
    private cursors: Types.Input.Keyboard.CursorKeys | null;
    private gamepad?: Phaser.Input.Gamepad.Gamepad;
    private ship?: Ship;

    constructor() {
        super('main-scene');
        this.cursors = null;
    }

    preload(): void {
        this.load.image('stars', 'assets/stars.png');
        this.load.image('ship_1', 'assets/ship_1.png');
    }

    create(): void {
        this.add.image(400, 300, 'stars');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.gamepad.once('connected', (pad) => {
            console.log('connected', pad.id);
            this.gamepad = pad;

            const ship = this.physics.add.sprite(400, 300, "ship_1");
            this.ship = new Ship(ship);
        });

    }

    update(): void {
        if (this.gamepad && this.ship) {
            this.physics.world.wrap(this.ship.sprite, 16);
            if (this.gamepad.leftStick.x < -0.3) {
                this.ship.rotate(2 * this.gamepad.leftStick.x);
            }
            else if (this.gamepad.leftStick.x > 0.3) {
                this.ship.rotate(2 * this.gamepad.leftStick.x);
            }
            if (this.gamepad.A) {
                this.ship.thrust(470);
            }
            else if (this.gamepad.L2) {
                this.ship.thrust(470);
            }
            else if (this.gamepad.R2) {
                this.ship.thrust(-235);
            } else {
                this.ship.thrust(0);
            }
        } else {
            if (this.cursors?.left.isDown) {
                this.ship?.rotate(-5);
            }
            else if (this.cursors?.right.isDown) {
                this.ship?.rotate(5);
            }

            if (this.cursors?.up.isDown) {
                this.ship?.thrust(470);
            } else {
                this.ship?.thrust(0);
            }
        }
    }
}

var config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    input: {
        gamepad: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

const game = new Game(config);



