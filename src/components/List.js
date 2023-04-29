import { useState, useEffect, useRef } from "react";

import defaultImage from "../assets/radio.png";

const List = (props) => {
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

    if (props.playingStation !== "") {
      setPlayingName(props.playingStation);
    }
  }, [
    radioUrl,
    props.stations,
    filterTrue,
    props.sendToRadio,
    props.playingStation,
  ]);

  const radioSelect = (event) => {
    event.preventDefault();

    const selectedStation = event.currentTarget.value;
    const selectedStationArr = selectedStation.split(",");

    props.sendToRadio(selectedStationArr[0]);
    props.sendToRadioName(event.target.id);
    props.sendImage(selectedStationArr[3]);

    setRadioUrl(event.target.value);
    setPlayingName(event.target.id);

    props.latitude(selectedStationArr[1]);
    props.longitude(selectedStationArr[2]);
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

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
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
      props.sendImage(surpriseStation.favicon);
      props.latitude(surpriseStation.geo_lat);
      props.longitude(surpriseStation.geo_long);
    } else {
      const randomizer = (min = 0, max = props.stations.length) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      let surpriseStation = props.stations[randomizer()];

      setRadioUrl(surpriseStation.url_resolved);

      props.sendToRadio(surpriseStation.url_resolved);
      props.sendToRadioName(surpriseStation.name);
      props.sendImage(surpriseStation.favicon);
      props.latitude(surpriseStation.geo_lat);
      props.longitude(surpriseStation.geo_long);
    }
  };

  const favourite = (event) => {
    const stationFav = event.currentTarget.value;
    const stationFavArr = stationFav.split(",");

    const favouritedStations = [];

    props.setFavStationInfo([
      ...favouritedStations,
      { favourite: stationFavArr },
    ]);

    // if (event.currentTarget.id === stationFavArr[0]) {
    //   event.currentTarget.disabled = true;
    // }
  };

  const [isVisible, setIsVisible] = useState(false);
  const [currentGenre, setCurrentGenre] = useState("");

  const pageRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (pageRef.current && pageRef.current.scrollTop > 300) {
        setIsVisible(true);
        setCurrentGenre(props.selectedGenre);
      } else {
        setIsVisible(false);
      }
    };

    if (pageRef.current) {
      pageRef.current.addEventListener("scroll", toggleVisibility);
    }

    if (currentGenre !== props.selectedGenre) {
      searchScroll();
    }

    return () => {
      if (pageRef.current) {
        pageRef.current.removeEventListener("scroll", toggleVisibility);
      }
    };
  }, [pageRef, props.stations]);

  const scrollToTop = () => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const searchScroll = () => {
    if (pageRef.current) {
      pageRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  };

  return (
    <section className="stationList" ref={pageRef}>
      <div className="listFilters">
        <h3 className="returned">
          returned{" "}
          <span id="amountReturned">
            {filterTrue ? filteredStations.length : props.stations.length}
          </span>{" "}
          {props.quality === 96 ? "high quality " : null}
          stations matching{" "}
          <span id="listSearchTerm">{props.selectedGenre}</span>
        </h3>
        <div className="topControls">
          <div className="filterButtonContainer">
            <button className="randomStation" onClick={randomStation}>
              <i className="fa-solid fa-shuffle"></i>
            </button>
            <button className="mapViewButton" onClick={props.mapView}>
              <i className="fa-solid fa-earth-americas"></i>
            </button>
            <label htmlFor="number"></label>
          </div>
          <div className="selectDropdown">
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
      <div className="stationListContainer">
        {filterTrue
          ? filteredStations.map((stationDetails) => {
              return (
                <div
                  className={
                    playingName === stationDetails.name
                      ? "stationInfoPlayingList"
                      : "stationInfoList"
                  }
                  key={stationDetails.changeuuid}
                >
                  <div className="imageInfoContainer">
                    <div className="imageList">
                      <img
                        src={stationDetails.favicon}
                        alt={stationDetails.name}
                        className="icon"
                        onError={setDefaultSrc}
                      />
                    </div>

                    <div className="information">
                      <p className="stationName">
                        {stationDetails.name
                          .replace(/_/g, "")
                          .replace(/-/g, " ")
                          .replace(/  +/, " ")
                          .replace(/\//g, "")}
                      </p>
                      <p className="stationCountry">
                        {stationDetails.state !== ""
                          ? `${stationDetails.state}, `
                          : null}{" "}
                        {stationDetails.country ===
                        "The United States Of America"
                          ? "USA"
                          : stationDetails.country}
                      </p>
                    </div>

                    <div className="buttonContainer" value={stationDetails}>
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
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : props.stations.map((stationDetails) => {
              return (
                <div
                  className={
                    playingName === stationDetails.name
                      ? "stationInfoPlayingList"
                      : "stationInfoList"
                  }
                  key={stationDetails.changeuuid}
                >
                  <div className="imageInfoContainer">
                    <div className="imageList">
                      <img
                        src={stationDetails.favicon}
                        alt={stationDetails.name}
                        className="icon"
                        onError={setDefaultSrc}
                      />
                    </div>

                    <div className="information">
                      <p className="stationName">
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

                    <div className="buttonContainer" value={stationDetails}>
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
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {isVisible && (
        <div className="returnBtn">
          <button className="scrollToTop" onClick={scrollToTop}>
            <i className="fa-solid fa-circle-arrow-up"></i>
          </button>
          <p id="topText">return to top</p>
        </div>
      )}
    </section>
  );
};

export default List;
