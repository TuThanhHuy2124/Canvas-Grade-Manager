// CSS
import "./Courses.css";
// Helper Functions
import { gradeCalculatorByWeight, totalGradeCalculator } from "../../gradeCalculator";
import { useState } from "react";
import getFullObj from "../../api";
// Other Components
import Assignment from "./Assignment";
import CourseForm from "./CourseForm";
import WGForm from "./WGForm";
import AssignmentForm from "./AssignmentForm";
// get fullObj here
var fullObj = await getFullObj();

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
      console.log(event);
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

      console.log(fullObj)
      getRows(fullObj);
    }

    /* Add another Weight Group to the correct Course in fullObj */
    const registerWeightGroup = (event) => {
      console.log(event);
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

      console.log(fullObj)
      getRows(fullObj);
      
    }

    /* Add another Course to fullObj */
    const registerCourse = (event) => {
      console.log(event);
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

      console.log(fullObj)
      getRows(fullObj);
      
    }

    const applyGrade = (event) => {
      console.log(event);
      event.preventDefault();

    }

    /* Render rows */
    const getRows = (fullObj) => {
      // Courses Container contains everything
      var coursesContainer = []
      coursesContainer.push(<CourseForm condition={fullObj["addCourse"]} onClickFn={registerCourse}/>)

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
                // Get real grade for each assignment and set to "Ungraded" if null
                var outGrade = assignment["real"]
                if(assignment["real"] === null) {outGrade = "Ungraded"}
                assignmentsContainer.push(<Assignment index={asmtIndex} name={assignment["name"]} realGrade={outGrade} totalGrade={assignment["total"]}/>)
            });   
            
            // Push the renders for each weight group to Weight Groups Container
            weightGroupsContainer.push(<div key={WGIndex} className="weightGroupContainer">
                                          <button className="weightGroupTitle" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={addAssignment}>{weightGroup["name"]}: {weightGroup["weight"]}% (Current: {(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}%)</button>
                                          <AssignmentForm condition={weightGroup["addAssignment"]} course={course} weightGroup={weightGroup} onClickFn={registerAssignment} splitter={SPLITTER}/>
                                          {assignmentsContainer}
                                       </div>);

        });

        // Push the renders for each course to Courses Container
        coursesContainer.push(<form key={CIndex} className="courseContainer">
                                <button className="courseTitle" id={course["name"]} onClick={addWeightGroup}>{course["name"]} (Current: {(course["grade"] === null) ? 0 : course["grade"]}%)</button>
                                <WGForm condition={course["addWeightGroup"]} course={course} onClickFn={registerWeightGroup}/>
                                {weightGroupsContainer}
                                <input type="submit" value="Apply Grade" onClick={applyGrade}></input>
                              </form>)

      });

      // Set rows to take effect
      setRows(coursesContainer);
  }

    return (
      <>
        {(imported) ? <button onClick={addCourse}>Add Course</button> : <></>}
        <div className="fullContainer">
          {rows}
        </div>
        <button onClick={() => {setTimeout(() => {setImported(true); getRows(fullObj);}, 1000)}}>Import</button>
      </>
    )
  }
  
  export default Courses
  