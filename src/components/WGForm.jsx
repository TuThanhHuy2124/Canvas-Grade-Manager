// eslint-disable-next-line react/prop-types
function WGForm({condition, course, onClickFn}) {
    if(condition) {
        return (
            <form id={course["name"]}>
                <input placeholder="Weight Group Name"></input>: 
                <input type="number" placeholder="Percentage"></input>
                <input type="submit" onClick={onClickFn}></input>
            </form>
        )
    }
    else return (<></>)
}

export default WGForm
