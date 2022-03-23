import Phaser from 'phaser';
import {MainMenuScene} from "./scenes/MainMenuScene";
import {NavigationScene} from "./scenes/NavigationScene";
import {LoadingScene} from "./scenes/LoadingScene";
import {CharacterScene} from "./scenes/CharacterScene";
import {styles} from "./styles";
import {InventoryScene} from "./scenes/InventoryScene";
import { BattleGridScene } from './scenes/BattleGridScene';
import {BattleUIScene} from "./scenes/BattleUIScene";
import {CampScene} from "./scenes/CampScene";
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config = {
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'army-composer-stone-age-stone-age',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: styles.viewPort.width,
        height: styles.viewPort.height
    },
    scene: [
        // CampScene,
        // NavigationScene,
        // BattleGridScene,
        MainMenuScene,
        BattleGridScene,
        BattleUIScene,
        CampScene,
        CharacterScene,
        InventoryScene,
        LoadingScene,
        NavigationScene,
    ],
    plugins: {
        scene: [{
            key: 'rexuiplugin',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
};

// noinspection JSUnusedLocalSymbols
const game = new Phaser.Game(config);