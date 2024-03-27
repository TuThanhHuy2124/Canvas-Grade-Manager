/* eslint-disable react/prop-types */
import WGForm from "./WGForm"
import "./Course.css"

// eslint-disable-next-line react/prop-types
function Course({course, key, onClickAdd, onClickReg, onClickDelete, onClickApply, weightGroups}) {
    return (
        <form key={key} className="courseContainer">
            <div className="courseTitle">
                <button className="courseBtn" id={course["name"]} onClick={onClickAdd}>
                    <input className="courseTitleInput" placeholder={course["name"]}></input>
                    {" "}(Current: {(course["grade"] === null) ? 0 : course["grade"]}%)
                </button>{" "}
                <button className="btn deleteBtn" id={course["name"]} onClick={onClickDelete}>Delete</button>
            </div>
            <WGForm condition={course["addWeightGroup"]} course={course} onClickReg={onClickReg}/>
            {weightGroups}
            <input className="btn applyBtn" type="submit" value="Apply" onClick={onClickApply}></input>
        </form>
    )
}

export default Course
