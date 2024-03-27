/* eslint-disable react/prop-types */
import AssignmentForm from "./AssignmentForm"
import "./WeightGroup.css"

// eslint-disable-next-line react/prop-types
function WeightGroup({course, weightGroup, SPLITTER, key, onClickAdd, onClickDelete, onClickReg, assignments}) {
    return (
        <div key={key} className="weightGroupContainer">
            <div className="weightGroupTitle">
                <button className="weightGroupBtn" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={onClickAdd}>{weightGroup["name"]}</button>{" : "}
                <input className="weightInput" type="number" placeholder={weightGroup["weight"] + "%"}></input>{" "} 
                (Current: {(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}%){" "}
                <button className="deleteBtn" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={onClickDelete}>Delete</button> 
            </div>
            <AssignmentForm condition={weightGroup["addAssignment"]} course={course} weightGroup={weightGroup} onClickReg={onClickReg} splitter={SPLITTER}/>
            {assignments}
        </div>
    )
}

export default WeightGroup
