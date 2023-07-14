// firebase imports
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";

// react
import { useEffect, useState } from "react";

// image assets
import googleLogo from "../assets/social/googleLogo.png";

// components
import LoginLoading from "./LoginLoading";
import SignedUp from "./SignedUp";

// npms
import FadeIn from "react-fade-in/lib/FadeIn";

const Login = (props) => {
  // states
  // register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // saved user information
  const [user, setUser] = useState({});
  const [usersName, setUsersName] = useState("");

  // mobile
  const [mobile, setMobile] = useState(false);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  // switch forms
  const [loginForm, setLoginForm] = useState(true);

  // check if mobile device
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    if (window.innerWidth < 680) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);

  // sign in with Google logic
  const googleProvider = new GoogleAuthProvider();

  ///////////////////////////////////////////////////////////////////////// sign in -- google
  const signInWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider);
      let string = user.user.displayName;
      let splitString = string.split(" ");
      let splitWithSpace = " " + splitString[0];

      setUsersName(splitWithSpace);

      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setLoginError(false);
        setLoginSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        setLoginError(false);
        setLoginSuccess(true);
        props.setUser(user);
        props.setHideFooter(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {}
  };

  ///////////////////////////////////////////////////////////////////////// register -- google
  const signUpWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider);

      // get name from google login to welcome user
      let string = user.user.displayName;
      let splitString = string.split(" ");
      let splitWithSpace = " " + splitString[0];

      setUsersName(splitWithSpace);
      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        props.setUser(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {}
  };

  ///////////////////////////////////////////////////////////////////////// login -- email auth
  const login = async (event) => {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setLoginError(false);
        setLoginSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        setLoginError(false);
        setLoginSuccess(true);
        props.setUser(user);
        props.setHideFooter(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {
      setLoginError(true);
      setLoginPassword("");
      console.log(error);
    }
  };

  // check if user information has changed
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  ///////////////////////////////////////////////////////////////////////// register -- email auth
  const register = async (event) => {
    event.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        props.setUser(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {
      setRegisterError(true);
      setRegisterEmail("");
      setRegisterPassword("");
    }
  };

  // onClick -- switch from login to signUp and vice versa

  const switchForms = (event) => {
    event.preventDefault();

    setLoginForm(!loginForm);
  };

  return (
    <section className="login">
      {registerSuccess ? (
        <SignedUp usersName={usersName} />
      ) : loginSuccess ? (
        <LoginLoading usersName={usersName} />
      ) : (
        <div className="loginSectionContainer">
          <nav className="loginNav">
            <button className="returnToSearch" onClick={props.landingView}>
              <h1 className="title">tr-1.fm</h1>
            </button>
          </nav>
          {loginForm ? (
            //////////////////////////////////////////////////////////////////// login
            <FadeIn className="loginFadeIn">
              <div className="loginContainer">
                <h2>
                  <span id="highlight">log in </span>to your account
                </h2>
                <form className="loginForm" onSubmit={login}>
                  <input
                    type="email"
                    placeholder="email"
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                    }}
                    className={loginError ? "loginError" : null}
                    required
                  />
                  <input
                    type="password"
                    placeholder="password"
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                    }}
                    value={loginPassword}
                    className={loginError ? "loginError" : null}
                    required
                  />
                  {loginError ? (
                    <p id="loginError">
                      Hmmm looks like your email or password is incorrect.{" "}
                      <br /> Please try again.
                    </p>
                  ) : null}
                  <p className="signUpText">
                    Not registered? Sign up{" "}
                    <button
                      className="signUpButton"
                      onClick={switchForms}
                      type="button"
                    >
                      here
                    </button>
                  </p>
                  <div className="signUpOptions">
                    <button
                      className="loginButton"
                      type="submit"
                      onClick={login}
                    >
                      login
                    </button>
                    <h3>or</h3>
                    <button
                      className="googleLoginButton"
                      onClick={signInWithGoogle}
                    >
                      <img src={googleLogo} alt="Google Logo" />
                      <p>Continue with Google</p>
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          ) : (
            //////////////////////////////////////////////////////////////////// register
            <div className="signUpContainer">
              <h2>
                <span id="highlight">register</span> a new account
              </h2>
              <form className="registerForm" onSubmit={register}>
                <input
                  type="email"
                  placeholder="email"
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                  }}
                  className={registerError ? "registerErrorForm" : ""}
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  onChange={(event) => {
                    setRegisterPassword(event.target.value);
                  }}
                  className={registerError ? "registerErrorForm" : ""}
                  required
                />
                {registerError ? (
                  <p id="registerError">
                    Hmmm looks like that email is already in use. <br /> Please
                    try logging in or signing up with another email.
                  </p>
                ) : null}
                <p className="loginText">
                  Already have an account? Log in{" "}
                  <button
                    className="backToLoginButton"
                    onClick={switchForms}
                    type="button"
                  >
                    here
                  </button>
                </p>
                <div className="signUpOptions">
                  <button className="signUpButton" type="submit">
                    register
                  </button>
                  <h3>or</h3>
                  <button
                    className="googleSignUpButton"
                    onClick={signUpWithGoogle}
                  >
                    <img src={googleLogo} alt="Google Logo" />
                    <p>Sign up with Google</p>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Login;
