import React, { useState, useEffect } from "react";
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
      }
      return filtered;
    };

    setupApi(stationFilter)
      .then((data) => {
        setStations(data);
console.log(data)
        if (data.length === 0) {
          setLoading(false);
          setBadSearch(true);
          randomGenre();
        }
      })
      .catch((error) => {
        alert("api may be down...");
        setBadResponse(true);
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
      {loading ? (
        <Loading />
      ) : (
        <div className="error">
          {badSearch ? (
            <p>
              Hmm... that's not music to our ears. We couldn't find any stations
              matching {props.genre}. Maybe try {aGenre}?
            </p>
          ) : (
            <div className="resultsContainer">
              <div className="dashboard">
                <Dashboard />
              </div>

              <div className="results">
                {listView ? (
                  <div className="listViewContainer">
                    <button onClick={switchView}>switch to map view</button>
                    <List
                      stations={stations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      selectedGenre={props.genre}
                    />
                  </div>
                ) : (
                  <div className="mapViewContainer">
                    <button onClick={switchView}>switch to list view</button>
                    <Map
                      stations={stations}
                      sendToRadio={sendToRadio}
                      sendToRadioName={sendToRadioName}
                      sendImage={sendImage}
                      selectedGenre={props.genre}
                    />
                  </div>
                )}
              </div>
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
