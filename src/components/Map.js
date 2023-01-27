import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import { useEffect, useState } from "react";

import defaultImage from "../assets/radio.png";

const Map = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [stationName, setStationName] = useState("");
  const [favicon, setFavicon] = useState("");


  useEffect(() => {
    for (let i = 0; i < props.stations.length; i++) {
      if (props.stations[i].urlResolved === radioUrl) {
        let imageGrab = props.stations[i].favicon;

        if (imageGrab === "") {
          setFavicon(defaultImage);
        } else {
          setFavicon(imageGrab);
        }
        props.sendImage(imageGrab);
      }
    }

  }, [radioUrl]);

  const radioSelect = (event) => {
    event.preventDefault();

    props.sendToRadio(event.target.value);
    props.sendToRadioName(event.target.id);

    setRadioUrl(event.target.value);
    setStationName(event.target.id);

  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const filterResNum = (event) => {
    props.sendToNumFilter(event.target.value);
  };

  const randomStation = () => {
    const randomizer = (min = 0, max = props.stations.length) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let surpriseStation = props.stations[randomizer()];

    setRadioUrl(surpriseStation.urlResolved);
    setStationName(surpriseStation.name);
    props.sendToRadio(surpriseStation.urlResolved);
    props.sendToRadioName(surpriseStation.name);
  };

  const alreadySeenCoordinates = [];
  for (const station of props.stations) {
    let latitude = station.geoLat;
    let longitude = station.geoLong;
    // Check if another station has these exact coordinates. If so, bump the lat,lon by one.
    for (const seenCoordinates of alreadySeenCoordinates) {
      if (
        seenCoordinates.latitude === latitude &&
        seenCoordinates.longitude === longitude
      ) {
        latitude += 1; // or however you feel like
        longitude += 1; // modifying these things
        break;
      }
    }
    // Store the updated coordinates in the already seen array for future checking.
    alreadySeenCoordinates.push({
      latitude: latitude,
      longitude: longitude,
    });
  }

  // console.log(alreadySeenCoordinates)

  return (
    <div className="map">
      <label htmlFor="number">Show results:</label>
      <select name="number" id="filterNum" onChange={filterResNum} value="--">
        <option disabled>--</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="300">All</option>
      </select>
      <button onClick={randomStation}>Select a random station</button>
      <MapContainer
        center={[30.0, 10.0]}
        zoom={2.3}
        scrollWheelZoom={true}
        maxZoom={30}
        minZoom={2}
      >
        <h2>yes hello</h2>
        <TileLayer
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
                          radioUrl === stationDetails.urlResolved ||
                          props.stationCheck
                            ? "infoButtonPlaying"
                            : "infoButton"
                        }
                        value={stationDetails.urlResolved}
                        onClick={radioSelect}
                        id={stationDetails.name}
                        key={stationDetails.favicon}
                      >
                        {radioUrl === stationDetails.urlResolved ||
                        props.stationCheck
                          ? ""
                          : "▶"}
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
