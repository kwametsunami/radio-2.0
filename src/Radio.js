import React, { useState, useEffect } from "react";
import { RadioBrowserApi } from "radio-browser-api";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";
import "../src/radio.css";
import Player from "./Player";

import defaultImage from "./assets/radio.png";

const Radio = (props) => {
  const [stations, setStations] = useState([]);
  const [stationFilter, setStationFilter] = useState(props.genre);
  const [kbps, setKbps] = useState()



  useEffect(() => {
    setStationFilter(props.genre);

    const setupApi = async (stationFilter) => {
      const api = new RadioBrowserApi(
        fetch.bind(window),
        "International Radio"
      );

      const stations = await api.searchStations({
        tag: props.genre,
        limit: 100,
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

  const [radioUrl, setRadioUrl] = useState("");

  const radioSelect = (event) => {
    event.preventDefault();
    setRadioUrl(event.target.value);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="map">
      <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((stationDetails) => {
          return (
            <Marker
              position={[
                `${stationDetails.geoLat}`,
                `${stationDetails.geoLong}`,
              ]}
            >
              <Popup>
                <div className="stationDetails" key={stationDetails.id}>
                  <img
                    className="icon"
                    src={stationDetails.favicon}
                    alt={stationDetails.name}
                    onError={setDefaultSrc}
                  />
                  <p>{stationDetails.name}</p>
                  <p className="stationCountry">{stationDetails.country}</p>
                  <div className="buttonContainer" value={stationDetails}>
                    <button
                      className={
                        radioUrl === stationDetails.url
                          ? "infoButtonPlaying"
                          : "infoButton"
                      }
                      value={stationDetails.url}
                      onClick={radioSelect}
                    >
                      {radioUrl === stationDetails.url ? "" : "▶"}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {radioUrl ? <Player audioSource={radioUrl} /> : null}
    </div>
  );
};

export default Radio;
