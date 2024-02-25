import tokenObject from './token.json' assert { type: "json" };

const canvasBaseURL = "https://canvas.eee.uci.edu";
const canvasCourses = "/api/v1/courses";
const assignmentGroupParam = "/assignment_groups";

async function getCurrentCourses() {
    const response = await fetch(canvasBaseURL + 
                                 canvasCourses + 
                                 "?access_token=" + tokenObject["TOKEN"] + 
                                 "&include[]=term" + 
                                 "&per_page=100");
    const resJSON = await response.json();
    const courseFiltered = await resJSON.filter((x) => x.hasOwnProperty("term") 
                                              && x["term"].hasOwnProperty("end_at")
                                              && Date.parse(x["term"]["end_at"]) > Date.now());
    console.log(response);
    console.log(resJSON);
    return courseFiltered;
}

async function getAssignmentWeight(courseID) {
    courseID = `/${courseID}`
    const response = await fetch(canvasBaseURL + 
                                 canvasCourses +
                                 courseID +
                                 assignmentGroupParam +
                                 "?access_token=" + tokenObject["TOKEN"] + 
                                 "&per_page=100");
    const resJSON = await response.json();
    return resJSON;
}

export {getCurrentCourses, getAssignmentWeight};