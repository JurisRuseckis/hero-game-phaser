/**
 * Loads content from json files to phaser registry
 */
import {combatActions} from "./Generators/BattleActions";
import Character from "./Character";
import {battleAI} from "./AI/BattleAIs";
import Scenario from "./Scenario";
import Army from "./Army";
import Squad from "./Squad";
import Phaser from "phaser";

export default class WarChest
{
    /**
     *
     * @param {Object} props
     // * @param {Object[]} props.combatActions
     * @param {Object[]} props.characters
     * @param {Object[]} props.scenarios
     */
    constructor(props) {
        /**
         *
         * @type {CombatAction[]}
         */
        this.combatActions = this.loadCombatActions();
        /**
         *
         * @type {Character[]}
         */
        this.characters = this.loadCharacters(props.characters);
        this.availableRaces = this.characters.map(c => c.race).filter((value, index, self) => {
            return self.indexOf(value) === index
        });
        /**
         *
         * @type {Object[]}
         */
        this.scenarios =  this.loadScenarios(props.scenarios);

    }

    loadCombatActions() {
        //abilities should be loaded from js file, as there is fn in object
        // this.abilites = abilities;
        return combatActions;
    }

    loadAIs(){
        // dunnot how to properly load this needed for units
    }

    loadCharacters(units) {
        return units.map((unitJSON) => {
            let cmbActions = {};
            unitJSON.combatActions.forEach((combatAction) => {
                cmbActions[combatAction] = this.combatActions[combatAction];
            });
            unitJSON.combatActions = cmbActions;

            unitJSON.battleAI = battleAI[unitJSON.battleAI];

            return new Character(unitJSON);
        });
    }

    loadScenarios(scenarios) {
        // todo: rethink scenario obj, maybe we can simplify json and just add editing tool, to avoid tons of arrays
        let tree = scenarios.chapters.map((chapter)=>{
            chapter.items = [];
            return chapter;
        })
        scenarios.scenarios = scenarios.scenarios.map((scenario)=>{
            // todo: custom units for scenario

            scenario.deploymentTiles = scenario.deploymentTiles.map((deploymentTile) => {
                return new Phaser.Math.Vector2(deploymentTile[0], deploymentTile[1]);
            })

            // todo string shortcuts or random armies instead of empty arrays
            scenario.armies = scenario.armies.map((army)=>{
                return new Army({
                    squads : army.map((squad)=>{

                        squad.direction = Phaser.Math.Vector2[squad.direction]

                        // todo: make string shortcuts for middle, left, right, etc
                        if(squad.coordinates[0] === -1){
                            delete squad.coordinates
                        } else {
                            //currently whis will trigger teams auto location in generator
                            //as they wont have coordinates same as generated teams
                            squad.coordinates = new Phaser.Math.Vector2(squad.coordinates[0],squad.coordinates[1])
                        }

                        squad.formation = squad.formation.map((row) =>{
                            return row.map((column) => {
                                return this.characters.find(char => char.key === column)
                            })
                        })

                        return new Squad(squad)
                    })
                })
            });

            const scen = new Scenario(scenario);
            const chapterIndex = tree.findIndex(o => o.key === scen.chapter);
            tree[chapterIndex].items[scen.indexChapterScenario] = scen;

            return scen;
        });
        scenarios.tree = tree;
        return scenarios;
    }

    getCharactersByRace(race) {
        return this.characters.filter((char) => race === char.race).sort((a,b) => (
            a.tier > b.tier)
            ? 1
            : (a.tier < b.tier)
                ? -1
                : 0
        )
    }
}