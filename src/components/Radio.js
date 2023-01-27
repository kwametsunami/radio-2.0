import React, { useState, useEffect } from "react";
import { RadioBrowserApi } from "radio-browser-api";

import Loading from "./Loading";
import Map from "./Map";
import List from "./List";
import Player from "./Player";

const Radio = (props) => {
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(props.genre);
  const [listView, setListView] = useState(false);
  const [badSearch, setBadSearch] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
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

      console.log(filtered.length, "running before if")

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

        console.log(data.length)

        if (data.length === 0){
          setLoading(false)
        setBadSearch(true);
        console.log(badSearch, `you searched ${props.genre}`);
        }
      })
      .catch((error) => {
        alert("api may be down...");
        setBadResponse(true);
      });
  }, [props.genre, props.quality, badSearch]);

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
      {loading ? 
        <Loading />
       : 
        <div className="error">
          {badSearch ? (
            <p>
              Hmm... that's not music to our ears. We couldn't find any stations
              matching {props.genre}. Maybe try Rock?
            </p>
          ) : (
            <div className="results">
              <h3>
                Returned {stations.length} stations matching {props.genre}
              </h3>
              <button>play a random station</button>
              {listView ? (
                <div className="listViewContainer">
                  <button onClick={switchView}>switch to map view</button>
                  <List
                    stations={stations}
                    sendToRadio={sendToRadio}
                    sendToRadioName={sendToRadioName}
                    sendImage={sendImage}
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
                  />
                </div>
              )}
            </div>
          )}
        </div>
      }

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
