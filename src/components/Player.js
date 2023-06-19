import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import firebase from "../firebase";
import { getDatabase, ref, push } from "firebase/database";

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

  const favourite = (event) => {
    event.preventDefault();

    const playerStation = event.currentTarget.value;
    const playerStationArr = playerStation.split(",");

    console.log(playerStationArr);

    const database = getDatabase(firebase);
    const dbRef = ref(database);

    push(dbRef, playerStationArr);
  };

  return (
    <section className="radio">
      <div className="radioPlayer">
        <div className="radioInfo">
          <div className="playingImgContainer">
            <img
              src={props.stationImage}
              alt={props.stationName}
              onError={setDefaultSrc}
              className="playingBlur"
            />
            <img
              src={props.stationImage}
              alt={`${props.stationName}`}
              onError={setDefaultSrc}
              className="playingIcon"
            />
          </div>
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
        <div className="playerFav">
          <button
            className="playerFavBtn"
            onClick={favourite}
            value={[
              `${props.stationKey}`,
              `${props.audioSource}`,
              `${props.stationImage}`,
              `${props.latitude}`,
              `${props.longitude}`,
              `${props.stationName}`,
            ]}
          >
            {props.favKeys.includes(props.stationKey) ? (
              <i className="fa-solid fa-star added"></i>
            ) : (
              <i className="fa-solid fa-star notAdded"></i>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Player;
