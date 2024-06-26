/* eslint-disable react/prop-types */
import AssignmentForm from "./AssignmentForm"
import "./WeightGroup.css"

// eslint-disable-next-line react/prop-types
function WeightGroup({course, weightGroup, SPLITTER, key, onClickAdd, onClickDelete, onClickReg, onClickDropDown, assignments}) {
    return (
        <div key={key} className="weightGroupContainer">
            <div className="weightGroupTitle">
                <button className="weightGroupBtn" id={course["id"] + SPLITTER + weightGroup["id"]} onClick={onClickAdd}>
                    <input className="weightGroupTitleInput" placeholder={weightGroup["name"]}></input>{" : "}
                    <input className="weightInput" type="number" placeholder={weightGroup["weight"] + "%"}></input>{" "} 
                    ({(weightGroup["grade"] === null) ? 0 : weightGroup["grade"]}% / {weightGroup["weight"]}%){" "}
                </button>
                <button className="dropDownBtn" id={course["id"] + SPLITTER + weightGroup["id"]} onClick={onClickDropDown}>{(weightGroup["rendered"]) ? "<" : ">"}</button>
                <button className="deleteBtn" id={course["id"] + SPLITTER + weightGroup["id"]} onClick={onClickDelete}>Delete</button> 
            </div>
            <AssignmentForm condition={weightGroup["addAssignment"]} course={course} weightGroup={weightGroup} onClickReg={onClickReg} splitter={SPLITTER}/>
            {(weightGroup["rendered"]) ? assignments : <></>}
        </div>
    )
}

export default WeightGroup
