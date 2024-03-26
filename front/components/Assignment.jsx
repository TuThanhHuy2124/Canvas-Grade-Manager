// eslint-disable-next-line react/prop-types
function Assignment({name, realGrade, totalGrade, index, onDelete, deleteCode}) {
  return (
    <div key={index} className="assignment">
      <input className="assignmentTitleInput" type="text" placeholder={name}/>: 
      <input className="realGradeInput" type="number" placeholder={realGrade}/> / <input className="totalGradeInput" type="number" placeholder={totalGrade}/>
      <button id={deleteCode} onClick={onDelete}>Delete</button>
    </div>
  )
}

export default Assignment
