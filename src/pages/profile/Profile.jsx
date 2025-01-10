import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          navigate('/signUp');
        }
      } else {
        navigate('/signUp');
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [navigate]);

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('Referral code copied to clipboard!');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signUp');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="profile">
        {user ? (
          <div className="profile__info">
            <p>Email: {user.email}</p>
            <p>UID: {user.uid}</p>
            <p>Money: ${user.money}</p>
            <p>
              Referral Code: {user.referralCode}{' '}
              <button className="profile__copy-button" onClick={handleCopyReferralCode}>
                Copy
              </button>
            </p>
            <button className="profile__logout-button" onClick={handleLogout}>
              Log Out
            </button>
            <stripe-pricing-table 
              pricing-table-id="prctbl_REPLACEME"
              publishable-key="pk_test_REPLACEME"
              client-reference-id={user.uid}
            >
            </stripe-pricing-table>
          </div>
        ) : (
          <div>No profile found. Redirecting to sign up...</div>
        )}
      </div>
    </div>
  );
}

export default Profile;