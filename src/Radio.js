import React, { useState, useEffect } from "react";
import { RadioBrowserApi } from "radio-browser-api";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";
import "../src/radio.css";

import Map from "./Map";
import List from "./List";
import Player from "./Player";

import defaultImage from "./assets/radio.png";

const Radio = (props) => {
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(props.genre);
  const [listView, setListView] = useState(false);

  const switchView = () => {
    setListView(!listView);
  };

  useEffect(() => {
    setStationFilter(props.genre);

    const setupApi = async (stationFilter) => {
      const api = new RadioBrowserApi(
        fetch.bind(window),
        "International Radio"
      );

      const stations = await api.searchStations({
        tag: props.genre,
        limit: 250,
        hasGeoInfo: true,
        lastCheckOk: true,
        // offset: 5
      });

      let filtered = [];

      for (let bitrate in stations) {
        if (stations[bitrate].bitrate >= props.quality) {
          filtered.push(stations[bitrate]);
        }
      }

      setStations(filtered);
      console.log(filtered);

      return filtered;
    };

    setupApi(stationFilter).then((data) => {
      setStations(data);
    });
  }, [props.genre]);

  const [stationUrl, setStationUrl] = useState("");

  const sendToRadio = (url) => {
    setStationUrl(url);
  };

  return (
    <section>
      {listView ? (
        <div className="listViewContainer">
          <button onClick={switchView}>switch to map view</button>
          <List stations={stations} sendToRadio={sendToRadio} />
        </div>
      ) : (
        <div className="mapViewContainer">
          <button onClick={switchView}>switch to list view</button>
          <Map stations={stations} sendToRadio={sendToRadio} />
        </div>
      )}
      {stationUrl ? <Player audioSource={stationUrl} /> : null}
    </section>
  );
};

export default Radio;
