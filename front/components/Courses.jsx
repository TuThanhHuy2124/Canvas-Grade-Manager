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
// Important: Reduce information
// 1. CSS
// 2. Delete visible only when hover
// 3. Help page (Later)
// 4. Click on name turn into textbox (Later)
// 5. MongoDB
// 6. Deploy
// 7. Color / Course

function Courses() {
    // Use add components row by row and render
    var [rows, setRows] = useState([]);
    // Only display Add Course button after imported
    var [imported, setImported] = useState(false)
    // Used to combine & split some IDs
    const SPLITTER = "@";
    
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

    /* Delete an Assignment from fullObj */
    const deleteAssignment = (event) => {
      event.preventDefault();
      const [courseName, weightGroupName, assignmentName] = event.target.id.split(SPLITTER);

      const [theCourse] = fullObj["courses"].filter(course => {return course["name"] === courseName});
      const [theWeightGroup] = theCourse["weightGroups"].filter(weightGroup => {return weightGroup["name"] === weightGroupName});
      theWeightGroup["assignments"] = theWeightGroup["assignments"].filter(assignment => {return assignment["name"] !== assignmentName})
      theWeightGroup["grade"] = gradeCalculatorByWeight(theWeightGroup["weight"], theWeightGroup["assignments"])
      theCourse["grade"] = totalGradeCalculator(theCourse["weightGroups"])

      getRows(fullObj);
    }

    /* Delete a Weight Group from fullObj */
    const deleteWeightGroup = (event) => {
      event.preventDefault();
      const [courseName, weightGroupName] = event.target.id.split(SPLITTER);

      const [theCourse] = fullObj["courses"].filter(course => {return course["name"] === courseName});
      theCourse["weightGroups"] = theCourse["weightGroups"].filter(weightGroup => {return weightGroup["name"] !== weightGroupName})
      theCourse["grade"] = totalGradeCalculator(theCourse["weightGroups"])

      getRows(fullObj);
    }

    /* Delete a Course from fullObj */
    const deleteCourse = (event) => {
      event.preventDefault();
      const courseName = event.target.id;

      fullObj["courses"] = fullObj["courses"].filter(course => {return course["name"] !== courseName})

      getRows(fullObj);
    }

    /* Mangage Drop Down Button for a Weight Group */
    const dropDownWeightGroup = (event) => {
      event.preventDefault();
      const [courseName, weightGroupName] = event.target.id.split(SPLITTER);

      const [theCourse] = fullObj["courses"].filter(course => {return course["name"] === courseName});
      for(const weightGroup of theCourse["weightGroups"]) {
        if(weightGroup["name"] === weightGroupName) {weightGroup["rendered"] = !weightGroup["rendered"]}
      }
      
      getRows(fullObj);
    }

    /* Mangage Drop Down Button for a Course */
    const dropDownCourse = (event) => {
      event.preventDefault();
      const courseName = event.target.id;

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {course["rendered"] = !course["rendered"]}
      }
      
      getRows(fullObj);
    }

    /* Apply changes the current Course */
    const applyChanges = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const courseName = form[0].id;
      const [realGradeInputs, totalGradeInputs, assigmentTitleInputs, weightInputs, weightGroupTitleInputs, courseTitleInput] = responseSimplifier(form);

      const [theCourse] = fullObj["courses"].filter((course) => {return course["name"] === courseName})
      if(courseTitleInput !== null) {theCourse["name"] = courseTitleInput}
      var index = 0;
      var WGindex = 0;
      for(const weightGroup of theCourse["weightGroups"]) {
        if(weightGroupTitleInputs[WGindex] !== null) {weightGroup["name"] = weightGroupTitleInputs[WGindex]}
        if(weightInputs[WGindex] !== null) {weightGroup["weight"] = weightInputs[WGindex]}
        for(const assignment of weightGroup["assignments"]) {
          if(assigmentTitleInputs[index] !== null) {assignment["name"] = assigmentTitleInputs[index]}
          if(realGradeInputs[index] !== null) {assignment["real"] = realGradeInputs[index]}
          if(totalGradeInputs[index] !== null) {assignment["total"] = totalGradeInputs[index]}
          index++;
        }
        weightGroup["grade"] = gradeCalculatorByWeight(weightGroup["weight"], weightGroup["assignments"])
        WGindex++;
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
                // Push the renders for each Assignment to Assignments Container
                assignmentsContainer.push(<Assignment index={asmtIndex} 
                                                      name={assignment["name"]} 
                                                      realGrade={outGrade} 
                                                      totalGrade={assignment["total"]} 
                                                      onClickDelete={deleteAssignment} 
                                                      deleteCode={course["name"] + SPLITTER + weightGroup["name"] + SPLITTER + assignment["name"]}/>)
            });   
            
            // Push the renders for each WeightGroup to Weight Groups Container
            weightGroupsContainer.push(<WeightGroup course={course} 
                                                    weightGroup={weightGroup}
                                                    SPLITTER={SPLITTER}
                                                    key={WGIndex}
                                                    onClickAdd={addAssignment}
                                                    onClickReg={registerAssignment}
                                                    onClickDelete={deleteWeightGroup}
                                                    onClickDropDown={dropDownWeightGroup}
                                                    assignments={assignmentsContainer}/>);

        });

        // Push the renders for each Course to Courses Container
        coursesContainer.push(<Course course={course}
                                      key={CIndex}
                                      onClickAdd={addWeightGroup}
                                      onClickReg={registerWeightGroup}
                                      onClickDelete={deleteCourse}
                                      onClickApply={applyChanges}
                                      onClickDropDown={dropDownCourse}
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
  