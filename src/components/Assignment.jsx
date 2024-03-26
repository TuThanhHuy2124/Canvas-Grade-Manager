// eslint-disable-next-line react/prop-types
function Assignment({name, realGrade, totalGrade, index}) {
  return (
    <div key={index}>
      <span>{name}: </span>
      <input type="number" placeholder={realGrade}></input> / {totalGrade}
    </div>
  )
}

export default Assignment
