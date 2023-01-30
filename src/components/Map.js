import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Popup, ZoomControl } from "react-leaflet";
import { Icon } from "leaflet";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Dashboard from "./Dashboard";

import defaultImage from "../assets/radio.png";

const Map = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [stationName, setStationName] = useState("");
  const [favicon, setFavicon] = useState("");

  const [filterTrue, setFilterTrue] = useState(false);
  const [filteredStations, setFilteredStations] = useState([]);

  const [favouritedStations, setFavouritedStations] = useState([]);

  const [coordinates, setCoordinates] = useState([]);
  const [joinedData, setJoinedData] = useState([]);

  const [listCheck, setListCheck] = useState(false);

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

    if (props.stationUrl !== "") {
      setRadioUrl(props.stationUrl);
    }

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
          latitude = latitude + 1; // or however you feel like
          longitude = longitude + 1; // modifying these things
          break;
        }
      }
      // Store the updated coordinates in the already seen array for future checking.
      alreadySeenCoordinates.push({
        latitude: latitude,
        longitude: longitude,
      });

      setCoordinates(alreadySeenCoordinates);

      // let info = props.stations

      // let alreadySeenCoordinates = info
    }
  }, [radioUrl, props.stations, filterTrue, props.sendToRadio]);

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

      setRadioUrl(surpriseStation.urlResolved);
      setStationName(surpriseStation.name);
      props.sendToRadio(surpriseStation.urlResolved);
      props.sendToRadioName(surpriseStation.name);
    } else {
      const randomizer = (min = 0, max = props.stations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = props.stations[randomizer()];

      setRadioUrl(surpriseStation.urlResolved);
      setStationName(surpriseStation.name);
      props.sendToRadio(surpriseStation.urlResolved);
      props.sendToRadioName(surpriseStation.name);
    }
  };

  useEffect(() => {
    let radioData = [...props.stations];
    let newCoordinates = [...coordinates];

    let newArray = [];

    for (let i = 0; i < radioData.length; i++) {
      newArray.push([radioData[i], newCoordinates[i]]);
    }

    setJoinedData(newArray);
  }, [props.stations]);

  const favourite = (event) => {
    const stationFav = event.currentTarget.value;
    const stationFavArr = stationFav.split(",");

    props.setFavStationInfo([
      ...favouritedStations,
      { favourite: stationFavArr },
    ]);

    // if (event.currentTarget.id === stationFavArr[0]) {
    //   event.currentTarget.disabled = true;
    // }
  };

  return (
    <section className="resultContainer">
      <div className="mapFilters">
        <h3 className="returned">
          returned{" "}
          {filterTrue ? filteredStations.length : props.stations.length}{" "}
          {props.quality === 96 ? "high quality " : null}stations matching <span id="searchTerm">{props.selectedGenre}</span>
        </h3>
        <div className="topControls">
          <div className="filterButtonContainer">
            <button className="randomStation" onClick={randomStation}>
              <i class="fa-solid fa-shuffle"></i>
            </button>
            <button className="listButton" onClick={props.listView}>
              <i class="fa-solid fa-list"></i>
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
          center={[30.0, 10.0]}
          zoom={2.4}
          scrollWheelZoom={true}
          maxZoom={30}
          minZoom={2}
          ZoomControl={false}
        >
          {/* <ZoomControl  position="topright"/> */}
          <TileLayer
            url="https://api.maptiler.com/maps/outdoor-v2/{z}/{x}/{y}.png?key=dHvKVDnUdOwlCAyUhof0"
            attribution={`<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`}
          />
          {filterTrue
            ? filteredStations.map((stationDetails) => {
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
                          <div className="stationText">
                            <p>
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
                            <button
                              className="favourite"
                              onClick={favourite}
                              value={[
                                `${stationDetails.id}`,
                                `${stationDetails.name}`,
                                `${stationDetails.urlResolved}`,
                                `${stationDetails.favicon}`,
                                `${stationDetails.state}`,
                                `${stationDetails.country}`,
                              ]}
                              id={stationDetails.id}
                            >
                              <i class="fa-solid fa-star"></i>
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
                          <div className="stationText">
                            <p>
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
                            <button
                              className="favourite"
                              onClick={favourite}
                              value={[
                                `${stationDetails.id}`,
                                `${stationDetails.name}`,
                                `${stationDetails.urlResolved}`,
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
