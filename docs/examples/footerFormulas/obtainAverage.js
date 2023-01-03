/**
 * Obtains the average of the values in the column
 * 
 * Formula: ${db.js.obtainAverage(colValues)}
 * @param {*} obtainAverage 
 * @returns 
 */
function obtainAverage(colValues) {
    let sum = 0;
    // Filter just numbers
    colValues = colValues.filter((value) => {
        return !isNaN(value);
    });

    for (let i = 0; i < colValues.length; i++) {
        sum += colValues[i];
    }

    return (sum / colValues.length).toFixed(2);
}

module.exports = obtainAverage