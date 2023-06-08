import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

import DashboardLoading from "./DashboardLoading";

import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {
  const [showInfo, setShowInfo] = useState(false);
  const [popularView, setPopularView] = useState(true);
  const [showMobile, setShowMobile] = useState(false);
  const [favStation, setFavStation] = useState([]);

  const infoButton = () => {
    setShowInfo(!showInfo);
  };

  const layoutView = () => {
    setPopularView(!popularView);
  };

  const mobileMenu = () => {
    setShowMobile(!showMobile);
  };

  const playPopular = (event) => {
    const popularStation = event.currentTarget.value;
    const popularStationArr = popularStation.split(",");

    console.log(popularStationArr);

    props.sendToRadio(popularStationArr[0]);
    props.sendToRadioName(popularStationArr[4]);
    props.sendImage(popularStationArr[1]);

    props.latitude(popularStationArr[2]);
    props.longitude(popularStationArr[3]);
  };

  const playFav = (event) => {
    const favStation = event.currentTarget.value;
    const favStationArr = favStation.split(",");

    console.log(favStationArr);

    props.sendToRadio(favStationArr[1]);
    props.sendToRadioName(favStationArr[7]);
    props.sendImage(favStationArr[2]);

    props.latitude(favStationArr[5]);
    props.longitude(favStationArr[6]);
  };

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      // here we're creating a variable to store the new state we want to introduce to our app
      const newState = [];

      // here we store the response from our query to Firebase inside of a variable called data.
      // .val() is a Firebase method that gets us the information we want
      const data = response.val();
      // data is an object, so we iterate through it using a for in loop to access each book name

      for (let key in data) {
        // pushing the values from the object into our newState array
        newState.push({ key: key, data: data[key] });
      }

      const uniqueFav = [];
      const searchedFav = [];

      for (let i = 0; i < newState.length; i++) {
        const favIdKey = newState[i];

        if (!searchedFav[favIdKey.data]) {
          searchedFav[favIdKey.data] = true;
          uniqueFav.push(favIdKey);
        }
      }

      console.log(uniqueFav);

      setFavStation(uniqueFav);
    });
  }, []);

  // this function takes an argument, which is the ID of the book we want to remove
  const removeFav = (favId) => {
    // here we create a reference to the database
    // this time though, instead of pointing at the whole database, we make our dbRef point to the specific node of the book we want to remove
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${favId}`);

    // using the Firebase method remove(), we remove the node specific to the book ID
    remove(dbRef);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
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
                {popularView ? (
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
                                  onClick={playPopular}
                                  value={[
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
                              </div>
                            </div>
                          );
                        })}
                  </div>
                ) : (
                  <div className="favContainer">
                    <h2>your favourited stations</h2>
                    {favStation.map((favStation) => {
                      return (
                        <div className="favItems" key={`${favStation.key}`}>
                          <img
                            src={`${favStation.data[2]}`}
                            alt={`${favStation.data[7]}`}
                            onError={setDefaultSrc}
                          />
                          <div className="favText">
                            <p>
                              {`${favStation.data[7]
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
                              onClick={playFav}
                              value={[
                                `${favStation.data[1]}`,
                                `${favStation.data[2]}`,
                                `${favStation.data[3]}`,
                                `${favStation.data[4]}`,
                                `${favStation.data[5]}`,
                                `${favStation.data[6]}`,
                                `${favStation.data[7]}`,
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
                  <button className="dashLogin">login</button>
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
            {popularView ? (
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
                              onClick={playPopular}
                              value={[
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
                          </div>
                        </div>
                      );
                    })}
              </div>
            ) : (
              <div className="favContainer">
                <h2 className="favTitleTotal">
                  your
                  <span id="favouriteTitle">
                    {" "}
                    <br />
                    favourites
                  </span>
                </h2>
                {favStation.map((favStation) => {
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
                        alt={`${favStation.data[7]}`}
                        onError={setDefaultSrc}
                      />
                      <div className="favText">
                        <p className="favTextTitle">{`${favStation.data[7]
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
                          onClick={playFav}
                          value={[
                            `${favStation.data[0]}`,
                            `${favStation.data[1]}`,
                            `${favStation.data[2]}`,
                            `${favStation.data[3]}`,
                            `${favStation.data[4]}`,
                            `${favStation.data[5]}`,
                            `${favStation.data[6]}`,
                            `${favStation.data[7]}`,
                          ]}
                        >
                          {props.stationUrl === favStation.data[1] ? "" : "▶"}
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
              props.stationUrl === "" ? "infoContainerBottom" : "infoContainer"
            }
          >
            <div className="infoButtons">
              {/* <button className="dashLogin">login</button> */}
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
