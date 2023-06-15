import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import firebase from "../firebase";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

import Loading from "./Loading";
import Dashboard from "./Dashboard";
import Map from "./Map";
import List from "./List";
import Player from "./Player";

const list = require("../data/genreData.json");
const stationsList = require("../data/stations.json");

let geoFilter = [];

for (let geo in stationsList) {
  if (stationsList[geo].geo_lat != null) {
    geoFilter.push(stationsList[geo]);
  }
}

const coordinateCounts = {};

geoFilter.forEach((station) => {
  const coordinateKey = `${station.geo_lat},${station.geo_long}`;
  if (coordinateKey in coordinateCounts) {
    const count = coordinateCounts[coordinateKey];
    coordinateCounts[coordinateKey] = count + 1;
    station.geo_lat += 0.00005 * count;
    station.geo_long += 0.00005 * count;
  } else {
    coordinateCounts[coordinateKey] = 1;
  }
});

const Radio = (props) => {
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(props.genre);
  const [listView, setListView] = useState(false);
  const [badSearch, setBadSearch] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
  const [aGenre, setAGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [favStationInfo, setFavStationInfo] = useState([]);
  const [favKeys, setFavKeys] = useState([]);
  const [popular, setPopular] = useState([]);
  const [currentLat, setCurrentLat] = useState("");
  const [currentLong, setCurrentLong] = useState("");
  const [recentStations, setRecentStations] = useState([]);
  const [sendToRecent, setSendToRecent] = useState([]);

  const switchView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    setStationFilter(props.genre);

    let newFilter = [];

    for (let i = 0; i < geoFilter.length; i++) {
      if (geoFilter[i].tags.includes(stationFilter)) {
        newFilter.push(geoFilter[i]);
      }
    }

    newFilter.length = 700;

    let bitrateFilter = [];

    for (let bitrate in newFilter) {
      if (newFilter[bitrate].bitrate >= props.quality) {
        bitrateFilter.push(newFilter[bitrate]);
      }
    }

    const randomGenre = () => {
      const randomizer = (min = 0, max = list.tag.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      const rnd = list.tag[randomizer()].genre;

      setAGenre(rnd);
    };

    randomGenre();

    setDashboardLoading(true);

    let noDup = Array.from(new Set(bitrateFilter.map((item) => item.name))).map(
      (name) => {
        return bitrateFilter.find((item) => item.name === name);
      }
    );

    if (noDup.length > 0) {
      setStations(noDup);
      setBadSearch(false);
      setLoading(false);
      setBadResponse(false);
      setDashboardLoading(false);
    }

    if (noDup.length === 0) {
      setLoading(false);
      setBadSearch(true);
      randomGenre();
      setDashboardLoading(false);
    }

    const sort_by = (field, reverse, primer) => {
      const key = primer
        ? function (x) {
            return primer(x[field]);
          }
        : function (x) {
            return x[field];
          };

      reverse = !reverse ? 1 : -1;

      return function (a, b) {
        return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
      };
    };
    let dataArray = noDup.slice(0, 5);
    setDashboardLoading(false);

    setPopular(dataArray.sort(sort_by("votes", true, parseInt)));
  }, [props.genre, props.quality, stationFilter]);

  const [stationUrl, setStationUrl] = useState("");
  const [playingStation, setPlayingStation] = useState("");
  const [currentIcon, setCurrentIcon] = useState("");

  const sendToRadio = (url) => {
    setStationUrl(url);
  };

  const sendToRadioName = (station) => {
    setPlayingStation(station);
  };

  const sendImage = (favicon) => {
    setCurrentIcon(favicon);
  };

  const setKeys = (keyArray) => {
    setFavKeys(keyArray);
  };

  const setFavs = (fav) => {
    setFavStationInfo(fav);
  };

  const addToRecent = (station) => {
    let matchFound = false;

    if (recentStations.length > 0) {
      for (let i = 0; i < recentStations.length; i++) {
        if (recentStations[i][0] === station[0]) {
          matchFound = true;
          break;
        }
      }
    }

    if (matchFound) {
      const newArr = recentStations.filter((item) => item !== station);
      setRecentStations(newArr);
    } else {
      const updatedStations = recentStations.concat([station]);

      if (updatedStations.length > 7) {
        updatedStations.splice(0, updatedStations.length - 7);
      }

      setRecentStations(updatedStations);
    }
  };

  useEffect(() => {
    const keyToCheck = sendToRecent[0];

    // // if (recentStations.length > 1) {
    // for (let i = 0; i >= recentStations.length; i++) {
    //   if (recentStations[i].includes(keyToCheck)) {
    //     console.log("match");
    //   } else {
    //     console.log("no match");
    //   }
    // }
    // }
  }, [recentStations]);

  const [mobile, setMobile] = useState(false);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    if (window.innerWidth < 680) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);

  const [testArr, setTestArr] = useState([]);
  const [testKeys, setTestKeys] = useState([]);

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
      const newState = [];

      const data = response.val();

      for (let key in data) {
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

      setTestArr(uniqueFav);

      const stationKeys = [];

      for (let i = 0; i < uniqueFav.length; i++) {
        stationKeys.push(uniqueFav[i].data[0]);
      }

      setTestKeys(stationKeys);
    });
  }, []);

  useEffect(() => {
    setKeys(testKeys);

    setFavs(testArr);
  }, [testKeys]);

  const removeFav = (favId) => {
    const database = getDatabase(firebase);
    const dbRef = ref(database, `/${favId}`);

    remove(dbRef);
  };

  return (
    <section className="infoContainer">
      <nav className="searchNav">
        <div className="searchNavContents">
          <form
            className="infoForm"
            autoComplete="off"
            onSubmit={props.onSubmit}
          >
            <input
              className="infoSearch"
              type="text"
              onChange={props.onChange}
              value={props.value}
              onSubmit={props.onSubmit}
              placeholder="search"
              required
            />
            <button className="searchButton">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </nav>
      <div className="radioView">
        <div className={mobile ? "dashboardMobile" : "dashboard"}>
          <Dashboard
            landingView={props.landingView}
            genreName={props.genre}
            favourites={favStationInfo}
            setFavs={setFavs}
            setKeysFunc={setKeys}
            popular={popular}
            sendToRadio={sendToRadio}
            sendToRadioName={sendToRadioName}
            sendImage={sendImage}
            stationUrl={stationUrl}
            dashboardLoading={dashboardLoading}
            badSearch={badSearch}
            latitude={setCurrentLat}
            longitude={setCurrentLong}
            mobile={mobile}
            removeFav={removeFav}
            addToRecent={addToRecent}
            recentStations={recentStations}
          />
        </div>
        {loading ? (
          <div className="loadingContainer">
            <Loading />
          </div>
        ) : (
          <div className="resultsContainer">
            {badResponse ? (
              <div className="badResponse">
                <div className="badResponseContent">
                  <h2>
                    This is embarassing, {"\n"} something seems to be down on
                    our end. Try again soon!
                  </h2>
                  <Link to="/">
                    <button onClick={props.landingView}>Refresh</button>
                  </Link>
                </div>
              </div>
            ) : badSearch ? (
              <div className="badSearch">
                <div className="badSearchContent">
                  <h2>
                    Hmm... that's not music to our ears. We couldn't find any
                    stations matching "{props.genre}". Maybe try{" "}
                    <span className="genreSuggestion">{aGenre}?</span>
                  </h2>
                </div>
              </div>
            ) : (
              <div className="results">
                {listView ? (
                  <div className="listViewContainer">
                    <List
                      stations={stations}
                      setStations={setStations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      playingStation={playingStation}
                      addToRecent={addToRecent}
                      stationUrl={stationUrl}
                      badResponse={badResponse}
                      mapView={switchView}
                      quality={props.quality}
                      selectedGenre={props.genre}
                      favStationInfo={favStationInfo}
                      setFavStationInfo={setFavStationInfo}
                      favKeys={favKeys}
                      latitude={setCurrentLat}
                      longitude={setCurrentLong}
                    />
                  </div>
                ) : (
                  <div className="mapViewContainer">
                    <Map
                      stations={stations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      playingStation={playingStation}
                      addToRecent={addToRecent}
                      stationUrl={stationUrl}
                      badResponse={badResponse}
                      listView={switchView}
                      quality={props.quality}
                      selectedGenre={props.genre}
                      favStationInfo={favStationInfo}
                      setFavStationInfo={setFavStationInfo}
                      favKeys={favKeys}
                      currentLat={currentLat}
                      currentLong={currentLong}
                      setCurrentLat={setCurrentLat}
                      setCurrentLong={setCurrentLong}
                      stationFilter={stationFilter}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {stationUrl ? (
        <Player
          audioSource={stationUrl}
          stationName={playingStation}
          stationImage={currentIcon}
        />
      ) : null}
    </section>
  );
};

export default Radio;
