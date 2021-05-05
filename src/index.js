import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";

const config = {
    type: Phaser.AUTO,
    parent: 'hero-game',
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [
        MainMenuScene,
    ]
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
}, false);
