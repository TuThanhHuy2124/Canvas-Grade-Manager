const responseSimplifier = (form) => {
    var realGradeInputs = []
    var totalGradeInputs = []
    var assigmentTitleInputs = []
    var weightInputs = []
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
        if(form[i]["className"] === "courseTitleInput") {
            courseTitleInput = (form[i].value === "") ? null : form[i].value
        }
    } 
    
    return [realGradeInputs, totalGradeInputs, assigmentTitleInputs, weightInputs, courseTitleInput]
}

export default responseSimplifier