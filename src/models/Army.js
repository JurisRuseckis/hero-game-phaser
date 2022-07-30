export default class Army
{
    /**
     *
     * @param {Object} props
     * @param {Squad[]} props.squads
     */
    constructor(props) {
        // divide team's army into squads etc to enable multiple formations and multiple field commanders
        this.squads = props.squads;
    }

    getLargestDimension() {
        return Math.max(...this.squads.map(r => r.getLargestDimension()));
    }
}