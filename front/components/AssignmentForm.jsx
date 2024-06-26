import "./AssignmentForm.css"

// eslint-disable-next-line react/prop-types
function AssignmentForm({condition, course, weightGroup, onClickReg, splitter}) {
    if(condition) {
        return (
            // eslint-disable-next-line react/prop-types
            <form className="assignmentForm" id={course["id"] + splitter + weightGroup["id"]}>
                <input className="assignmentNameInput" placeholder="Assignment Name"></input>{" : "} 
                <input className="assignmentRealGradeInput" type="number" placeholder="Real Grade"></input>{" / "} 
                <input className="assignmentTotalGradeInput" type="number" placeholder="Total Grade"></input>{" "}
                <input className="btn" type="submit" onClick={onClickReg}></input>
            </form>
        )
    }
    else return (<></>)
}

export default AssignmentForm
