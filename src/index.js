import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";
import {NavigationScene} from "./scenes/NavigationScene";
import {LoadingScene} from "./scenes/LoadingScene";
import {CharacterScene} from "./scenes/CharacterScene";
import {styles} from "./styles";
import {InventoryScene} from "./scenes/InventoryScene";
import {DuelScene} from "./scenes/DuelScene";

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'hero-game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: styles.viewPort.width,
        height: styles.viewPort.height
    },
    scene: [
        MainMenuScene,
        CharacterScene,
        DuelScene,
        InventoryScene,
        LoadingScene,
        NavigationScene,
    ]
};

const game = new Phaser.Game(config);
