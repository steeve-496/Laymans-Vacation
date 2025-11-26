import "./App.css"
import { BrowserRouter as Router,Route,Routes, Link} from "react-router-dom"


function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={
        <Hero />
      }/>
      
      <Route path="/admin" element={
        <Admin />
      }/>

    </Routes>
  </Router>
  )
}

export default App

