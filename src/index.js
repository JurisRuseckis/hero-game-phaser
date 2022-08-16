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
import WarChest from "./models/WarChest";
import {BattleSimulatorScene} from "./scenes/BattleSimulatorScene";

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
        BattleSimulatorScene,
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

export const warChest = new WarChest({
    characters: require('./data/characters.json'),
    scenarios: require('./data/scenarios.json'),
})

// noinspection JSUnusedLocalSymbols
const game = new Phaser.Game(config);