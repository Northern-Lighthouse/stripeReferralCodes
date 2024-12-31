import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Navbar } from "../../components"
import { auth, db, logout } from '../../firebase'
import './profile.css'

function Profile() {

  const navigate = useNavigate()
  const [money, setMoney] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState("");

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch(error){
      console.log(error)
    }
  }
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopySuccess("Referral Code Copied!");
      setTimeout(() => {
        setCopySuccess("");
      }, 2000);
    }).catch((error) => {
      console.log(error);
      setCopySuccess("Failed to Copy Referral Code!");
      setTimeout(() => {
        setCopySuccess("");
      }, 2000);
    });
    
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid)
        onSnapshot(docRef, (doc) => {
          const data = doc.data()
          setMoney(data.money)
          setReferralCode(data.referralCode)
          setLoading(false)
        })
      } else {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  if (loading) {
    return <>
        <Navbar />
        <div className='profileContainer'>Loading...</div>
    </>
  }

  return (
    <div>
        <Navbar />
        <div className='profileContainer'>
          <h2>Profile</h2>
          <div className='profileDetails'>
            <p>Email: {auth.currentUser?.email}</p>
            <p>UID: {auth.currentUser?.uid}</p>
            <p>Money: {money}</p>
            <div className='referralCode'>
              <p>Referral Code: {referralCode}</p>
              <button className="copyButton" onClick={copyReferralCode}>Copy</button>
              {copySuccess && <span className='copySuccess'>{copySuccess}</span>}
            </div>
            <div className='stripeContainer'>
              <stripe-pricing-table 
                pricing-table-id="prctbl_replace_me"
                publishable-key="pk_test_replace_me"
                client-reference-id={auth.currentUser?.uid}
              >
              </stripe-pricing-table>
            </div>
          </div>
          <button className='logoutButton' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default Profile