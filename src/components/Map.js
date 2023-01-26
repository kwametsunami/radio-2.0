import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet"

import { useState } from "react";

import defaultImage from "../assets/radio.png";

const Map = (props) => {

const [radioUrl, setRadioUrl] = useState("")
const [stationName, setStationName] = useState("")

  const radioSelect = (event) => {
    event.preventDefault();

    props.sendToRadio(event.target.value);
    props.sendToRadioName(event.target.id)

    setRadioUrl(event.target.value)
    setStationName(event.target.id)
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const filterResNum = (event) => {
    props.sendToNumFilter(event.target.value);
  }

  return (
    <div className="map">
      <label htmlFor="number">Show results:</label>
      <select name="number" id="filterNum" onChange={filterResNum}>
        <option selected="selected" value="250">All</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <MapContainer center={[30.0, 10.0]} zoom={2.3} scrollWheelZoom={true}>
        <h2>yes hello</h2>
        <TileLayer
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=dHvKVDnUdOwlCAyUhof0"
          attribution={`<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`}
        />
        {props.stations.map((stationDetails) => {
          return (
            <div key={stationDetails.id}>
              <Marker
                position={[
                  `${stationDetails.geoLat}`,
                  `${stationDetails.geoLong}`,
                ]}
              >
                <Popup>
                  <div className="stationDetails">
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
                          radioUrl === stationDetails.urlResolved
                            ? "infoButtonPlaying"
                            : "infoButton"
                        }
                        value={stationDetails.urlResolved}
                        onClick={radioSelect}
                        id={stationDetails.name}
                      >
                        {radioUrl === stationDetails.urlResolved ? "" : "▶"}
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
