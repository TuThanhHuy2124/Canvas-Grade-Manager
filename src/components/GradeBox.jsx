import { useState } from 'react';
import './GradeBox.css';
import Assignment from './Assignment';

function GradeBox({name, realGrade, totalGrade, percentage}) {

  return (
    <>
        <h5>{name}: {percentage}%</h5>
    </>
  )
}

export default GradeBox
