// eslint-disable-next-line react/prop-types
function Assignment({name, realGrade, totalGrade, index}) {
  return (
    <div key={index}>
      <input className="assignmentTitleInput" type="text" placeholder={name}/>: 
      <input className="realGradeInput" type="number" placeholder={realGrade}/> / <input className="totalGradeInput" type="number" placeholder={totalGrade}/>
    </div>
  )
}

export default Assignment
