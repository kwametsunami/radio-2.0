import { useState } from "react";
import defaultImage from "../assets/radio.png";

const List = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const radioSelect = (event) => {
    event.preventDefault();
    props.sendToRadio(event.target.value);
    setRadioUrl(event.target.value);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="stationList">
        {props.stations.map((stationDetails) => {
            return (
              <div
                className={
                  radioUrl === stationDetails.url
                    ? "stationInfoPlaying"
                    : "stationInfo"
                }
                key={stationDetails.id}
              >
                <div className="image">
                  <img
                    src={stationDetails.favicon}
                    alt={stationDetails.name}
                    className="icon"
                    onError={setDefaultSrc}
                  />
                </div>

                <div className="information">
                  <p className="stationName">{stationDetails.name}</p>
                  <p className="stationCountry">{stationDetails.country}</p>
                  <p>{stationDetails.bitrate}</p>
                </div>

                <div className="buttonContainer" value={stationDetails}>
                  <button
                    className={
                      radioUrl === stationDetails.url
                        ? "infoButtonPlaying"
                        : "infoButton"
                    }
                    value={stationDetails.url}
                    onClick={radioSelect}
                  >
                    {radioUrl === stationDetails.url ? "" : "▶"}
                  </button>
                </div>
              </div>
            );
        })
        }
    </div>
  )
};

export default List;
