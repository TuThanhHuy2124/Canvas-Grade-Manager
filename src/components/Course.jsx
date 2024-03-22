import { useState } from "react";
import getFullObj from "../../api";
import Assignment from "./Assignment";
import {totalGradeCalculator, gradeCalculatorByWeight, formatCourseForCalculation} from "../../gradeCalculator";
import GradeBox from "./GradeBox";

const fullObj = await getFullObj();

function Course() {
    var [rows, setRows] = useState([]);

    const getRows = (fullObj) => {
        const rows = [];
        console.log(fullObj, typeof(fullObj));
        for ( const courseName in fullObj ) {
            const courseData = fullObj[courseName]
            var formatted = formatCourseForCalculation(courseData)
            var gradeByWeight = gradeCalculatorByWeight(formatted)
            var totalGrade = totalGradeCalculator(gradeByWeight)
            rows.push(<h1>{courseName}</h1>)
            for ( const weightGroup in courseData ) {
                const [weight, currPerc] = gradeByWeight[weightGroup]
                const assignments = courseData[weightGroup]["assignments"]
                rows.push(<h2>{weightGroup}: {weight}% (Current: {currPerc}%)</h2>)
                for(const assignment in assignments) {
                    var [realScore, totalScore] = assignments[assignment]
                    if(realScore === null) {realScore = "Ungraded"}
                    rows.push(<Assignment name={assignment} realGrade={realScore} totalGrade={totalScore}/>)
                }    
            }
            
            console.log(formatted)
            rows.push(<GradeBox name={courseName} percentage={totalGrade}/>)
        }
        setRows(rows);
    }

    return (
      <>
        <>{rows}</>
        <button onClick={() => {setTimeout(() => {getRows(fullObj)}, 1000)}}>Import</button>
      </>
    )
  }
  
  export default Course
  