import { Link } from "react-router-dom";
import "./header.css"
function Header() {
  return (
    <div className="nav">
        <div className='logo'>
            <img src="TheLayman'sVacation.png" alt="logo" />
        </div>
        <nav className='nav_bar'>
            <ul className='nav_list'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/destinations">Destinations</Link></li>
                <li><Link to="/why-us">Why Us</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Header
