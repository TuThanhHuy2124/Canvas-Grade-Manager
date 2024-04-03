/**
 * Used specifically for applyChanges(), simplify a form to 
 * 6 arrays of data for 6 different input categories in a Course Form
 * @param {*} form - a form 
 * @returns - realGradeInputs, totalGradeInputs, assigmentTitleInputs, weightInputs, weightGroupTitleInputs, courseTitleInput
 */
const responseSimplifier = (form) => {
    var realGradeInputs = []
    var totalGradeInputs = []
    var assigmentTitleInputs = []
    var weightInputs = []
    var weightGroupTitleInputs = []
    var courseTitleInput = null;

    for(let i = 0; i < form.length; i++) {
        if(form[i]["className"] === "realGradeInput") {
            realGradeInputs.push((form[i].value === "") ? null : Number(form[i].value))
        }
        if(form[i]["className"] === "totalGradeInput") {
            totalGradeInputs.push((form[i].value === "") ? null : Number(form[i].value))
        }
        if(form[i]["className"] === "assignmentTitleInput") {
            assigmentTitleInputs.push((form[i].value === "") ? null : form[i].value)
        }
        if(form[i]["className"] === "weightInput") {
            weightInputs.push((form[i].value === "") ? null : Number(form[i].value))
        }
        if(form[i]["className"] === "weightGroupTitleInput") {
            weightGroupTitleInputs.push((form[i].value === "") ? null : form[i].value)
        }
        if(form[i]["className"] === "courseTitleInput") {
            courseTitleInput = (form[i].value === "") ? null : form[i].value
        }
    } 
    
    return [realGradeInputs, totalGradeInputs, assigmentTitleInputs, weightInputs, weightGroupTitleInputs, courseTitleInput]
}

export default responseSimplifier