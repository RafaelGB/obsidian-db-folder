/**
 * count the number of pair numbers in a column
 * @param {*} colValues 
 * @returns 
 */
function pairNumbersCount(colValues) {
    let pairCount = 0;
    // Filter just numbers
    colValues = colValues.filter((value) => {
        return !isNaN(value);
    });

    for (let i = 0; i < colValues.length; i++) {
        if (colValues[i] % 2 == 0) {
            pairCount++;
        }
    }

    return pairCount;
}

module.exports = pairNumbersCount
