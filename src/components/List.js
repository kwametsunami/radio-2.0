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

   const filterResNum = (event) => {
     props.sendToNumFilter(event.target.value);
   };

  return (
    <div className="stationList">
      <label htmlFor="number">Show results:</label>
      <select name="number" id="filterNum" onChange={filterResNum}>
        <option selected="selected" value="250">
          All
        </option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
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
      })}
    </div>
  );
};

export default List;
