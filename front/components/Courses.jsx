// CSS
import "./Courses.css";
// Helper Functions
import { gradeCalculatorByWeight, totalGradeCalculator } from "../../back/gradeCalculator.js";
import { useState } from "react";
import responseSimplifier from "../../back/responseSimplifier.js";
import getFullObj from "../../back/api.js";
// Other Components
import Assignment from "./Assignment";
import WeightGroup from "./WeightGroup.jsx";
import Course from "./Course.jsx";
import CourseForm from "./CourseForm";
// get fullObj here
var fullObj = await getFullObj();

// TODO:
// 1. Change weight group weight reflects
// 2. Able to delete things

function Courses() {
    // Use add components row by row and render
    var [rows, setRows] = useState([]);
    // Only display Add Course button after imported
    var [imported, setImported] = useState(false)
    // Used to combine & split some IDs
    const SPLITTER = "#";
    
    /* Traverse through the full object, find the correct "addAssignment" and negate it 
       One click enables boxes, another disables boxes */
    const addAssignment = (event) => {
      event.preventDefault();
      const [courseName, weightGroupName] = event.target.id.split(SPLITTER);

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          const weightGroups = course["weightGroups"]
          for(const weightGroup of weightGroups) {
            if(weightGroup["name"] === weightGroupName) {
              weightGroup["addAssignment"] = !weightGroup["addAssignment"];
            }
          }
        }
      }

      getRows(fullObj);
    }    

    /* Traverse through the full object, find the correct "addWeightGroup" and negate it 
       One click enables boxes, another disables boxes */
    const addWeightGroup = (event) => {
      event.preventDefault();
      const courseName = event.target.id;

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          course["addWeightGroup"] = !course["addWeightGroup"];
        }
      }

      getRows(fullObj);
    } 

    /* Negate "addCourse" 
       One click enables boxes, another disables boxes */
    // eslint-disable-next-line no-unused-vars
    const addCourse = (event) => {
      event.preventDefault();
      fullObj["addCourse"] = !fullObj["addCourse"];
      getRows(fullObj);
    } 

    /* Add another Assignment to the correct Weight Group in fullObj */
    const registerAssignment = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const [assignmentName, realGrade, totalGrade] = [form[0].value, form[1].value, form[2].value];
      const [courseName, weightGroupName] = form.id.split(SPLITTER);

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          const weightGroups = course["weightGroups"]
          for(const weightGroup of weightGroups) {
            if(weightGroup["name"] === weightGroupName) {
              weightGroup["addAssignment"] = false;
              weightGroup["assignments"].push({
                "name": assignmentName,
                "real": Number(realGrade),
                "total": Number(totalGrade)
              });
              weightGroup["grade"] = gradeCalculatorByWeight(weightGroup["weight"], weightGroup["assignments"])
              course["grade"] = totalGradeCalculator(course["weightGroups"])
            }
          }
        }
      }

      getRows(fullObj);
    }

    /* Add another Weight Group to the correct Course in fullObj */
    const registerWeightGroup = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const [weightGroupName, percentage] = [form[0].value, form[1].value];
      const courseName = form.id;

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          course["addWeightGroup"] = false;
          course["weightGroups"].push({
            "name": weightGroupName,
            "addAssignment": false,
            "weight": Number(percentage),
            "grade": null,
            "assignments": []
          })
          course["grade"] = totalGradeCalculator(course["weightGroups"])
        }
      }

      getRows(fullObj);
    }

    /* Add another Course to fullObj */
    const registerCourse = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const courseName = form[0].value;
      fullObj["addCourse"] = false;

      fullObj["courses"].push({
        "name": courseName,
        "addWeightGroup": false,
        "grade": null,
        "weightGroups": []
      })

      getRows(fullObj);
    }

    const deleteAssignment = (event) => {
      event.preventDefault();
      const [courseName, weightGroupName, assignmentName] = event.target.id.split(SPLITTER);

      const [theCourse] = fullObj["courses"].filter(course => {return course["name"] === courseName});
      const [theWeightGroup] = theCourse["weightGroups"].filter(weightGroup => {return weightGroup["name"] === weightGroupName});
      theWeightGroup["assignments"] = theWeightGroup["assignments"].filter(assignment => {return assignment["name"] !== assignmentName})

      getRows(fullObj);
    }

    /* Apply changes the current course */
    const applyChanges = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const courseName = form[0].id;
      const [realGradeInputs, totalGradeInputs, assigmentTitleInputs] = responseSimplifier(form);

      const [theCourse] = fullObj["courses"].filter((course) => {return course["name"] === courseName})
      var index = 0;
      for(const weightGroup of theCourse["weightGroups"]) {
        for(const assignment of weightGroup["assignments"]) {
          if(assigmentTitleInputs[index] !== null) {assignment["name"] = assigmentTitleInputs[index]}
          if(realGradeInputs[index] !== null) {assignment["real"] = realGradeInputs[index]}
          if(totalGradeInputs[index] !== null) {assignment["total"] = totalGradeInputs[index]}
          index++;
        }
        weightGroup["grade"] = gradeCalculatorByWeight(weightGroup["weight"], weightGroup["assignments"])
      }
      theCourse["grade"] = totalGradeCalculator(theCourse["weightGroups"])
      
      form.reset()
      getRows(fullObj);
    }

    /* Render rows */
    const getRows = (fullObj) => {
      // Courses Container contains everything
      var coursesContainer = []

      // Traverse through the courses
      fullObj["courses"].forEach((course, CIndex) => {

      
        // Weight Groups Container contains all weight groups
        var weightGroupsContainer = [];

        // Traverse through the weight groups of current course
        course["weightGroups"].forEach((weightGroup, WGIndex) => {

            // Assignments Container contains all assignments
            var assignmentsContainer = [];

            // Traverse through the assignments of current weight group
            weightGroup["assignments"].forEach((assignment, asmtIndex) => {
                // Get real grade for each assignment and set to "NYG" if null
                var outGrade = assignment["real"]
                if(assignment["real"] === null) {outGrade = "NYG"}
                assignmentsContainer.push(<Assignment index={asmtIndex} 
                                                      name={assignment["name"]} 
                                                      realGrade={outGrade} 
                                                      totalGrade={assignment["total"]} 
                                                      onDelete={deleteAssignment} 
                                                      deleteCode={course["name"] + SPLITTER + weightGroup["name"] + SPLITTER + assignment["name"]}/>)
            });   
            
            // Push the renders for each weight group to Weight Groups Container
            weightGroupsContainer.push(<WeightGroup course={course} 
                                                    weightGroup={weightGroup}
                                                    SPLITTER={SPLITTER}
                                                    key={WGIndex}
                                                    onClickAdd={addAssignment}
                                                    onClickReg={registerAssignment}
                                                    assignments={assignmentsContainer}/>);

        });

        // Push the renders for each course to Courses Container
        coursesContainer.push(<Course course={course}
                                      key={CIndex}
                                      onClickAdd={addWeightGroup}
                                      onClickReg={registerWeightGroup}
                                      onClickApply={applyChanges}
                                      weightGroups={weightGroupsContainer}/>)

      });

      // Set rows to take effect
      setRows(coursesContainer);
  }

    return (
      <>
        <div id="addCourseContainer">
          {(imported) ? <button id="addCourseBtn" onClick={addCourse}>Add Course</button> : <></>}
          <CourseForm condition={fullObj["addCourse"]} onClickReg={registerCourse}/>
        </div>
        <div className="fullContainer">
          {rows}
        </div>
        <div id="importContainer">
          {(!imported) ? <button id="importBtn" onClick={() => {setTimeout(() => {setImported(true); getRows(fullObj);}, 1000)}}>Import</button> : <></>}
        </div>
      </>
    )
  }
  
  export default Courses
  