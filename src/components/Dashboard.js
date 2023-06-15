import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import { getDatabase, ref, push } from "firebase/database";

import DashboardLoading from "./DashboardLoading";

import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const [popularView, setPopularView] = useState(1);
  const [recentView, setRecentView] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const infoButton = () => {
    setShowInfo(!showInfo);
  };

  const favView = () => {
    setPopularView(2);
    setRecentView(false);
  };

  const chartView = () => {
    setPopularView(1);
    setRecentView(false);
  };

  const showRecent = () => {
    setRecentView(true);
    setPopularView(0);
  };

  const mobileMenu = () => {
    setShowMobile(!showMobile);
  };

  const playStation = (event) => {
    event.preventDefault();

    const dashboardStation = event.currentTarget.value;
    const dashboardStationArr = dashboardStation.split(",");

    props.sendToRadio(dashboardStationArr[1]);
    props.sendToRadioName(dashboardStationArr[5]);
    props.sendImage(dashboardStationArr[2]);

    props.latitude(dashboardStationArr[3]);
    props.longitude(dashboardStationArr[4]);

    props.addToRecent(dashboardStationArr);
  };

  const recentPlayStation = (event) => {
    event.preventDefault();

    const dashboardStation = event.currentTarget.value;
    const dashboardStationArr = dashboardStation.split(",");

    props.sendToRadio(dashboardStationArr[1]);
    props.sendToRadioName(dashboardStationArr[5]);
    props.sendImage(dashboardStationArr[2]);

    props.latitude(dashboardStationArr[3]);
    props.longitude(dashboardStationArr[4]);
  };

  const favourite = (event) => {
    const stationFav = event.currentTarget.value;
    const stationFavArr = stationFav.split(",");

    const database = getDatabase(firebase);
    const dbRef = ref(database);

    push(dbRef, stationFavArr);

    setPopularView(false);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      {props.mobile ? (
        <div className="dashboardContainerMobile">
          <div className="hamburgerMenu">
            {showMobile ? (
              <button className="hamburgerX" onClick={mobileMenu}>
                <i className="fa-solid fa-caret-left"></i>
              </button>
            ) : (
              <button className="hamburger" onClick={mobileMenu}>
                <i className="fa-solid fa-bars"></i>
              </button>
            )}
          </div>
          {showMobile ? (
            <div className="dashboardPopOut">
              <div className="dashboardLogo">
                <Link onClick={props.landingView} to="/">
                  <h2>tr-1.fm</h2>
                </Link>
              </div>
              <div className="middleDashboard">
                {recentView ? (
                  <div>
                    <h2>recent view</h2>
                  </div>
                ) : popularView ? (
                  <div className="popularView">
                    {!props.dashboardLoading ? (
                      props.badSearch ? null : (
                        <h2 id="popularTitle">
                          top{" "}
                          <span id="popularSearchTerm">{props.genreName} </span>
                          stations
                        </h2>
                      )
                    ) : null}
                    {props.dashboardLoading ? <DashboardLoading /> : null}
                    {props.dashboardLoading
                      ? null
                      : props.popular.map((stations) => {
                          return (
                            <div
                              className={
                                props.stationUrl === stations.url_resolved
                                  ? "popularResultsPlaying"
                                  : "popularResults"
                              }
                              key={`${stations.changeuuid}`}
                            >
                              <img
                                src={`${stations.favicon}`}
                                alt={`${stations.name}`}
                                onError={setDefaultSrc}
                              />
                              <div className="popularText">
                                <p className="popularTextTitle">{`${stations.name
                                  .replace(/_/g, "")
                                  .replace(/-/g, " ")
                                  .replace(/  +/, " ")
                                  .replace(/\//g, "")}`}</p>
                              </div>
                              <div className="popularButtons">
                                <button
                                  className={
                                    props.stationUrl === stations.url_resolved
                                      ? "popularButtonPlaying"
                                      : "popularButton"
                                  }
                                  onClick={playStation}
                                  value={[
                                    `${stations.changeuuid}`,
                                    `${stations.url_resolved}`,
                                    `${stations.favicon}`,
                                    `${stations.geo_lat}`,
                                    `${stations.geo_long}`,
                                    `${stations.name}`,
                                  ]}
                                >
                                  {props.stationUrl === stations.url_resolved
                                    ? ""
                                    : "▶"}
                                </button>
                                <button
                                  className="addFav"
                                  value={[
                                    `${stations.changeuuid}`,
                                    `${stations.url_resolved}`,
                                    `${stations.favicon}`,
                                    `${stations.geo_lat}`,
                                    `${stations.geo_long}`,
                                    `${stations.name}`,
                                  ]}
                                >
                                  <i className="fa-solid fa-star"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                ) : (
                  <div className="favContainer">
                    <h2>your favourited stations</h2>
                    {props.testArr.map((favStation) => {
                      return (
                        <div className="favItems" key={`${favStation.key}`}>
                          <img
                            src={`${favStation.data[2]}`}
                            alt={`${favStation.data[5]}`}
                            onError={setDefaultSrc}
                          />
                          <div className="favText">
                            <p>
                              {`${favStation.data[5]
                                .replace(/_/g, "")
                                .replace(/-/g, " ")
                                .replace(/  +/, " ")
                                .replace(/\//g, "")}`}
                            </p>
                          </div>
                          <div className="favButtons">
                            <button
                              className={
                                props.stationUrl === favStation.data[1]
                                  ? "favButtonPlaying"
                                  : "favButton"
                              }
                              onClick={playStation}
                              value={[
                                `${favStation.data[0]}`,
                                `${favStation.data[1]}`,
                                `${favStation.data[2]}`,
                                `${favStation.data[3]}`,
                                `${favStation.data[4]}`,
                                `${favStation.data[5]}`,
                              ]}
                            >
                              {props.stationUrl === favStation.data[1]
                                ? ""
                                : "▶"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div
                className={
                  props.stationUrl === ""
                    ? "infoContainerBottom"
                    : "infoContainer"
                }
              >
                <div className="infoButtons">
                  <button onClick={chartView}>
                    <i className="fa-solid fa-chart-simple"></i>
                  </button>
                  <button onClick={showRecent}>
                    <i class="fa-solid fa-clock-rotate-left"></i>
                  </button>
                  <button onClick={favView}>
                    <i className="fa-solid fa-star"></i>
                  </button>
                  <button onClick={infoButton}>
                    <i className="fa-solid fa-circle-info"></i>
                  </button>
                </div>
                {showInfo ? (
                  <div className="instructions">
                    <button className="infoButton" onClick={infoButton}>
                      <i className="fa-solid fa-window-minimize"></i>
                    </button>
                    <p>
                      Click on a marker to get more information on the station.
                      If you like what you see hit play!
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="dashboardContainer">
          <div className="dashboardLogo">
            <Link onClick={props.landingView} to="/">
              <h2>tr-1.fm</h2>
            </Link>
          </div>
          <div className="middleDashboard">
            {recentView ? (
              <div className="recentContainer">
                <h2>
                  <span id="recentTitle">recently </span>played
                </h2>
                <div className="recentContainerContainer">
                  {props.recentStations.map((recent) => {
                    return (
                      <div
                        className={
                          props.stationUrl === recent[1]
                            ? "recentItemsPlaying"
                            : "recentItems"
                        }
                        key={`${recent[0]}`}
                      >
                        <img
                          src={`${recent[2]}`}
                          alt={`${recent[5]}`}
                          onError={setDefaultSrc}
                        />
                        <div className="recentItemsText">
                          <p className="recentTextTitle">
                            {`${recent[5]
                              .replace(/_/g, "")
                              .replace(/-/g, " ")
                              .replace(/  +/, " ")
                              .replace(/\//g, "")}`}
                          </p>
                        </div>
                        <div className="recentItemsButton">
                          <button
                            className={
                              props.stationUrl === recent[1]
                                ? "recentButtonPlaying"
                                : "recentButton"
                            }
                            onClick={recentPlayStation}
                            value={[
                              `${recent[0]}`,
                              `${recent[1]}`,
                              `${recent[2]}`,
                              `${recent[3]}`,
                              `${recent[4]}`,
                              `${recent[5]}`,
                            ]}
                          >
                            {props.stationUrl === recent[1] ? (
                              ""
                            ) : (
                              <i className="fa-solid fa-play"></i>
                            )}
                          </button>
                          {props.favKeys.includes(`${recent[0]}`) ? (
                            <button class="added">
                              <i className="fa-solid fa-star alreadyAdded"></i>
                            </button>
                          ) : (
                            <button
                              className="recentAddFav"
                              onClick={favourite}
                              value={[
                                `${recent[0]}`,
                                `${recent[1]}`,
                                `${recent[2]}`,
                                `${recent[3]}`,
                                `${recent[4]}`,
                                `${recent[5]}`,
                              ]}
                            >
                              <i className="fa-regular fa-star"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : popularView === 1 ? (
              <div className="popularView">
                {!props.dashboardLoading ? (
                  props.badSearch ? null : (
                    <h2 id="popularTitle">
                      top <span id="popularSearchTerm">{props.genreName} </span>
                      stations
                    </h2>
                  )
                ) : null}
                {props.dashboardLoading ? <DashboardLoading /> : null}
                <div className="popularContainerContainer">
                  {props.dashboardLoading
                    ? null
                    : props.popular.map((stations) => {
                        return (
                          <div
                            className={
                              props.stationUrl === stations.url_resolved
                                ? "popularResultsPlaying"
                                : "popularResults"
                            }
                            key={`${stations.changeuuid}`}
                          >
                            <img
                              src={`${stations.favicon}`}
                              alt={`${stations.name}`}
                              onError={setDefaultSrc}
                            />
                            <div className="popularText">
                              <p className="popularTextTitle">{`${stations.name
                                .replace(/_/g, "")
                                .replace(/-/g, " ")
                                .replace(/  +/, " ")
                                .replace(/\//g, "")}`}</p>
                            </div>
                            <div className="popularButtons">
                              <button
                                className={
                                  props.stationUrl === stations.url_resolved
                                    ? "popularButtonPlaying"
                                    : "popularButton"
                                }
                                onClick={playStation}
                                value={[
                                  `${stations.changeuuid}`,
                                  `${stations.url_resolved}`,
                                  `${stations.favicon}`,
                                  `${stations.geo_lat}`,
                                  `${stations.geo_long}`,
                                  `${stations.name}`,
                                ]}
                              >
                                {props.stationUrl === stations.url_resolved ? (
                                  ""
                                ) : (
                                  <i className="fa-solid fa-play"></i>
                                )}
                              </button>
                              {props.favKeys.includes(
                                `${stations.changeuuid}`
                              ) ? (
                                <button class="added">
                                  <i className="fa-solid fa-star alreadyAdded"></i>
                                </button>
                              ) : (
                                <button
                                  className="addFav"
                                  onClick={favourite}
                                  value={[
                                    `${stations.changeuuid}`,
                                    `${stations.url_resolved}`,
                                    `${stations.favicon}`,
                                    `${stations.geo_lat}`,
                                    `${stations.geo_long}`,
                                    `${stations.name}`,
                                  ]}
                                >
                                  <i className="fa-regular fa-star"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>
            ) : (
              <div className="favContainer">
                <h2 className="favTitleTotal">
                  your
                  <span id="favouriteTitle"> favourites</span>
                </h2>
                <div
                  className={`favContainerContainer ${
                    isHovered ? "hovered" : ""
                  }`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="scrollableContent">
                    {props.testArr.map((favStation) => {
                      return (
                        <div
                          className={
                            props.stationUrl === favStation.data[1]
                              ? "favItemsPlaying"
                              : "favItems"
                          }
                          key={`${favStation.key}`}
                        >
                          <img
                            src={`${favStation.data[2]}`}
                            alt={`${favStation.data[5]}`}
                            onError={setDefaultSrc}
                          />
                          <div className="favText">
                            <p className="favTextTitle">{`${favStation.data[5]
                              .replace(/_/g, "")
                              .replace(/-/g, " ")
                              .replace(/  +/, " ")
                              .replace(/\//g, "")}`}</p>
                          </div>
                          <div className="favButtons">
                            <button
                              className={
                                props.stationUrl === favStation.data[1]
                                  ? "favButtonPlaying"
                                  : "favButton"
                              }
                              onClick={playStation}
                              value={[
                                `${favStation.data[0]}`,
                                `${favStation.data[1]}`,
                                `${favStation.data[2]}`,
                                `${favStation.data[3]}`,
                                `${favStation.data[4]}`,
                                `${favStation.data[5]}`,
                              ]}
                            >
                              {props.stationUrl === favStation.data[1] ? (
                                ""
                              ) : (
                                <i className="fa-solid fa-play"></i>
                              )}
                            </button>
                            <button
                              className="removeFav"
                              onClick={() => props.removeFav(favStation.key)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className={
              props.stationUrl === "" ? "infoContainerBottom" : "infoContainer"
            }
          >
            <div className="infoButtons">
              {/* <button className="dashLogin">login</button> */}
              <button
                onClick={chartView}
                id={popularView === 1 ? "selectedPopularBtn" : ""}
              >
                <i
                  className="fa-solid fa-chart-simple"
                  id={popularView === 1 ? "selectedPopular" : ""}
                ></i>
              </button>
              <button
                onClick={showRecent}
                id={recentView ? "selectedRecentBtn" : ""}
              >
                <i
                  className="fa-solid fa-clock-rotate-left"
                  id={recentView ? "selectedRecent" : ""}
                ></i>
              </button>
              <button
                onClick={favView}
                id={popularView === 2 ? "selectedFavsBtn" : ""}
              >
                <i
                  className="fa-solid fa-star"
                  id={popularView === 2 ? "selectedFavs" : ""}
                ></i>
              </button>
              <button onClick={infoButton}>
                <i className="fa-solid fa-circle-info"></i>
              </button>
            </div>
            {showInfo ? (
              <div className="instructions">
                <button className="infoButton" onClick={infoButton}>
                  <i className="fa-solid fa-window-minimize"></i>
                </button>
                <p>
                  Click on a marker to get more information on the station. If
                  you like what you see hit play!
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
