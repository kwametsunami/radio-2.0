import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RadioBrowserApi } from "radio-browser-api";

import Loading from "./Loading";
import Dashboard from "./Dashboard";
import Map from "./Map";
import List from "./List";
import Player from "./Player";

const list = require("../data/genreData.json");

const Radio = (props) => {
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(props.genre);
  const [listView, setListView] = useState(false);
  const [badSearch, setBadSearch] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
  const [aGenre, setAGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [favStationInfo, setFavStationInfo] = useState([])

  const [popular, setPopular] = useState([])

  const switchView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    setStationFilter(props.genre);

    const setupApi = async (stationFilter) => {
      setLoading(true);
      const api = new RadioBrowserApi(fetch.bind(window), "Radio");

      const stations = await api.searchStations({
        tag: props.genre,
        limit: 300,
        hasGeoInfo: true,
        lastCheckOk: true,
      });

      let filtered = [];

      for (let bitrate in stations) {
        if (stations[bitrate].bitrate >= props.quality) {
          filtered.push(stations[bitrate]);
        }
      }

      if (filtered.length > 0) {
        setStations(filtered);
        setBadSearch(false);
        setLoading(false);
        setBadResponse(false);
      }
      return filtered;
    };

    setupApi(stationFilter)
      .then((data) => {
        setStations(data);
        if (data.length === 0) {
          setLoading(false);
          setBadSearch(true);
          randomGenre();
        }
      })
      .catch((error) => {
        alert("api may be down...");
        setBadResponse(true);
        setLoading(false);
      });

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

      setupApi("all").then((data) => {

        let dataArray = data.slice(0, 5)

        setPopular(dataArray.sort(sort_by('votes', true, parseInt)))
      })

  }, [props.genre, props.quality]);

  const randomGenre = () => {
    console.log(list.tag.length);
    const randomizer = (min = 0, max = list.tag.length) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let rnd = list.tag[randomizer()].genre.toUpperCase();
    setAGenre(rnd);
  };

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

  return (
    <section className="infoContainer">
      <nav className="searchNav">
        <div className="searchNavContents">
          {/* <Link onClick={props.landingView} to="/">
            <h1 className="infoLogo">logo</h1>
          </Link> */}
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
              required
            />
            <button class="searchButton">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </nav>
      <div className="radioView">
        <div className="dashboard">
          <Dashboard
            landingView={props.landingView}
            favourites={favStationInfo}
            setFavourites={setFavStationInfo}
            popular={popular}
            sendToRadio={sendToRadio}
            sendToRadioName={sendToRadioName}
            sendImage={sendImage}
            stationUrl={stationUrl}
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
                <h2>
                  This is embarassing, something seems to be down on our end.
                  Try again soon!
                </h2>
                <Link to="/">
                  <button onClick={props.landingView}>Refresh</button>
                </Link>
              </div>
            ) : badSearch ? (
              <div className="badSearch">
                <p>
                  Hmm... that's not music to our ears. We couldn't find any
                  stations matching {props.genre}. Maybe try {aGenre}?
                </p>
              </div>
            ) : (
              <div className="results">
                {listView ? (
                  <div className="listViewContainer">
                    <List
                      stations={stations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      stationUrl={stationUrl}
                      badResponse={badResponse}
                      mapView={switchView}
                      selectedGenre={props.genre}
                      setFavStationInfo={setFavStationInfo}
                    />
                  </div>
                ) : (
                  <div className="mapViewContainer">
                    <Map
                      stations={stations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      stationUrl={stationUrl}
                      badResponse={badResponse}
                      listView={switchView}
                      selectedGenre={props.genre}
                      setFavStationInfo={setFavStationInfo}
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
