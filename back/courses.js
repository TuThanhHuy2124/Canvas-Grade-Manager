import {getCurrentCourses, getAssignmentWeight} from './api.js';

const coursesDisplay = document.getElementById("coursesDisplay");

async function displayAssignmentWeights(parentDiv, course) {
    const assignmentGroups = await getAssignmentWeight(course["id"]);
    console.log(assignmentGroups);
    await assignmentGroups.forEach(assignmentGroup => {
        const newDiv = document.createElement('div');
        newDiv.id = `${assignmentGroup["name"]}`;
        newDiv.class = "assignmentWeight";

        const newP = document.createElement('p');
        newP.id = `${assignmentGroup["name"]}p`;
        newP.class = "assignmentWeightName";

        const newInput = document.createElement('input');
        newInput.id = `${assignmentGroup["name"]}%`;
        newInput.class = "inputTextBox";
        newInput.placeholder = `${assignmentGroup["group_weight"]}%`;

        newDiv.appendChild(newP);
        newDiv.appendChild(newInput);

        parentDiv.appendChild(newDiv);
        displayAssignments(newDiv, assignmentGroup["assignments"]);
    });
}

async function displayCourses() {
    const courses = await getCurrentCourses();
    await courses.forEach(course => {
        const newDiv = document.createElement('div');
        newDiv.id = `${course["name"]}`;
        newDiv.class = "courseTitle";
        newDiv.innerHTML = `<b>${course["name"]}</b>`;
        coursesDisplay.appendChild(newDiv);
        displayAssignmentWeights(newDiv, course);
    });
}

function displayAssignments(parentDiv, assignments) {
    assignments.forEach(assignment => {
        const newDiv = document.createElement('div');
        newDiv.id = `${assignment["name"]}`;
        newDiv.class = "assignment";
        newDiv.innerText = `${assignment["name"]}`;
        newDiv.innerText += ` ${assignment["points_possible"]}`;
        if(assignment.hasOwnProperty('submission') && assignment['submission'].hasOwnProperty("score")) {
            newDiv.innerText += ` ${assignment['submission']['score']}`;
        }
        parentDiv.appendChild(newDiv);
    });
}

//displayCourses()