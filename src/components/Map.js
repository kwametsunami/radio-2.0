import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";

import { useEffect, useState } from "react";

import defaultImage from "../assets/radio.png";

const Map = (props) => {
  const [radioUrl, setRadioUrl] = useState("");
  const [playingName, setPlayingName] = useState("");

  const [filterTrue, setFilterTrue] = useState(false);
  const [filteredStations, setFilteredStations] = useState([]);

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

    if (props.stationUrl !== "") {
      setRadioUrl(props.stationUrl);
    }
  }, [radioUrl, props.stations, filterTrue, props.sendToRadio]);

  const radioSelect = (event) => {
    event.preventDefault();

    props.sendToRadio(event.target.value);
    props.sendToRadioName(event.target.id);

    setRadioUrl(event.target.value);
    setPlayingName(event.target.id);
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
      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
    } else {
      const randomizer = (min = 0, max = props.stations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = props.stations[randomizer()];

      setRadioUrl(surpriseStation.url_resolved);
      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
    }
  };

  const favourite = (event) => {
    const stationFav = event.currentTarget.value;
    const stationFavArr = stationFav.split(",");

    const favouritedStations = []

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
          {filterTrue ? filteredStations.length : props.stations.length}{" "}
          {props.quality === 96 ? "high quality " : null}stations matching <span id="searchTerm">{props.selectedGenre}</span>
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
          center={[30.0, 10.0]}
          zoom={2.8}
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
                  <div key={stationDetails.changeuuid}>
                    <Marker
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
                                playingName === stationDetails.name ||
                                props.stationCheck
                                  ? "infoButtonPlaying"
                                  : "infoButton"
                              }
                              value={stationDetails.url_resolved}
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
                                `${stationDetails.id}`,
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
                  <div key={stationDetails.id}>
                    <Marker
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
                                playingName === stationDetails.name ||
                                props.stationCheck
                                  ? "infoButtonPlaying"
                                  : "infoButton"
                              }
                              value={stationDetails.url_resolved}
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
                                `${stationDetails.id}`,
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
