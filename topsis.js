// matrices

// load math.js (using node.js)
var math = require('mathjs');

const m_alternatives = 3;
const n_criterias = 4;

var dataset = math.matrix([
    [[4, 2, 3], [9, 9, 3], [9, 9, 9]],
    [[8, 8, 5], [6, 2, 4], [3, 2, 4]],
    [[6, 2, 4], [5, 2, 2], [1, 1, 1]],
    [[4, 5, 6], [2, 1, 3], [10, 10, 7]]
]);
console.log("Dataset is");
print(dataset);
// math.size() ==> rows, cols, ...
var weights = math.zeros(dataset.size()[0], dataset.size()[1]);
//weights(nxm)
var criterions = weights.clone();

var sumMinMaxDiff = math.zeros(weights.size()[1], 2);
// sumMinMaxDiff(mx2)
//var minMaxDiff = sumMinMaxDiff.clone();

var final = math.zeros(sumMinMaxDiff.size()[0]);
//final(1xm)

dataset.forEach(function (value, index, matrix) {
    console.log('value:', value, 'index:', index);
    let votes = math.squeeze(matrix.subset(math.index(index[0], index[1], math.range(0, 3))));

    weights.subset(math.index(index[0], index[1]), math.sum(votes) / votes.size()[0]);
});
console.log("Weights is");
print(weights);
weights.forEach(function (value, index, matrix) {
    let rowSum = math.sum(matrix.subset(
        math.index(index[0], math.range(0, m_alternatives))
    ));
    criterions.subset(math.index(index[0], index[1]), Math.pow(value, 2) / rowSum);
});
console.log("Criterions is");
print(criterions);
for (n = 0; n != n_criterias; n++) {
    let votes = math.squeeze(criterions.subset(math.index(n, math.range(0, m_alternatives))));
    print(votes);
    let minVal = 0, maxVal = 0;
    //for each alternative
    for (m = 0; m != m_alternatives; m++) {
        value = votes.subset(math.index(m));
        //votes.forEach(function (value, index, matrix) {
        console.log(Math.pow(value - math.min(votes), 2));
        sumMinMaxDiff.subset(math.index(m, 0), Math.pow(value - math.min(votes), 2) + sumMinMaxDiff.subset(math.index(m, 0)));
        //minVal += Math.pow(value - math.min(matrix), 2);
        sumMinMaxDiff.subset(math.index(m, 1), Math.pow(math.max(votes) - value, 2) + sumMinMaxDiff.subset(math.index(m, 1)));
        //maxVal += Math.pow(math.max(matrix) - value, 2);
    }
    //sumMinMaxDiff.subset(math.index(n, 0), minVal);
    //sumMinMaxDiff.subset(math.index(n, 1), maxVal);
}
console.log("sumMinMaxDiff is");
print(sumMinMaxDiff);
var minMaxDiff = sumMinMaxDiff.map(function (value, index, matrix) {
    return Math.sqrt(value);
})

for (m = 0; m != m_alternatives; ++m) {
    let votes = math.squeeze(minMaxDiff.subset(math.index(m, math.range(0, 2))));
    console.log(m);
    final.subset(math.index(m), votes.subset(math.index(0)) / math.sum(votes));
}
console.log("Final is");
print(final);


/**
 * Helper function to output a value in the console. Value will be formatted.
 * @param {*} value
 */
function print(value) {
    var precision = 14;
    console.log(math.format(value, precision));
}
