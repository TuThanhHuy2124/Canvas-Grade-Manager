// CSS
import "./Courses.css";
// Helper Functions
import { gradeCalculatorByWeight, totalGradeCalculator } from "../../back/gradeCalculator.js";
import { useEffect, useState } from "react";
import responseSimplifier from "../../back/responseSimplifier.js";
import getFullObj from "../../back/api.js";
// Other Components
import Assignment from "./Assignment";
import WeightGroup from "./WeightGroup.jsx";
import Course from "./Course.jsx";
import CourseForm from "./CourseForm";
import OneTimeInput from "./OneTimeInput.jsx";

// Future Changes:
// 1. Help page
// 2. Color / Course
// 3. Use Router (IMMEDIATE)

// If mode is not stored => default to import
if(localStorage.getItem("mode") === null) { localStorage.setItem("mode", "import");}

function Courses() {
    const defaultObj = {
      addCourse: false,
      courses: []
    }
    // Used to add components row by row and render
    var [rows, setRows] = useState([]);
    var [imported, setImported] = useState(false)
    var [TOKEN, setTOKEN] = useState(localStorage.getItem("TOKEN"))
    var [insURL, setInsURL] = useState(localStorage.getItem("institutionURL"))
    var [fullObj, setFullObj] = useState(defaultObj)

    // Used to combine & split some IDs
    const SPLITTER = "@";
    
    useEffect(() => {
      const getData = async () => {
        const ableToFetch = insURL !== null && TOKEN !== null;
        var obj = {...defaultObj}
        console.log(localStorage)
        // If fullObj is not stored
        if(localStorage.getItem("fullObj") === null) {
          // If DOES have sensitive info => import from Canvas
          if(ableToFetch) { obj = await getFullObj();  console.log("imported 1", obj);}
          
        }
        else {
          // If mode is import and DOES have sensitive info => import from Canvas
          if(localStorage.getItem("mode") === "import" && ableToFetch) { obj = await getFullObj(); console.log("imported 2")}
          // If mode is load => load
          else if (localStorage.getItem("mode") === "load") { obj = JSON.parse(localStorage.getItem("fullObj")); console.log("loaded " + localStorage.getItem("fullObj")); }
          // Else do nothing => get default obj
        }
        
        // Prevent local-stored fullObj from being set to null
        //console.log(JSON.stringify(obj) !== JSON.stringify(defaultObj))
        //if(JSON.stringify(obj) !== JSON.stringify(defaultObj)) {setFullObj(obj); console.log("set obj"); }

        setFullObj(obj);
      }

      getData();
    }, [])



    /** 
     * Traverse through the full object, find the correct "addAssignment" and negate it.
     * One click enables boxes, another disables boxes 
     */
    const addAssignment = (event) => {
      event.preventDefault();
      const [courseID, weightGroupID] = event.target.id.split(SPLITTER);

      for(const course of fullObj["courses"]) {
        if(course["id"] === courseID) {
          const weightGroups = course["weightGroups"]
          for(const weightGroup of weightGroups) {
            if(weightGroup["id"] === weightGroupID) {
              weightGroup["addAssignment"] = !weightGroup["addAssignment"];
            }
          }
        }
      }

      console.log(fullObj)
      getRows(fullObj);
    }    

    /**
     * Traverse through the full object, find the correct "addWeightGroup" and negate it.
     * One click enables boxes, another disables boxes 
     */
    const addWeightGroup = (event) => {
      event.preventDefault();
      const courseID = event.target.id;

      for(const course of fullObj["courses"]) {
        if(course["id"] === courseID) {
          course["addWeightGroup"] = !course["addWeightGroup"];
        }
      }

      getRows(fullObj);
    } 

    /** 
     * Negate "addCourse". 
     * One click enables boxes, another disables boxes 
     */
    // eslint-disable-next-line no-unused-vars
    const addCourse = (event) => {
      event.preventDefault();
      fullObj["addCourse"] = !fullObj["addCourse"];
      getRows(fullObj);
    } 

    /**
     * Add another Assignment to the correct Weight Group in fullObj 
     */
    const registerAssignment = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const [assignmentName, realGrade, totalGrade] = [form[0].value, form[1].value, form[2].value];
      const [courseID, weightGroupID] = form.id.split(SPLITTER);

      for(const course of fullObj["courses"]) {
        if(course["id"] === courseID) {
          const weightGroups = course["weightGroups"]
          for(const weightGroup of weightGroups) {
            if(weightGroup["id"] === weightGroupID) {
              weightGroup["addAssignment"] = false;
              weightGroup["assignments"].push({
                "id": Math.floor(Date.now() * Math.random()).toString(16),
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

    /** 
     * Add another Weight Group to the correct Course in fullObj 
     */
    const registerWeightGroup = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const [weightGroupName, percentage] = [form[0].value, form[1].value];
      const courseID = form.id;

      for(const course of fullObj["courses"]) {
        if(course["id"] === courseID) {
          course["addWeightGroup"] = false;
          course["weightGroups"].push({
            "id": Math.floor(Date.now() * Math.random()).toString(16),
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

    /**
     * Add another Course to fullObj 
     */
    const registerCourse = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const courseName = form[0].value;
      fullObj["addCourse"] = false;

      fullObj["courses"].push({
        "id": Math.floor(Date.now() * Math.random()).toString(16),
        "name": courseName,
        "addWeightGroup": false,
        "grade": null,
        "weightGroups": []
      })

      getRows(fullObj);
    }

    /** 
     * Delete an Assignment from fullObj 
     */
    const deleteAssignment = (event) => {
      event.preventDefault();
      const [courseID, weightGroupID, assignmentID] = event.target.id.split(SPLITTER);
      console.log(courseID, weightGroupID, assignmentID)
      const [theCourse] = fullObj["courses"].filter(course => {return course["id"] === courseID});
      const [theWeightGroup] = theCourse["weightGroups"].filter(weightGroup => {return weightGroup["id"] === weightGroupID});
      theWeightGroup["assignments"] = theWeightGroup["assignments"].filter(assignment => {return assignment["id"] !== assignmentID})
      theWeightGroup["grade"] = gradeCalculatorByWeight(theWeightGroup["weight"], theWeightGroup["assignments"])
      theCourse["grade"] = totalGradeCalculator(theCourse["weightGroups"])

      getRows(fullObj);
    }

    /**
     * Delete a Weight Group from fullObj
     */
    const deleteWeightGroup = (event) => {
      event.preventDefault();
      const [courseID, weightGroupID] = event.target.id.split(SPLITTER);

      const [theCourse] = fullObj["courses"].filter(course => {return course["id"] === courseID});
      theCourse["weightGroups"] = theCourse["weightGroups"].filter(weightGroup => {return weightGroup["id"] !== weightGroupID})
      theCourse["grade"] = totalGradeCalculator(theCourse["weightGroups"])

      getRows(fullObj);
    }

    /**
     * Delete a Course from fullObj 
     */
    const deleteCourse = (event) => {
      event.preventDefault();
      const courseID = event.target.id;

      fullObj["courses"] = fullObj["courses"].filter(course => {return course["id"] !== courseID})

      getRows(fullObj);
    }

    /**
     * Mangage Drop Down Button for a Weight Group 
     */
    const dropDownWeightGroup = (event) => {
      event.preventDefault();
      const [courseID, weightGroupID] = event.target.id.split(SPLITTER);
      
      const [theCourse] = fullObj["courses"].filter(course => {return course["id"] === courseID});
      for(const weightGroup of theCourse["weightGroups"]) {
        if(weightGroup["id"] === weightGroupID) {weightGroup["rendered"] = !weightGroup["rendered"]}
      }
      
      getRows(fullObj);
    }

    /**
     * Mangage Drop Down Button for a Course 
     */
    const dropDownCourse = (event) => {
      event.preventDefault();
      const courseID = event.target.id;

      for(const course of fullObj["courses"]) {
        if(course["id"] === courseID) {course["rendered"] = !course["rendered"]}
      }
      
      getRows(fullObj);
    }

    /**
     * Apply changes the current Course 
     */
    const applyChanges = (event) => {
      event.preventDefault();
      const form = event.target.form;
      const courseID = form[0].id;
      const [realGradeInputs, totalGradeInputs, assigmentTitleInputs, weightInputs, weightGroupTitleInputs, courseTitleInput] = responseSimplifier(form);

      const [theCourse] = fullObj["courses"].filter((course) => {return course["id"] === courseID})
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

    /**
     * Lock current mode 
     */
    const lockMode = () => {
      if(localStorage.getItem("mode") === "load") {
        localStorage.setItem("mode", "import")
      } else localStorage.setItem("mode", "load"); 
      
      location.reload()
    }
    
    /**
     * Add feature for the save button 
     */
    const save = () => {
      if(localStorage.getItem("fullObj") !== null) {
        if(confirm("You have an older version saved already. Do you wish to overwrite?")) {
          localStorage.setItem("fullObj", JSON.stringify(fullObj));
        }
      }
    }

    /**
     * Clear TOKEN and Institution's URL
     */
    const clearSensitiveInfo = (e) => {
      e.preventDefault();
      setInsURL(null);
      setTOKEN(null);
      localStorage.removeItem("institutionURL");
      localStorage.removeItem("TOKEN");

      location.reload();
    }

    /** 
     * Render rows 
     */
    const getRows = (fullObj) => {
      // If mode is load and DOES have sensitive info => save state for every change
      console.log(fullObj, defaultObj, JSON.stringify(fullObj) !== JSON.stringify(defaultObj))
      if(localStorage.getItem("mode") === "load" && JSON.stringify(fullObj) !== JSON.stringify(defaultObj)) 
      { localStorage.setItem("fullObj", JSON.stringify(fullObj)); console.log("register change"); }

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
                                                      deleteCode={course["id"] + SPLITTER + weightGroup["id"] + SPLITTER + assignment["id"]}/>)
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
          {(!imported) ? <button id="mode" onClick={lockMode} alt={"Hi"}>Mode: {(localStorage.getItem("mode") === "load") ? "Load" : "Import"}</button> : <></>}
          {(imported) ? <button id="addCourseBtn" onClick={addCourse}>Add Course</button> : <></>}
          {(imported && (localStorage.getItem("mode") === "import")) ? <button onClick={save}>Save</button> : <></>}
          <CourseForm condition={fullObj["addCourse"]} onClickReg={registerCourse}/>
        </div>
        <div className="fullContainer">
          {rows}
        </div>
        <div id="importContainer">
          {!imported && ((insURL === null || TOKEN === null) ? <OneTimeInput setTOKEN={setTOKEN} setInsURL={setInsURL}/> : <button id="clearBtn" onClick={clearSensitiveInfo}>Clear</button>)}
          {(!imported) ? <button id="importBtn" onClick={() => {setTimeout(() => {setImported(true); getRows(fullObj);}, 1000)}}>{(localStorage.getItem("mode") === "load") ? "Load" : "Import"}</button> : <></>}
        </div>
      </>
    )
  }
  
  export default Courses
  