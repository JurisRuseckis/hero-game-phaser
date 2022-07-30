export default class Scenario
{
    /**
     *
     * @param {Object} props
     * @param {string} props.indexChapterScenario
     * @param {string} props.chapter
     * @param {string} props.title
     * @param {Army[]} props.armies
     * @param {Phaser.Math.Vector2[]} props.deploymentTiles
     * @param {number[][]} props.arena
     */
    constructor(props) {
        /**
         * @json
         * @type {string}
         */
        this.indexChapterScenario = props.indexChapterScenario;
        this.chapter = props.chapter
        this.title = props.title;
        this.arena = props.arena;
        this.armies = props.armies;
        this.deploymentTiles = props.deploymentTiles
    }
}