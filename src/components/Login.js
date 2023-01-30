import { Link } from "react-router-dom";

import Footer from "./Footer";

const Login = (props) => {
  return (
    <section className="login">
      <nav className="loginNav">
          <Link to="/">
            <h1 className="title">tr-1.fm</h1>
          </Link>
      </nav>
      <div className="loginContainer">
        <h2>sign into your account</h2>
        <form className="loginForm" action="">
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <p className="signUpText">
            Not registered? Sign up
            <Link to="/signup"> here</Link>
          </p>

          <button className="loginButton">login</button>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default Login;
