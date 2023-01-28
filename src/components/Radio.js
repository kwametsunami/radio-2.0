import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RadioBrowserApi } from "radio-browser-api";

import Loading from "./Loading";
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

  const switchView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    setStationFilter(props.genre);

    const setupApi = async (stationFilter) => {
      setLoading(true);
      const api = new RadioBrowserApi(fetch.bind(window), "My Radio");

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
        setBadResponse(false)
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
    <section>
      <nav>
        <Link onClick={props.landingView} to="/">
        <h1>logo</h1>
        </Link>
        <Link to="/About">
        <h1>about</h1>
        </Link>
      </nav>
      {loading ? (
        <Loading />
      ) : (
        <div className="badSearch">
          {badResponse ? (
            <h2>The API might be down.</h2>
          ) : badSearch ? (
            <p>
              Hmm... that's not music to our ears. We couldn't find any stations
              matching {props.genre}. Maybe try {aGenre}?
            </p>
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
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
