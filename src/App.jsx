import './App.css'
import GradeBox from './components/GradeBox.jsx'
import Course from './components/Course.jsx'

var assignments = [70,80,90,100] 
function App() {
  return (
    <>
      <h1>Canvas Grade Manager</h1>
      <Course />
    </>
  )
}

export default App
