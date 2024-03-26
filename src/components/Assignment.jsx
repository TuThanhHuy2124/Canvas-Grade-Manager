function Assignment({name, realGrade, totalGrade}) {
  return (
    <>
      <p>
        <span>{name}: </span>
        <input type="text" placeholder={realGrade}></input> / {totalGrade}</p>
    </>
  )
}

export default Assignment
