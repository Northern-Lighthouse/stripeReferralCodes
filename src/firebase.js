// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Replace this with your Firebase project configuration
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // set document in firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            uid: user.uid,
            money: 20
        })
        // fetch function to create stripe referral code
        await fetch("https://REPLACEME", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `uid=${encodeURIComponent(user.uid)}`
        })

        return user
 
    } catch(error){
        console.log(error)
        throw error
    }
}

export const logout = async () => {
    try {
        await signOut(auth)
    } catch(error){
        console.log(error)
        throw error
    }
}