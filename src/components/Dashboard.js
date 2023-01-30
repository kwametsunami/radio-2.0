import { useState } from "react";
import { Link } from "react-router-dom";

import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const [popularView, setPopularView] = useState(true);

  const infoButton = () => {
    setShowInfo(!showInfo);
  };

  const layoutView = () => {
    setPopularView(!popularView);
  };

  const playPopular = (event) => {
    const popularStation = event.currentTarget.value;
    const popularStationArr = popularStation.split(",");

    props.sendToRadio(popularStationArr[0])
    props.sendToRadioName(popularStationArr[1])
    props.sendImage(popularStationArr[2])
  }

  const favArr = [];

  favArr.push(props.favourites);

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="dashboardContainer">
      <div className="dashboardLogo">
        <Link onClick={props.landingView} to="/">
          <h1>logo</h1>
        </Link>
      </div>
      <div className="middleDashboard">
        {popularView ? (
          <div className="popularView">
            <h2>popular</h2>
            {props.popular.map((stations) => {
              return (
                <div className="popularResults">
                  <img
                    src={`${stations.favicon}`}
                    alt={`${stations.name}`}
                    onError={setDefaultSrc}
                  />
                  <div className="popularText">
                    <p>{`${stations.name
                      .replace(/_/g, "")
                      .replace(/-/g, " ")
                      .replace(/  +/, " ")
                      .replace(/\//g, "")}`}</p>
                    <p>{`${
                      stations.country === "The United States Of America"
                        ? "USA"
                        : stations.country
                    }`}</p>
                  </div>
                  <div className="popularButtons">
                    <button
                      onClick={playPopular}
                      value={[
                        `${stations.urlResolved}`,
                        `${stations.name}`,
                        `${stations.favicon}`,
                      ]}
                    >
                      {props.stationUrl === stations.urlResolved ? "" : "▶"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="favContainer">
            <h1>Your favourited stations</h1>
            {props.favourites.map((favStation) => {
              return (
                <div className="favItems" key={`${favStation.favourite[0]}`}>
                  <img
                    src={`${favStation.favourite[3]}`}
                    onError={setDefaultSrc}
                  />
                  <div className="favText">
                    <p>{`${favStation.favourite[1]}`}</p>
                    <p>{`${favStation.favourite[5]}`}</p>
                  </div>
                  <div className="favButtons">
                    <button value={`${favStation.favourite[2]}`}>▶</button>
                    <button>
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="infoContainer">
        <div className="infoButtons">
          <button>login</button>
          <button onClick={infoButton}>
            <i className="fa-solid fa-circle-info"></i>
          </button>
          <button onClick={layoutView}>
            {popularView ? (
              <i className="fa-solid fa-star"></i>
            ) : (
              <i className="fa-solid fa-chart-simple"></i>
            )}
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
