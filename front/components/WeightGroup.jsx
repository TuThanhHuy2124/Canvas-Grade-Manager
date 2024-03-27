/* eslint-disable react/prop-types */
import AssignmentForm from "./AssignmentForm"
import "./WeightGroup.css"

// eslint-disable-next-line react/prop-types
function WeightGroup({course, weightGroup, SPLITTER, key, onClickAdd, onClickDelete, onClickReg, assignments}) {
    return (
        <div key={key} className="weightGroupContainer">
            <button className="weightGroupBtn" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={onClickAdd}>
                <input className="weightGroupTitleInput" placeholder={weightGroup["name"]}></input>{" : "}
                <input className="weightInput" type="number" placeholder={weightGroup["weight"] + "%"}></input>{" "} 
                ({(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}% / {weightGroup["weight"]}%){" "}
                <button className="deleteBtn" id={course["name"] + SPLITTER + weightGroup["name"]} onClick={onClickDelete}>Delete</button> 
            </button>
            <AssignmentForm condition={weightGroup["addAssignment"]} course={course} weightGroup={weightGroup} onClickReg={onClickReg} splitter={SPLITTER}/>
            {assignments}
        </div>
    )
}

export default WeightGroup
