const gradeCalculatorByWeight = (weight, assignments) => {

    const testNull =  assignments.reduce((prevBool, currAsmt) => {
        return prevBool && (currAsmt["real"] === null)
    }, true)
    if(testNull) {return null;}

    var real = assignments.reduce((prevReal, currAsmt) => {
        if(currAsmt["real"] !== null) { return prevReal + currAsmt["real"]; }
        else return prevReal;
    }, 0)
    var total = assignments.reduce((prevTotal, currAsmt) => {
        if(currAsmt["real"] !== null) { return prevTotal + currAsmt["total"]; }
        else return prevTotal;
    }, 0)

    if(total === 0) {total = 1;}
    var calc = (real / total) * weight;
    if(Math.round(calc) !== calc) { calc = Number(calc.toFixed(2)) }
    
    return calc;
}

const totalGradeCalculator = (weightGroups) => {
    const testNull =  weightGroups.reduce((prevBool, currWG) => {
        return prevBool && (currWG["grade"] === null)
    }, true)
    if(testNull) {return null;}

    var totalGrade = weightGroups.reduce((prevGrade, currWG) => {
        if(currWG["grade"] !== null) { return prevGrade + currWG["grade"]; }
        else return prevGrade;
    }, 0)
    var totalWeight = weightGroups.reduce((prevWeight, currWG) => {
        if(currWG["grade"] !== null) { return prevWeight + currWG["weight"]; }
        else return prevWeight;
    }, 0)
    
    if(totalWeight === 0) {totalWeight = 1;}
    var calc = (totalGrade / totalWeight) * 100;
    if(Math.round(calc) !== calc) { calc = Number(calc.toFixed(2)) }

    return calc;
}

export { totalGradeCalculator, gradeCalculatorByWeight };
