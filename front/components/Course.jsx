/* eslint-disable react/prop-types */
import WGForm from "./WGForm"

// eslint-disable-next-line react/prop-types
function Course({course, key, onClickAdd, onClickReg, onClickApply, weightGroups}) {
    return (
        <form key={key} className="courseContainer">
            <button className="courseTitle" id={course["name"]} onClick={onClickAdd}>{course["name"]} (Current: {(course["grade"] === null) ? 0 : course["grade"]}%)</button>
            <WGForm condition={course["addWeightGroup"]} course={course} onClickReg={onClickReg}/>
            {weightGroups}
            <input className="btn" type="submit" value="Apply" onClick={onClickApply}></input>
        </form>
    )
}

export default Course
