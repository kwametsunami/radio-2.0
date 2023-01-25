import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";

import { useState } from "react";

import defaultImage from "./assets/radio.png";

const Map = (props) => {

const [radioUrl, setRadioUrl] = useState("")

  const radioSelect = (event) => {
    event.preventDefault();
    props.sendToRadio(event.target.value);
    setRadioUrl(event.target.value)
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };
  return (
    <div className="map">
      <MapContainer center={[0, 0]} zoom={1.5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.stations.map((stationDetails) => {
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
    </div>
  );
};

export default Map;
