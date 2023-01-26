import { useState } from "react";
import defaultImage from "../assets/radio.png";

const List = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [stationName, setStationName] = useState("");

  const radioSelect = (event) => {
    event.preventDefault();

    props.sendToRadio(event.target.value);
    props.sendToRadioName(event.target.id);

    setRadioUrl(event.target.value);
    setStationName(event.target.id);
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
                  radioUrl === stationDetails.urlResolved
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
                      radioUrl === stationDetails.urlResolved
                        ? "infoButtonPlaying"
                        : "infoButton"
                    }
                    value={stationDetails.urlResolved}
                    onClick={radioSelect}
                    id={stationDetails.name}
                  >
                    {radioUrl === stationDetails.urlResolved ? "" : "▶"}
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
