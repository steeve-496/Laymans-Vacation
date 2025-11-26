import "./App.css"
import { BrowserRouter as Router,Route,Routes, Link} from "react-router-dom"
import Header from "./components/header/header.jsx";
import Hero from "./components/hero/hero.jsx";
import Admin from "./components/admin/admin.jsx";


function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <Hero />
        </>
      }/>
      
      <Route path="/admin" element={
        <Admin />
      }/>

    </Routes>
  </Router>
  )
}

export default App

