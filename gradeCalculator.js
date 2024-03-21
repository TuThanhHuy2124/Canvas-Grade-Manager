// gradeObj = {percentage: [[assignment1real, assignment1total], etc.]} JSON

const gradeCalculatorByPercentage = (gradeObj) => {
    var resultObj = {};
    for(var percentageKey in gradeObj) {
        var percentage = Number(percentageKey);
        var assignments = gradeObj[percentageKey];
        var real = assignments.reduce((prevReal, currPair) => {
            return prevReal + currPair[0];
        }, 0)
        var total = assignments.reduce((prevTotal, currPair) => {
            return prevTotal + currPair[1];
        }, 0)
        resultObj[percentageKey] = (real / total) * percentage; 
    }
    return resultObj;
}

const totalGradeCalculator = (gradeObj) => {
    var totalPercentage = 0;
    var totalGrade = 0;
    for(var percentageKey in gradeObj) {
        totalGrade += gradeObj[percentageKey];
        totalPercentage += Number(percentageKey);
    }
    return (totalGrade / totalPercentage) * 100;
}
/*
var testObj = {
    "15": [[12,15], [1,1], [89, 100]],
    "20": [[10,13]],
}

console.log(gradeCalculatorByPercentage(testObj));
console.groupCollapsed(totalGradeCalculator(gradeCalculatorByPercentage(testObj)));*/