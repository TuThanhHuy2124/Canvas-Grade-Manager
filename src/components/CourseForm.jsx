// eslint-disable-next-line react/prop-types
function CourseForm({condition, onClickFn}) {
    if(condition) {
        return (
            <form>
                <input placeholder="Course Name"></input>
                <input type="submit" onClick={onClickFn}></input>
            </form>
        )
    }
    else return (<></>)
}

export default CourseForm
