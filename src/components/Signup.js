import Search from "./Search";
import Footer from "./Footer";
import { Link, redirect } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

const Signup = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [hasRegistered, setHasRegistered] = useState(false);

  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    });
  }, []);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setHasRegistered(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <section className="signUp">
      <nav className="signUpNav">
        <Link to="/">
          <h1 className="title">tr-1.fm</h1>
        </Link>
      </nav>
      <div className="signUpContainer">
        <h2>sign up</h2>
        <form className="signUpForm" action="">
          <input
            type="email"
            placeholder="email"
            onChange={(event) => {
              setRegisterEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(event) => {
              setRegisterPassword(event.target.value);
            }}
          />
          <p className="loginText">
            Have an account? Log in
            <Link to="/Login"> here</Link>
          </p>
          {/* <Link to="/" state={{ user }}> */}
          <button className="signupButton" onClick={register}>continue</button>
          {/* </Link> */}
        </form>
      </div>
      <Footer></Footer>
    </section>
  );
};

export default Signup;
