import { Link } from "react-router-dom";

const About = () => {
  return (
    <section>
        <nav>
        <Link to="/">
        <h2>logo</h2>
        </Link>
        <Link to="Signup">
        <h2>sign up</h2>
        </Link>
        <Link to="/Login">
        <h2>login</h2>
        </Link>
        </nav>

      <div>
        <Link to="/">
          <h3>home</h3>
        </Link>
        <h1>What is International Radio?</h1>
        <p>
          Vibecession meditation keffiyeh iceland narwhal. Offal heirloom
          bitters, bicycle rights listicle post-ironic vice green juice cliche
          vegan narwhal schlitz banh mi. Vexillologist tofu church-key brunch
          woke. Whatever everyday carry DSA meditation vice paleo 3 wolf moon
          skateboard williamsburg fingerstache YOLO butcher deep v taiyaki small
          batch. Cred pabst fixie stumptown thundercats asymmetrical synth.
          Thundercats authentic iPhone subway tile praxis, hashtag craft beer
          iceland echo park. Normcore tumeric kale chips vexillologist heirloom.
          Austin lomo taxidermy readymade direct trade affogato, asymmetrical
          ascot bushwick chicharrones pour-over enamel pin dreamcatcher
          heirloom. Polaroid asymmetrical prism before they sold out aesthetic
          pickled sriracha four dollar toast glossier yuccie af messenger bag.
          DIY adaptogen williamsburg gochujang mustache. Unicorn gatekeep
          mustache selvage tonx, viral big mood hexagon cliche disrupt tousled
          chambray gochujang portland. Listicle mlkshk YOLO, selvage hoodie tofu
          tilde brunch tacos 8-bit. Selvage everyday carry edison bulb banjo
          church-key try-hard ethical knausgaard ramps yes plz 90's irony raw
          denim mumblecore 3 wolf moon. Pop-up intelligentsia snackwave, flannel
          stumptown twee bespoke roof party tumblr. Vinyl ennui shabby chic
          chillwave four loko. Godard farm-to-table craft beer helvetica
          gastropub neutra disrupt pabst locavore tousled marfa blog mixtape
          knausgaard kogi. You probably haven't heard of them prism portland
          tumeric put a bird on it ethical typewriter. Mixtape chicharrones blue
          bottle bushwick, messenger bag banh mi sriracha chillwave big mood
          cornhole. Tacos chillwave food truck, VHS disrupt artisan raclette
          salvia street art sriracha single-origin coffee yuccie chicharrones
          williamsburg craft beer. Kombucha edison bulb cloud bread kinfolk
          marfa art party green juice austin chartreuse tacos XOXO. Dummy text?
          More like dummy thicc text, amirite?
        </p>
      </div>
    </section>
  );
};

export default About;
