import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'

function Navbar() {
  return (
    <div className="navContainer">
        <p><Link to="/">Home</Link></p>
        <p><Link to="/profile">Profile</Link></p>
        <p><Link to="/signUp">Sign Up</Link></p>
    </div>
  )
}

export default Navbar