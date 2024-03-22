// gradeObj = {percentage: [[assignment1real, assignment1total], etc.]} JSON
const formatCourseForCalculation = (courseData) => {
    var resultObj = {}
    for ( const groupName in courseData ) {
        const group = courseData[groupName]
        const assignments = group["assignments"]
        var value = [courseData[groupName]["weight"]];
        var arr = [];
        for ( const assignment in assignments ) {
            arr.push(assignments[assignment])
        } 
        value.push(arr);
        resultObj[groupName] = value;
    }
    console.log(resultObj)
    return resultObj
}

const gradeCalculatorByWeight = (gradeObj) => {
    var resultObj = {};
    for(var groupName in gradeObj) {
        var [weight, assignments] = gradeObj[groupName];
        var real = assignments.reduce((prevReal, currPair) => {
            return prevReal + currPair[0];
        }, 0)
        var total = assignments.reduce((prevTotal, currPair) => {
            if(currPair[0] !== null) { return prevTotal + currPair[1]; }
            else return prevTotal;
        }, 0)
        if(total === 0) {total = 1;}
        var calc = (real / total) * weight;
        if(Math.round(calc) !== calc) {
            calc = Number(calc.toFixed(2))
        }
        resultObj[groupName] = [weight, calc]; 
    }
    console.log(resultObj)
    return resultObj;
}

const totalGradeCalculator = (gradeObj) => {
    var totalWeight = 0;
    var totalGrade = 0;
    for(var groupName in gradeObj) {
        var [weight, grade] = gradeObj[groupName];
        if(grade !== 0) {
            totalWeight += weight;
            totalGrade += grade;
        }
    }
    console.log(totalGrade, totalWeight)
    if(totalWeight === 0) {totalWeight = 1;}
    var calc = (totalGrade / totalWeight) * 100;
    if(Math.round(calc) !== calc) {
        calc = Number(calc.toFixed(2))
    }
    return calc;
}

export { totalGradeCalculator, gradeCalculatorByWeight, formatCourseForCalculation };

/*
var testObj = {
    "15": [[12,15], [1,1], [89, 100]],
    "20": [[10,13]],
}

console.log(gradeCalculatorByPercentage(testObj));
console.groupCollapsed(totalGradeCalculator(gradeCalculatorByPercentage(testObj)));*/