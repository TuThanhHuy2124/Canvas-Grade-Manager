import { useState } from "react";
import getFullObj from "../../api";
import Assignment from "./Assignment";
import {totalGradeCalculator, gradeCalculatorByWeight, formatCourseForCalculation} from "../../gradeCalculator";
import GradeBox from "./GradeBox";

var fullObj = await getFullObj();
console.log(fullObj)
function Courses() {
    var [rows, setRows] = useState([]);
    const SPLITTER = "#";
    
    const addAssignment = (event) => {
      const [courseName, weightGroupName] = event.target.id.split(SPLITTER);

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          const weightGroups = course["weightGroups"]
          for(const weightGroup of weightGroups) {
            if(weightGroup["name"] === weightGroupName) {
              weightGroup["addAssignment"] = true;
            }
          }
        }
      }

      getRows(fullObj);
    }    

    const addWeightGroup = (event) => {
      const courseName = event.target.id;

      for(const course of fullObj["courses"]) {
        if(course["name"] === courseName) {
          course["addWeightGroup"] = true;
        }
      }

      getRows(fullObj);
    } 

    const addCourse = (event) => {
      fullObj["addCourse"] = true;
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
            "assignments": []
          })
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
        "weightGroups": []
      })

      console.log(fullObj)
      getRows(fullObj);
      
    }

    const getRows = (fullObj) => {
      var coursesContainer = []
      var courses = fullObj["courses"]
      
      if(fullObj["addCourse"]) {coursesContainer.push(<form>
                                                        <input placeholder="Course Name"></input>
                                                        <input type="submit" onClick={registerCourse}></input>
                                                      </form>)}
      for (const course of courses) {
        //var formatted = formatCourseForCalculation(courseData)
        //var gradeByWeight = gradeCalculatorByWeight(formatted)
        //var totalGrade = totalGradeCalculator(gradeByWeight)
        coursesContainer.push(<h1 className="courseTitle" id={course["name"]} onClick={(event) => {console.log(event)}}>{course["name"]} <button id={course["name"]} onClick={addWeightGroup}>Add Weight Group</button></h1>)
        var weightGroupsContainer = [];

        if(course["addWeightGroup"]) {coursesContainer.push(<form id={course["name"]}>
                                                              <input placeholder="Weight Group Name"></input>: 
                                                              <input placeholder="Percentage"></input>
                                                              <input type="submit" onClick={registerWeightGroup}></input>
                                                            </form>)}
        for (const weightGroup of course["weightGroups"]) {
            //console.log(weightGroup)
            //const [weight, currPerc] = gradeByWeight[weightGroup]
            
            weightGroupsContainer.push(<h2 className="weightGroupTitle">{weightGroup["name"]}: {weightGroup["weight"]}% (Current: {0}%) <button id={course["name"] + SPLITTER + weightGroup["name"]} onClick={addAssignment}>Add Assignment</button></h2>)
            var assignmentsContainer = [];

            if(weightGroup["addAssignment"]) {weightGroupsContainer.push(<form id={course["name"] + SPLITTER + weightGroup["name"]}>
                                                                            <input placeholder="Assignment Name"></input>: 
                                                                            <input placeholder="Real Grade"></input> / 
                                                                            <input placeholder="Total Grade"></input>
                                                                            <input type="submit" onClick={registerAssignment}></input>
                                                                         </form>)}
            for(const assignment of weightGroup["assignments"]) {
                //var [realScore, totalScore] = assignments[assignment]
                var outGrade = assignment["real"]
                if(assignment["real"] === null) {outGrade = "Ungraded"}
                assignmentsContainer.push(<Assignment name={assignment["name"]} realGrade={outGrade} totalGrade={assignment["total"]}/>)
                //console.log(assignmentsContainer)
            }   
            
            weightGroupsContainer.push(<div id={weightGroup["name"] + "div"}>{assignmentsContainer}</div>);
            //console.log(weightGroupsContainer)
        }

        coursesContainer.push(<div>{weightGroupsContainer}</div>)
        //console.log(coursesContainer)
        //console.log(formatted)
        //rows.push(<GradeBox name={courseName} percentage={totalGrade}/>)
      }
      setRows(coursesContainer);
  }

    return (
      <>
        <button onClick={addCourse}>Add Course</button>
        <div>
          {rows}
        </div>
        <button onClick={() => {setTimeout(() => {getRows(fullObj)}, 1000)}}>Import</button>
      </>
    )
  }
  
  export default Courses
  