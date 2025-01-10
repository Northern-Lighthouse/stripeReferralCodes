import React from 'react'
import { Link } from 'react-router-dom'
import "./navbar.css"

function Navbar() {
  return (
    <div className="navbar">
        <p className="navbar__item"><Link to={"/"} className="navbar__link">Home</Link></p>
        <p className="navbar__item"><Link to={"/profile"} className="navbar__link">Profile</Link></p>
        <p className="navbar__item"><Link to={"/signUp"} className="navbar__link">SignUp</Link></p>
    </div>
  )
}

export default Navbar