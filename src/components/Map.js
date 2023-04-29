import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { useEffect, useState } from "react";

import defaultImage from "../assets/radio.png";

const defaultIcon = L.icon({
  iconUrl: require("../assets/iconDefault.png"),
  iconSize: [48, 48],
});

const selectedIcon = L.icon({
  iconUrl: require("../assets/iconSelected.png"),
  iconSize: [60, 60],
});

const worldBounds = [
  [-90, -180], // southwest corner
  [90, 180], // northeast corner
];

const Map = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [playingName, setPlayingName] = useState("");

  const [filterTrue, setFilterTrue] = useState(false);
  const [filteredStations, setFilteredStations] = useState([]);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [savedArr, setSavedArr] = useState([]);

  useEffect(() => {
    for (let i = 0; i < props.stations.length; i++) {
      if (props.stations[i].url_resolved === radioUrl) {
        let imageGrab = props.stations[i].favicon;

        if (imageGrab === "") {
          props.sendImage(defaultImage);
        } else {
          props.sendImage(imageGrab);
        }
        props.sendImage(imageGrab);
      }
    }

    if (props.playingStation !== "") {
      setPlayingName(props.playingStation);
    }

    if (props.currentLat !== "" || props.currentLong !== "") {
      setLatitude(props.currentLat);
      setLongitude(props.currentLong);
    }
  }, [
    radioUrl,
    props.stations,
    filterTrue,
    props.sendToRadio,
    props.playingStation,
    latitude,
    longitude,
  ]);

  useEffect(() => {
    if (props.stations.length !== filteredStations) {
      setFilterTrue(false);
    }
  }, [props.stations]);

  const radioSelect = (event) => {
    event.preventDefault();

    const selectedStation = event.currentTarget.value;
    const selectedStationArr = selectedStation.split(",");

    props.sendToRadio(selectedStationArr[0]);
    props.sendToRadioName(event.target.id);
    props.sendImage(selectedStationArr[3]);

    setRadioUrl(event.target.value);
    setPlayingName(event.target.id);

    setLatitude(selectedStationArr[1]);
    setLongitude(selectedStationArr[2]);

    props.setCurrentLat(selectedStationArr[1]);
    props.setCurrentLong(selectedStationArr[2]);
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  const grabFilter = (event) => {
    const randomizer = (min = 0, max = props.stations.length) => {
      let base = Math.floor(Math.random() * (max - min + 1)) + min;
      let limit = base + parseInt(event.target.value);

      if (event.target.value > props.stations.length) {
        let bottom = 0;
        let top = props.stations.length;
        setFilteredStations(props.stations.slice(bottom, parseInt(top)));
        setFilterTrue(true);
      } else if (limit > props.stations.length) {
        let diff = limit - props.stations.length;
        let newBase = base - diff;
        let newLimit = newBase + event.target.value;

        setFilteredStations(props.stations.slice(newBase, newLimit));
        setFilterTrue(true);
      } else {
        setFilterTrue(true);
        setFilteredStations(props.stations.slice(base, limit));
      }
    };

    randomizer();
  };

  const randomStation = () => {
    if (filterTrue) {
      const randomizer = (min = 0, max = filteredStations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = filteredStations[randomizer()];

      setRadioUrl(surpriseStation.url_resolved);
      setLatitude(surpriseStation.geo_lat);
      setLongitude(surpriseStation.geo_long);

      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
      props.sendImage(surpriseStation.favicon);
      props.setCurrentLat(surpriseStation.geo_lat);
      props.setCurrentLong(surpriseStation.geo_long);
    } else {
      const randomizer = (min = 0, max = props.stations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = props.stations[randomizer()];

      setRadioUrl(surpriseStation.url_resolved);
      setLatitude(surpriseStation.geo_lat);
      setLongitude(surpriseStation.geo_long);

      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
      props.sendImage(surpriseStation.favicon);
      props.setCurrentLat(surpriseStation.geo_lat);
      props.setCurrentLong(surpriseStation.geo_long);
    }
  };

  let favouritedStations = [];

  const favourite = (event) => {
    const stationFav = event.currentTarget.value;
    const stationFavArr = stationFav.split(",");

    favouritedStations.push(...stationFavArr);

    setSavedArr((favouritedStations) => [favouritedStations, stationFavArr]);

    console.log(savedArr);

    props.setFavStationInfo([
      ...favouritedStations,
      { favourite: stationFavArr },
    ]);
  };

  return (
    <section className="resultContainer">
      <div className="mapFilters">
        <h3 className="returned">
          returned{" "}
          <span id="amountReturnedMap">
            {filterTrue ? filteredStations.length : props.stations.length}{" "}
          </span>
          {props.quality === 96 ? "high quality " : null}stations matching{" "}
          <span id="searchTerm">{props.selectedGenre}</span>
        </h3>
        <div className="topControls">
          <div className="filterButtonContainer">
            <button className="randomStation" onClick={randomStation}>
              <i className="fa-solid fa-shuffle"></i>
            </button>
            <button className="listButton" onClick={props.listView}>
              <i className="fa-solid fa-list"></i>
            </button>
          </div>
          <div className="selectDropdown">
            <label htmlFor="number"></label>
            <select
              name="number"
              id="filterNum"
              onChange={grabFilter}
              value="limit results"
            >
              <option disabled>limit results</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="300">All</option>
            </select>
          </div>
        </div>
      </div>
      <div className="actualMap">
        <MapContainer
          center={[30.0, 20.0]}
          zoom={2.5}
          scrollWheelZoom={true}
          maxZoom={30}
          minZoom={2}
          bounds={worldBounds}
          maxBounds={worldBounds}
          ZoomControl={false}
          zoomDelta={2}
        >
          <TileLayer
            url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=dHvKVDnUdOwlCAyUhof0"
            attribution={`<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`}
          />
          {filterTrue
            ? filteredStations.map((stationDetails) => {
                return (
                  <div key={stationDetails.changeuuid}>
                    <Marker
                      icon={
                        latitude == stationDetails.geo_lat &&
                        longitude == stationDetails.geo_long
                          ? selectedIcon
                          : defaultIcon
                      }
                      position={[
                        `${stationDetails.geo_lat}`,
                        `${stationDetails.geo_long}`,
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
                          <div className="stationText">
                            <p id="stationNameMap">
                              {stationDetails.name
                                .replace(/_/g, "")
                                .replace(/-/g, " ")
                                .replace(/  +/, " ")
                                .replace(/\//g, "")}
                            </p>
                            <p className="stationCountry">
                              {stationDetails.state !== ""
                                ? `${stationDetails.state}, `
                                : null}
                              {stationDetails.country ===
                              "The United States Of America"
                                ? "USA"
                                : stationDetails.country}
                            </p>
                          </div>
                          <div
                            className="buttonContainer"
                            value={[
                              stationDetails.name,
                              stationDetails.url,
                              stationDetails.favicon,
                            ]}
                          >
                            <button
                              className={
                                playingName === stationDetails.name ||
                                props.stationCheck
                                  ? "infoButtonPlaying"
                                  : "infoButton"
                              }
                              value={[
                                `${stationDetails.url_resolved}`,
                                `${stationDetails.geo_lat}`,
                                `${stationDetails.geo_long}`,
                                `${stationDetails.favicon}`,
                              ]}
                              onClick={radioSelect}
                              id={stationDetails.name}
                              key={stationDetails.favicon}
                            >
                              {playingName === stationDetails.name ||
                              props.stationCheck
                                ? ""
                                : "▶"}
                            </button>
                            <button
                              className="favourite"
                              onClick={favourite}
                              value={[
                                `${stationDetails.changeuuid}`,
                                `${stationDetails.name}`,
                                `${stationDetails.url_resolved}`,
                                `${stationDetails.favicon}`,
                                `${stationDetails.state}`,
                                `${stationDetails.country}`,
                              ]}
                              id={stationDetails.id}
                            >
                              <i className="fa-solid fa-star"></i>
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })
            : props.stations.map((stationDetails) => {
                return (
                  <div key={stationDetails.changeuuid}>
                    <Marker
                      icon={
                        latitude == stationDetails.geo_lat &&
                        longitude == stationDetails.geo_long
                          ? selectedIcon
                          : defaultIcon
                      }
                      position={[
                        `${stationDetails.geo_lat}`,
                        `${stationDetails.geo_long}`,
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
                          <div className="stationText">
                            <p id="stationNameMap">
                              {stationDetails.name
                                .replace(/_/g, "")
                                .replace(/-/g, " ")
                                .replace(/  +/, " ")
                                .replace(/\//g, "")}
                            </p>
                            <p className="stationCountry">
                              {stationDetails.state !== ""
                                ? `${stationDetails.state}, `
                                : null}
                              {stationDetails.country ===
                              "The United States Of America"
                                ? "USA"
                                : stationDetails.country}
                            </p>
                          </div>
                          <div
                            className="buttonContainer"
                            value={stationDetails}
                          >
                            <button
                              className={
                                playingName === stationDetails.name ||
                                props.stationCheck
                                  ? "infoButtonPlaying"
                                  : "infoButton"
                              }
                              value={[
                                `${stationDetails.url_resolved}`,
                                `${stationDetails.geo_lat}`,
                                `${stationDetails.geo_long}`,
                                `${stationDetails.favicon}`,
                              ]}
                              onClick={radioSelect}
                              id={stationDetails.name}
                              key={stationDetails.favicon}
                            >
                              {playingName === stationDetails.name ||
                              props.stationCheck
                                ? ""
                                : "▶"}
                            </button>
                            <button
                              className="favourite"
                              onClick={favourite}
                              value={[
                                `${stationDetails.changeuuid}`,
                                `${stationDetails.name}`,
                                `${stationDetails.url_resolved}`,
                                `${stationDetails.favicon}`,
                                `${stationDetails.state}`,
                                `${stationDetails.country}`,
                              ]}
                              id={stationDetails.id}
                            >
                              <i className="fa-solid fa-star"></i>
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
    </section>
  );
};

export default Map;
