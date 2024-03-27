import "./CourseForm.css"

// eslint-disable-next-line react/prop-types
function CourseForm({condition, onClickReg}) {
    if(condition) {
        return (
            <form className="courseForm">
                <input className="courseNameInput" placeholder="Course Name"></input>{" "}
                <input className="btn" type="submit" onClick={onClickReg}></input>
            </form>
        )
    }
    else return (<></>)
}

export default CourseForm
