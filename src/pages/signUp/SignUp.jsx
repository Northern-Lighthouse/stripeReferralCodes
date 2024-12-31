import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from "../../components"
import { registerWithEmail } from '../../firebase'
import './signUp.css'

function SignUp() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            registerWithEmail(email, password).then(() => navigate('/profile'))
        } catch(error){
            console.log(error)
        }
    }

  return (
    <>
        <Navbar />
        <div className='signUpContainer'>
            <form className='signUpForm' onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                
                <label>Email:</label>
                <input 
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                />

                <label>Password:</label>
                <input 
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Password'
                />
                
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    </>
  )
}

export default SignUp