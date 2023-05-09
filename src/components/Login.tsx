import { useEffect } from "react";
import { auth } from "../firebase/config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";

import { useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          localStorage.setItem("user-token", authResult.user.accessToken);
          navigate("/");
          return false;
        },
      },
      signInFlow: "popup",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/",
    });
  }, [navigate]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/", { replace: true });
      }
    });
  }, []);

  const signInAsGuest = async () => {
    try {
      const userCredential: any = await signInAnonymously(auth);
      localStorage.setItem("user-token", userCredential.user.accessToken);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="welcome-page">
      <div className="welcome__container">
        <div className="logo welcome-logo">FinTrack</div>
        <p>
          <strong>Welcome to FinTrack!</strong> This app allows you to easily
          track your expenses and income. To proceed, kindly select an
          authentication method to create your account. Your financial tracking
          journey begins with here.
        </p>
        <div id="firebaseui-auth-container" className="text-center">
          <button className="sign-in-anonymous" onClick={signInAsGuest}>
            <BsPerson />
            Continue as Guest
          </button>
        </div>
        <small>
          Please note that if you choose to sign in as a guest, any data entered
          may not be accessible once you close your browser.
        </small>
      </div>
    </main>
  );
};

export default Login;
