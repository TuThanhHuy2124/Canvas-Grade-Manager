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

var fullObj = await getFullObj();
console.log(fullObj)
function Courses() {
    var [rows, setRows] = useState([]);
    var [imported, setImported] = useState(false)
    const SPLITTER = "#";
    
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

    // eslint-disable-next-line no-unused-vars
    const addCourse = (event) => {
      event.preventDefault();
      fullObj["addCourse"] = !fullObj["addCourse"];
      getRows(fullObj);
    } 

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

    const getRows = (fullObj) => {
      var coursesContainer = []
      const courses = fullObj["courses"]
      coursesContainer.push(<CourseForm condition={fullObj["addCourse"]} onClickFn={registerCourse}/>)

      for (const course of courses) {
        const courseButton = (<button className="courseTitle" id={course["name"]} onClick={addWeightGroup}>{course["name"]} (Current: {(course["grade"] === null) ? 0 : course["grade"]}%)</button>)
        var weightGroupsContainer = [];

        for (const weightGroup of course["weightGroups"]) {
            const WGButton = (<button className="weightGroupTitle" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={addAssignment}>{weightGroup["name"]}: {weightGroup["weight"]}% (Current: {(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}%)</button>)
            var assignmentsContainer = [];

            for(const assignment of weightGroup["assignments"]) {
                var outGrade = assignment["real"]
                if(assignment["real"] === null) {outGrade = "Ungraded"}
                assignmentsContainer.push(<Assignment name={assignment["name"]} realGrade={outGrade} totalGrade={assignment["total"]}/>)
            }   

            weightGroupsContainer.push(<div className="weightGroupContainer">
                                          {WGButton}
                                          <AssignmentForm condition={weightGroup["addAssignment"]} course={course} weightGroup={weightGroup} onClickFn={registerAssignment} splitter={SPLITTER}/>
                                          {assignmentsContainer}
                                       </div>);

        }

        coursesContainer.push(<form className="courseContainer">
                                {courseButton}
                                <WGForm condition={course["addWeightGroup"]} course={course} onClickFn={registerWeightGroup}/>
                                {weightGroupsContainer}
                                <input type="submit" value="Apply Grade" onClick={applyGrade}></input>
                              </form>)
      }
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
  