//parse atlas file to get image list.
export default class AtlasParser {
    /**
     * @param {String} atlasStr atlas file text string.
     */
    constructor(atlasStr) {
        this.data = atlasStr;
    }
    /**
     * parse atlas lines to get image list.
     * @returns {String[]} image list.
     */
    parse() {
        let lines = this.data.split('\n');
        let result = [];
        for (let line of lines) {

            if (line.includes('.png') || line.includes('.jpg') || line.includes('.webp')) {

                result.push(line.trim().replace(/((?:[^\/]*\/)*)(.*)/gm, '$2'));
            }
        }
        this.data = result;
        return result;
    }
}
