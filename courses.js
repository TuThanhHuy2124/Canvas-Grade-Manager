import {getCurrentCourses, getAssignmentWeight} from './api.js';

const coursesDisplay = document.getElementById("coursesDisplay");

async function displayAssignmentWeights(parentDiv, course) {
    const assignmentGroups = await getAssignmentWeight(course["id"]);
    console.log(assignmentGroups);
    await assignmentGroups.forEach(assignmentGroup => {
        const newDiv = document.createElement('div');
        newDiv.id = `${assignmentGroup["name"]} Display`;
        newDiv.innerText = `${assignmentGroup["name"]} ${assignmentGroup["group_weight"]}%`;
        parentDiv.appendChild(newDiv);
    });
}

async function displayCourses() {
    const courses = await getCurrentCourses();
    await courses.forEach(course => {
        const newDiv = document.createElement('div');
        newDiv.id = `${course["name"]} Display`;
        newDiv.innerHTML = `<b>${course["name"]}</b>`;
        coursesDisplay.appendChild(newDiv);
        displayAssignmentWeights(newDiv, course);
    });
}

displayCourses()