import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import defaultImage from "../assets/radio.png";

  const setDefaultAlert = () => {
    alert(
      "Sorry, this station is offline or unavailable in your region. Please select another stream."
    );
  };

    const setDefaultSrc = (event) => {
      event.target.src = defaultImage;
    };
  

const Player = (props) => {

  return (
    <section className="radio">
      <div className="radioPlayer">
        <img
          src={props.stationImage}
          alt={props.stationName}
          onError={setDefaultSrc}
        />
        <h3>{props.stationName}</h3>
        <AudioPlayer
          autoPlay
          layout="horizontal-reverse"
          showJumpControls={false}
          onError={setDefaultAlert}
          src={props.audioSource}
        />
      </div>
    </section>
  );
};

export default Player;
