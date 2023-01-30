import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import defaultImage from "../assets/radio.png";

import { useState, useEffect } from "react";

const setDefaultAlert = () => {
  alert(
    "Sorry, this station is offline or unavailable in your region. Please select another stream."
  );
};

const setDefaultSrc = (event) => {
  event.target.src = defaultImage;
};

const Player = (props) => {
  const [formattedTitle, setFormattedTitle] = useState("");

  useEffect(() => {
    let ogTitle = props.stationName;
    let format = ogTitle
      .replace(/_/g, "")
      .replace(/-/g, " ")
      .replace(/  +/, " ")
      .replace(/\//g, "");

    setFormattedTitle(format);
  }, [props.stationName]);

  return (
    <section className="radio">
      <div className="radioPlayer">
        <div className="radioInfo">
          <img
            src={props.stationImage}
            alt={props.stationName}
            onError={setDefaultSrc}
          />
          <div className="radioInfoTitleContainer">
            <h3 className="radioInfoTitle">{formattedTitle}</h3>
          </div>
        </div>
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
