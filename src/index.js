import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";
import {NavigationScene} from "./scenes/NavigationScene";
import {LoadingScene} from "./scenes/LoadingScene";
import {CharacterScene} from "./scenes/CharacterScene";
import {styles} from "./styles";
import {InventoryScene} from "./scenes/InventoryScene";
import {DuelScene} from "./scenes/DuelScene";
import { BattleScene } from './scenes/BattleScene';
import { BattleGridScene } from './scenes/BattleGridScene';

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'hero-game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: styles.viewPort.width,
        height: styles.viewPort.height
    },
    scene: [
        // BattleGridScene,
        // BattleScene,
        MainMenuScene,
        CharacterScene,
        DuelScene,
        InventoryScene,
        LoadingScene,
        NavigationScene,
        BattleScene,
        BattleGridScene,
    ]
};

const game = new Phaser.Game(config);