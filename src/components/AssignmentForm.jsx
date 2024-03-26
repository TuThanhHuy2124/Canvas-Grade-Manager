// eslint-disable-next-line react/prop-types
function AssignmentForm({condition, course, weightGroup, onClickFn, splitter}) {
    if(condition) {
        return (
            // eslint-disable-next-line react/prop-types
            <form id={course["name"] + splitter + weightGroup["name"]}>
                <input placeholder="Assignment Name"></input>: 
                <input type="number" placeholder="Real Grade"></input> / 
                <input type="number" placeholder="Total Grade"></input>
                <input type="submit" onClick={onClickFn}></input>
            </form>
        )
    }
    else return (<></>)
}

export default AssignmentForm
