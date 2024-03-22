import tokenObject from './token.json' assert { type: "json" };

const canvasBaseURL = "https://canvas.eee.uci.edu";
const canvasCourses = "/api/v1/courses";
const assignmentGroupParam = "/assignment_groups";

async function _getCurrentCourses() {
    const response = await fetch(canvasBaseURL + 
                                 canvasCourses + 
                                 "?access_token=" + tokenObject["TOKEN"] + 
                                 "&include[]=term" + 
                                 "&per_page=100");
    const resJSON = await response.json();
    const courseFiltered = await resJSON.filter((x) => x.hasOwnProperty("term") 
                                              && x["term"].hasOwnProperty("end_at")
                                              && Date.parse(x["term"]["end_at"]) > Date.now());
    return courseFiltered;
}

async function _getAssignmentWeight(courseID) {
    courseID = `/${courseID}`
    const response = await fetch(canvasBaseURL + 
                                 canvasCourses +
                                 courseID +
                                 assignmentGroupParam +
                                 "?access_token=" + tokenObject["TOKEN"] + 
                                 "&include[]=assignments" + 
                                 "&include[]=submission" +
                                 "&per_page=100" );
    const resJSON = await response.json();
    return resJSON;
}

/* 
gradeObj = {
    className: {
        weightName: {
            weight: weight;
            assigments: {
                assignementName1: [real1, total1],
                ...
            }
        },
        ...
    }
}
*/
const getFullObj = async () => {
    var fullObj = {};
    var courseObj = {};
    var courses = await _getCurrentCourses();
    

    await courses.forEach( async course => {
        const assignmentWeight = await _getAssignmentWeight(course["id"]);
        var weightGroupObj = {} 

        assignmentWeight.forEach( async weightGroup => {
            weightGroupObj["weight"] = weightGroup["group_weight"];
            var assignments = weightGroup["assignments"];
            var assignmentsObj = {}
            
            assignments.forEach( async assignment => {
                var score = null;
                if(assignment.hasOwnProperty('submission') && assignment['submission'].hasOwnProperty("score")) {
                    score = assignment['submission']['score'];
                }
                var gradePair = [score, assignment["points_possible"]];
                assignmentsObj[assignment["name"]] = gradePair;
                
            })
            
            weightGroupObj["assignments"] = assignmentsObj;
            courseObj[weightGroup["name"]] = weightGroupObj;
            assignmentsObj = {};
            weightGroupObj = {};
        })
        
        fullObj[course["name"]] = courseObj;
        courseObj = {};
    });

    return fullObj;
}

export default getFullObj;