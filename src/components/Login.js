import { useState } from "react";
import { Link } from "react-router-dom";

const Login = (props) => {
  return (
    <div>
      {props.showModal ? (
        <button onClick={props.showModal}>close</button>
      ) : (
        <Link to="/">
          <h2>logo</h2>
        </Link>
      )}
      <h2>sign into your account</h2>
      <form action="">
        <input type="email" placeholder="email" />
        <input type="password" placeholder="password" />
        <p>
          Not registered? sign up
          <Link to="/signup">here</Link>
        </p>

        <button>login!</button>
      </form>
    </div>
  );
};

export default Login;
