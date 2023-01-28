import { useState } from "react";

import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {
  const [showInfo, setShowInfo] = useState(false);

  const infoButton = () => {
    setShowInfo(!showInfo)
  }

  const favArr = [];

  favArr.push(props.favouritedStations);

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="dashboardContainer">
      <h1>Your favourited stations</h1>
      {props.favouritedStations.map((favStation) => {
        return (
          <div className="favItems" key={`${favStation.favourite[0]}`}>
            <img src={`${favStation.favourite[3]}`} onError={setDefaultSrc} />
            <p>{`${favStation.favourite[1]}`}</p>
            <p>{`${favStation.favourite[5]}`}</p>
            <button value={`${favStation.favourite[2]}`}>play</button>
          </div>
        );
      })}
      <div className="infoContainer">
        <div className="infoButtons">
          <h2>login</h2>
          <button onClick={infoButton}>
            <i class="fa-solid fa-circle-info"></i>
          </button>
        </div>
        {showInfo ? (
          <div className="instructions">
            <button onClick={infoButton}>
              <i class="fa-solid fa-window-minimize"></i>
            </button>
            <p>
              Click on a marker to get more information on the station. If you
              like what you see hit play!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
