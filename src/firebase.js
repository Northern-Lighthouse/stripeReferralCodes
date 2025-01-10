import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACEME",
  authDomain: "REPLACEME",
  projectId: "REPLACEME",
  storageBucket: "REPLACEME",
  messagingSenderId: "REPLACEME",
  appId: "REPLACEME",
  measurementId: "G-REPLACEME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export const signUpWithEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const referralCode = generateReferralCode(); // Implement this function to generate a referral code
  
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        uid: user.uid,
        money: 20,
        referralCode: referralCode
      });

      await fetch("https://REPLACEME.app", {
        method: "POST",
        mode: 'no-cors',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `uid=${encodeURIComponent(user.uid)}`
      })
  
      console.log("User signed up and document created in Firestore");
    } catch (error) {
      console.error("Error signing up with email and password", error);
    }
  };
  
  const generateReferralCode = () => {
    // Simple referral code generator (you can improve this)
    return Math.random().toString(36).substring(2, 10);
  };