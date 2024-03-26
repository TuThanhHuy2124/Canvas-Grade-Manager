import { useState } from "react";
import getFullObj from "../../api";
import Assignment from "./Assignment";
import "./Courses.css";
import { gradeCalculatorByWeight, totalGradeCalculator } from "../../gradeCalculator";

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
              weightGroup["addAssignment"] = !weightGroup["addAssignment"];
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
          course["addWeightGroup"] = !course["addWeightGroup"];
        }
      }

      getRows(fullObj);
    } 

    // eslint-disable-next-line no-unused-vars
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
      
      if(fullObj["addCourse"]) {coursesContainer.push(<form>
                                                        <input placeholder="Course Name"></input>
                                                        <input type="submit" onClick={registerCourse}></input>
                                                      </form>)}
      for (const course of courses) {
        const courseButton = (<button className="courseTitle" id={course["name"]} onClick={addWeightGroup}>{course["name"]} (Current: {(course["grade"] === null) ? 0 : course["grade"]}%)</button>)
        var weightGroupsContainer = [];
        var WGForm = (<></>);

        if(course["addWeightGroup"]) {WGForm = (<form id={course["name"]}>
                                                  <input placeholder="Weight Group Name"></input>: 
                                                  <input type="number" placeholder="Percentage"></input>
                                                  <input type="submit" onClick={registerWeightGroup}></input>
                                                </form>)}
        for (const weightGroup of course["weightGroups"]) {
            const WGButton = (<button className="weightGroupTitle" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={addAssignment}>{weightGroup["name"]}: {weightGroup["weight"]}% (Current: {(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}%)</button>)
            var assignmentsContainer = [];
            var assignmentForm = (<></>)

            if(weightGroup["addAssignment"]) {assignmentForm = (<form id={course["name"] + SPLITTER + weightGroup["name"]}>
                                                                  <input placeholder="Assignment Name"></input>: 
                                                                  <input type="number" placeholder="Real Grade"></input> / 
                                                                  <input type="number" placeholder="Total Grade"></input>
                                                                  <input type="submit" onClick={registerAssignment}></input>
                                                                </form>)}
            for(const assignment of weightGroup["assignments"]) {
                var outGrade = assignment["real"]
                if(assignment["real"] === null) {outGrade = "Ungraded"}
                assignmentsContainer.push(<Assignment name={assignment["name"]} realGrade={outGrade} totalGrade={assignment["total"]}/>)
            }   
            weightGroupsContainer.push(<div className="weightGroupContainer">{WGButton}{assignmentForm}{assignmentsContainer}</div>);
        }

        coursesContainer.push(<form className="courseContainer">
                                {courseButton}
                                {WGForm}
                                {weightGroupsContainer}
                                
                              </form>)
        //rows.push(<GradeBox name={courseName} percentage={totalGrade}/>)
      }
      setRows(coursesContainer);
  }

    return (
      <>
        <button onClick={addCourse}>Add Course</button>
        <div className="fullContainer">
          {rows}
        </div>
        <button onClick={() => {setTimeout(() => {getRows(fullObj)}, 1000)}}>Import</button>
      </>
    )
  }
  
  export default Courses
  