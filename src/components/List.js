import { useState, useEffect } from "react";
import defaultImage from "../assets/radio.png";

const List = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [stationName, setStationName] = useState("");
  const [favicon, setFavicon] = useState("");

    useEffect(() => {
      for (let i = 0; i < props.stations.length; i++) {
        if (props.stations[i].urlResolved === radioUrl) {
          let imageGrab = props.stations[i].favicon;

          if (imageGrab === "") {
            setFavicon(defaultImage);
          } else {
            setFavicon(imageGrab);
          }
          props.sendImage(imageGrab);
        }
      }
    }, [radioUrl]);

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

     const randomStation = () => {
       const randomizer = (min = 0, max = props.stations.length) => {
         return Math.floor(Math.random() * (max - min + 1)) + min;
       };

       let surpriseStation = props.stations[randomizer()];

       setRadioUrl(surpriseStation.urlResolved);
       setStationName(surpriseStation.name);
       props.sendToRadio(surpriseStation.urlResolved);
       props.sendToRadioName(surpriseStation.name);
     };

  return (
    <div className="stationList">
      <label htmlFor="number">Show results:</label>
      <select name="number" id="filterNum" onChange={filterResNum} value="--">
        <option disabled>--</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="300">All</option>
      </select>
      <button onClick={randomStation}>Select a random station</button>
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
