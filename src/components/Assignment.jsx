// eslint-disable-next-line react/prop-types
function Assignment({name, realGrade, totalGrade}) {
  return (
    <p>
      <span>{name}: </span>
      <input type="number" placeholder={realGrade}></input> / {totalGrade}
    </p>
  )
}

export default Assignment
