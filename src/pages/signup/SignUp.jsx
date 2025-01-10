import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpWithEmail } from '../../firebase'
import { Navbar } from '../../components'
import './signup.css'

function SignUp() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        signUpWithEmail(email, password).then(() => { nav("/profile") })
    }

  return (
    <div>
        <Navbar />
        <div className="signup">
            <form className="signup__form" onSubmit={handleSubmit}>
                <div className="signup__form-group">
                    <label className="signup__label" htmlFor="email">Email:</label>
                    <input 
                        className="signup__input" 
                        type="email" 
                        id="email" 
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="signup__form-group">
                    <label className="signup__label" htmlFor="password">Password:</label>
                    <input 
                        className="signup__input" 
                        type="password" 
                        id="password" 
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button className="signup__button" type="submit">Sign Up</button>
            </form>
        </div>
    </div>
  )
}

export default SignUp