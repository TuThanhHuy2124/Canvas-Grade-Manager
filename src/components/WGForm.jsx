import "./WGForm.css"

// eslint-disable-next-line react/prop-types
function WGForm({condition, course, onClickFn}) {
    if(condition) {
        return (
            // eslint-disable-next-line react/prop-types
            <form className="WGForm" id={course["name"]}>
                <input className="WGNameInput" placeholder="Weight Group Name"></input>: 
                <input className="percentageInput" type="number" placeholder="Percentage"></input>
                <input className="btn" type="submit" onClick={onClickFn}></input>
            </form>
        )
    }
    else return (<></>)
}

export default WGForm
