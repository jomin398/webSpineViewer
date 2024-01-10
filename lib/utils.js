const qs = (val) => {
    return document.querySelector(val)
}

const qsa = (val) => {
    return document.querySelectorAll(val)
}
function findKeyInObject(obj, key) {
    return obj[Object.keys(obj).find(k => k.includes(key))];
}

const checkFromZip = data => data.async != null;
/**
 * pick Rendom FromArr
 * @param {Array} array a path list of songs
 * @returns {*} pocked path
 */
function pickRendomFromArr(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function createElementFromStr(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.children[0];
}

function mostFreq(fileList) {
    if (!typeof fileList === 'object') return;
    let toUniqList = [];
    for (let fileName in fileList) {
        let nameParts = fileName.split(/[_\s]/);
        if (nameParts[nameParts.length - 1].match(/\d+\.wav$/)) {
            nameParts = nameParts.slice(0, -1);
        }
        toUniqList.push(...nameParts);
    }
    let frequency = toUniqList.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];
};

export { qs, qsa, findKeyInObject, checkFromZip, pickRendomFromArr, createElementFromStr, mostFreq }