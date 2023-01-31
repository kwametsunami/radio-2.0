import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase'

const SignUpTest = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({})

  useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
      })
  }, [])


  const register = async () => {
    try {
        const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        console.log(user)
    } catch (error) {
        console.log(error.message)
    }
  };

  const login = async () => {    try {
    const user = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    console.log(user);
  } catch (error) {
    console.log(error.message);
  }};

  const logout = async () => {
await signOut(auth)
  };

    return (
      <div className="test">
          <h1>register</h1>
          <input
            type="text"
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
          <button onClick={register}>create user</button>
          <h1>login</h1>
          <input
            type="text"
            placeholder="email"
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
          />
          <button onClick={login}>log in</button>

          <h1>user logged in: </h1>
          {user?.email}
        <button onClick={logout}>log out</button>
      </div>
    );
}

export default SignUpTest