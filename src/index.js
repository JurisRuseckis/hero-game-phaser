import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";
import {NavigationScene} from "./scenes/NavigationScene";
import {LoadingScene} from "./scenes/LoadingScene";
import {CharacterScene} from "./scenes/CharacterScene";

const config = {
    type: Phaser.AUTO,
    parent: 'hero-game',
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [
        MainMenuScene, NavigationScene, LoadingScene, CharacterScene
    ]
};

const game = new Phaser.Game(config);

window.addEventListener('resize', function () {
    game.scale.resize(window.innerWidth, window.innerHeight);
}, false);
