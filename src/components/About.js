import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="about">
      <nav className="aboutNav">
        <Link to="/">
          <h2 className="aboutLogo">tr1-fm</h2>
        </Link>
        <div className="aboutLogin">
          <Link to="Signup">
            <button className="signUpAbout">register</button>
          </Link>
          <Link to="/Login">
            <button className="logInAbout">log in</button>
          </Link>
        </div>
      </nav>

      <div className="aboutContent wrapper">
        <h2 className="aboutTitle">what is tr1-fm?</h2>
        <p>
          tr-1.fm (pronounced tee-arr-one-ef-em) is a website that allows you to
          listen to stations across the world. Simply type in any genre, decade,
          or language, and instantly gather radio stations to play. It's your
          choice between a map or a list of results, whichever route you go,
          you'll be jamming out in no time.
        </p>
        <p>
          The name tr-1.fm is based on the legendary{" "}
          <a href="https://en.wikipedia.org/wiki/Regency_TR-1" target="_blank" rel="noreferrer">Regency TR-1</a> which was the first commercially manufactured transistor radio, completely changing the game for hand held devices, leading into a future of portability and changing our relationship with our technology. Listen on your computer, mobile device, or tablet, tr-1.fm goes with you.   
        </p>
        <p>
          tr-1.fm is based on the community assembled{" "}
          <a
            href="https://at1.api.radio-browser.info/"
            target="_blank"
            rel="noreferrer"
          >
            radio-browser API
          </a>
          , that's amazed a database of over 35,000 stations across the globe,
          ranging from high quality coorporate stations to college and amateur
          ones, each with songs, and stories to tell.
        </p>
        <Link to="/">
          <button className="aboutGetStarted">Get Started</button>
        </Link>
      </div>
    </section>
  );
};

export default About;
