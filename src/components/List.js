import { useState, useEffect } from "react";
import defaultImage from "../assets/radio.png";

const List = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [stationName, setStationName] = useState("");
  const [favicon, setFavicon] = useState("");

  const [filterTrue, setFilterTrue] = useState(false);
  const [filteredStations, setFilteredStations] = useState([]);

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
  }, [radioUrl, props.stations, filterTrue]);

  const radioSelect = (event) => {
    event.preventDefault();

    props.sendToRadio(event.target.value);
    props.sendToRadioName(event.target.id);

    setRadioUrl(event.target.value);
    setStationName(event.target.id);
  };

  const grabFilter = (event) => {
    console.log(event.target.value);

    console.log(props.stations.length);

    const randomizer = (min = 0, max = props.stations.length) => {
      let base = Math.floor(Math.random() * (max - min + 1)) + min;
      let limit = base + parseInt(event.target.value);

      if (event.target.value > props.stations.length) {
        let bottom = 0;
        let top = props.stations.length;

        setFilteredStations(props.stations.slice(bottom, parseInt(top)));
        setFilterTrue(true);
      } else if (limit > props.stations.length) {
        let diff = limit - props.stations.length;
        let newBase = base - diff;
        let newLimit = newBase + event.target.value;

        setFilteredStations(props.stations.slice(newBase, newLimit));
        setFilterTrue(true);
      } else {
        setFilterTrue(true);
        setFilteredStations(props.stations.slice(base, limit));
      }
    };

    randomizer();
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
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
      <h3>
        returned {filterTrue ? filteredStations.length : props.stations.length}{" "}
        stations matching {props.selectedGenre}
      </h3>
      <label htmlFor="number">Show results:</label>
      <select name="number" id="filterNum" onChange={grabFilter} value="--">
        <option disabled>--</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="300">All</option>
      </select>
      <button onClick={randomStation}>Select a random station</button>
      {filterTrue
        ? filteredStations.map((stationDetails) => {
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
                  <p className="stationName">
                    {stationDetails.name
                      .replace(/_/g, "")
                      .replace(/-/g, " ")
                      .replace(/  +/, " ")
                      .replace(/\//g, "")}
                  </p>
                  <p className="stationCountry">
                    {stationDetails.state !== ""
                      ? `${stationDetails.state}, `
                      : null}{" "}
                    {stationDetails.country === "The United States Of America"
                      ? "USA"
                      : stationDetails.country}
                  </p>
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
        : props.stations.map((stationDetails) => {
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
                  <p className="stationName">
                    {stationDetails.name
                      .replace(/_/g, "")
                      .replace(/-/g, " ")
                      .replace(/  +/, " ")
                      .replace(/\//g, "")}
                  </p>
                  <p className="stationCountry">
                    {stationDetails.state !== ""
                      ? `${stationDetails.state}, `
                      : null}
                    {stationDetails.country === "The United States Of America"
                      ? "USA"
                      : stationDetails.country}
                  </p>
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
