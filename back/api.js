import { gradeCalculatorByWeight, totalGradeCalculator } from './gradeCalculator';
import tokenObject from '../token.json' assert { type: "json" };

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

fullObj = {
    addCourse: false
    courses: [
        {
            id: ...
            name: courseName
            addWeightGroup: false
            grade: totalGradeCalculator
            rendered: true
            weightGroups: [
                {
                    id: ...
                    name: weightGroupName,
                    addAssignment: false,
                    weight: weight,
                    grade: gradeCalculatorByWeight
                    rendered: true
                    assigments: [
                        {
                            id: ...
                            name: assignmentName,
                            real: realScore,
                            total: totalScore
                        },
                        ...
                    ]
                },
                ...
            ]
        },
        ...
    ]
}

*/

const getFullObj = async () => {
    var fullObj = {};
    var coursesArray = [];
    var courseObj = {};
    var courses = await _getCurrentCourses();
    

    await courses.forEach( async course => {
        const assignmentWeight = await _getAssignmentWeight(course["id"]);
        var weightGroups = [];
        var weightGroupObj = {}; 

        assignmentWeight.forEach( async weightGroup => {
            weightGroupObj["name"] = weightGroup["name"];
            weightGroupObj["weight"] = weightGroup["group_weight"];
            
            var assignments = weightGroup["assignments"];
            var assignmentsArray = [];
            var assignmentObj = {}
            
            assignments.forEach( async assignment => {
                var score = null;
                if(assignment.hasOwnProperty('submission') && assignment['submission'].hasOwnProperty("score")) {
                    score = assignment['submission']['score'];
                }

                assignmentObj["id"] = Math.floor(Date.now() * Math.random()).toString(16)
                assignmentObj["name"] = assignment["name"]
                assignmentObj["real"] = score;
                assignmentObj["total"] = assignment["points_possible"];
                assignmentsArray.push(assignmentObj);
                assignmentObj = {};
            })
            
            weightGroupObj["id"] = Math.floor(Date.now() * Math.random()).toString(16)
            weightGroupObj["assignments"] = assignmentsArray;
            weightGroupObj["addAssignment"] = false;
            weightGroupObj["grade"] = gradeCalculatorByWeight(weightGroupObj["weight"], weightGroupObj["assignments"]);
            weightGroupObj["rendered"] = true;
            weightGroups.push(weightGroupObj);
            weightGroupObj = {};
        })

        courseObj["id"] = Math.floor(Date.now() * Math.random()).toString(16)
        courseObj["name"] = course["name"];
        courseObj["addWeightGroup"] = false;
        courseObj["weightGroups"] = weightGroups;
        courseObj["grade"] = totalGradeCalculator(courseObj["weightGroups"])
        courseObj["rendered"] = true;
        coursesArray.push(courseObj);
        courseObj = {};
    });

    fullObj["addCourse"] = false;
    fullObj["courses"] = coursesArray;

    console.log(fullObj)
    
    return fullObj;
}

export default getFullObj;