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
gradeObj = {
    addCourse: false
    courses: [
        {
            name: courseName
            addWeightGroup: false
            grade: totalGradeCalculator
            weightGroups: [
                {
                    name: weightGroupName,
                    addAssignment: false,
                    weight: weight,
                    grade: gradeCalculatorByWeight
                    assigments: [
                        {
                            name: assignmentName,
                            real: realScore,
                            total: totalScore
                        }
                    ]
                },
                ...
            ],
            ...
        }
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
            var assigmentsArray = [];
            var assignmentsObj = {}
            
            assignments.forEach( async assignment => {
                var score = null;
                if(assignment.hasOwnProperty('submission') && assignment['submission'].hasOwnProperty("score")) {
                    score = assignment['submission']['score'];
                }
                assignmentsObj["name"] = assignment["name"]
                assignmentsObj["real"] = score;
                assignmentsObj["total"] = assignment["points_possible"];
                assigmentsArray.push(assignmentsObj);
                assignmentsObj = {};
            })
            
            weightGroupObj["assignments"] = assigmentsArray;
            weightGroupObj["addAssignment"] = false;
            weightGroupObj["grade"] = gradeCalculatorByWeight(weightGroupObj["weight"], weightGroupObj["assignments"]);
            weightGroups.push(weightGroupObj);
            weightGroupObj = {};
        })

        courseObj["name"] = course["name"];
        courseObj["addWeightGroup"] = false;
        courseObj["weightGroups"] = weightGroups;
        courseObj["grade"] = totalGradeCalculator(courseObj["weightGroups"])
        coursesArray.push(courseObj);
        courseObj = {};
    });

    fullObj["addCourse"] = false;
    fullObj["courses"] = coursesArray;
    return fullObj;
}

export default getFullObj;