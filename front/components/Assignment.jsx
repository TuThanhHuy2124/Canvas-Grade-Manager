import "./Assignment.css"

// eslint-disable-next-line react/prop-types
function Assignment({name, realGrade, totalGrade, index, onClickDelete, deleteCode}) {
  return (
    <div key={index} className="assignment">
      <input className="assignmentTitleInput" type="text" placeholder={name}/>{" : "}
      <input className="realGradeInput" type="number" placeholder={realGrade}/>{" / "}<input className="totalGradeInput" type="number" placeholder={totalGrade}/>{" "}
      <button className="deleteBtn" id={deleteCode} onClick={onClickDelete}>Delete</button>
    </div>
  )
}

export default Assignment
