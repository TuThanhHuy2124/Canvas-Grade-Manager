function Assignment({name, realGrade, totalGrade}) {
  return (
    <>
      <p><span>{name}:</span> {realGrade} / {totalGrade}</p>
    </>
  )
}

export default Assignment
