import Footer from "./Footer";
import { Link } from "react-router-dom";

const Signup = () => {
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
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <p className="loginText">
            Have an account? Log in
            <Link to="/Login"> here</Link>
          </p>
          <button className="signupButton">continue</button>
        </form>
      </div>
      <Footer></Footer>
    </section>
  );
};

export default Signup;
