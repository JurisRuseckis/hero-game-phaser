import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";
import {NavigationScene} from "./scenes/NavigationScene";
import {LoadingScene} from "./scenes/LoadingScene";
import {CharacterScene} from "./scenes/CharacterScene";
import {styles} from "./styles";
import {InventoryScene} from "./scenes/InventoryScene";
import { BattleGridScene } from './scenes/BattleGridScene';
import {BattleUIScene} from "./scenes/BattleUIScene";

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'hero-game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: styles.viewPort.width,
        height: styles.viewPort.height
    },
    scene: [
        //BattleGridScene,
        MainMenuScene,
        CharacterScene,
        InventoryScene,
        LoadingScene,
        NavigationScene,
        BattleGridScene,
        BattleUIScene,
    ]
};

// noinspection JSUnusedLocalSymbols
const game = new Phaser.Game(config);