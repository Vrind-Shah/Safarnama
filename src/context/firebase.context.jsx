import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendSignInLinkToEmail,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut,
} from "firebase/auth";

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "safarnama-c075f.firebaseapp.com",
    projectId: "safarnama-c075f",
    storageBucket: "safarnama-c075f.appspot.com",
    messagingSenderId: "813604453737",
    appId: "1:813604453737:web:1feb3dc008d28e52c0d1f8",
    measurementId: "G-Y27FSW4K5D",
};

const FirebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(FirebaseApp);
const FirebaseAuth = getAuth(FirebaseApp);
const googleAuth = new GoogleAuthProvider();

export const useFirebase = () => useContext(FirebaseContext);

const actionCodeSettings = {
    url: 'http://localhost:3000/',
    // This must be true.
    handleCodeInApp: true,
};


export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(FirebaseAuth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [])

    const signInWithGoogle = () => signInWithPopup(FirebaseAuth, googleAuth);

    const singInWithEmailLink = (email) =>
        sendSignInLinkToEmail(FirebaseAuth, email, actionCodeSettings)
            .then(() => {
                window.localStorage.setItem('emailForSignIn', email);
                console.log("mail sent")
                setUser(user)
            })
            .catch((e) => {
                console.log("error info", e.code, e.message,);
            })

    // window.recaptchaVerifier = new RecaptchaVerifier(FirebaseAuth, 'sign-in-button', {
    //     'size': 'invisible',
    //     'callback': (response) => {
    //         // reCAPTCHA solved, allow signInWithPhoneNumber.
    //         // singInWithMobile(mobileNum);

    //     }
    // });

    const appVerifier = window.recaptchaVerifier;

    // const singInWithMobile = (mobileNum) => {
    //     signInWithPhoneNumber(FirebaseAuth, mobileNum, appVerifier)
    //         .then((confirmationResult) => {
    //             // SMS sent. Prompt user to type the code from the message, then sign the
    //             // user in with confirmationResult.confirm(code).
    //             console.log("otp sent ")
    //             window.confirmationResult = confirmationResult;
    //             // ...
    //         }).catch((error) => {
    //             // Error; SMS not sent
    //             // ...
    //             console.log("otp fail ")
    //         });
    // }

    var isLoggedIn = user ? true : false

    const logout = () => {
        signOut(FirebaseAuth).then(() => {
            isLoggedIn = false
            console.log("signout success")
        }).catch((error) => {
            console.log("signout fail")
        });
    }


    return (
        <FirebaseContext.Provider
            value={{
                signInWithGoogle,
                singInWithEmailLink,
                isLoggedIn,
                logout,
                // singInWithMobile,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};
