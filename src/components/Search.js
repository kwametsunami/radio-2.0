import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Radio from "./Radio";
import Login from "./Login";
import Footer from "./Footer";


const genre = require("../data/genreData.json");

const Search = () => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [bitrate, setBitrate] = useState(32);
  const [loginModal, setLoginModal] = useState(false);
  const [closeModal, setCloseModal] = useState(true);

  const [display, setDisplay] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const wrapperRef = useRef(null);

  const login = () => {
    setLoginModal(!loginModal);
    setCloseModal(!closeModal);
  };

  const currentTime = new Date().getHours();
  const greeting =
    currentTime >= 5 && currentTime < 12
      ? "Good Morning"
      : currentTime >= 12 && currentTime < 18
      ? "Good Afternoon"
      : "Good Evening";

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    console.log(searchTerm);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(value);
    setDisplay(false);
    setShowLanding(false);
    setValue("")
  };

  const setHighQuality = (kbps) => {
    if (kbps === 32) {
      setBitrate(96);
    }
    if (kbps === 96) {
      setBitrate(32);
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const landingView = () => {
    setShowLanding(true);
    setSearch("");
  };

  return (
    <section className="landing">
      {showLanding ? (
        <div className="landingInfo">
          <nav className="landingNav wrapper">
            <button className="loginBtn" onClick={login}>
              login
            </button>
            {loginModal ? <Login showModal={login} /> : null}
            <Link to="/About">
              <h3>About</h3>
            </Link>
          </nav>
          <div className="centerContent">
            <div className="centerText">
              <h1 className="title">Satch.fm</h1>
              <h2>{`${greeting}`}</h2>
            </div>
            <form className="searchForm" autoComplete="off" onSubmit={onSubmit}>
              <div className="searchContainer">
                {/* <input
                  type="checkbox"
                  className="hqCheckbox"
                  name="hq"
                  id="hq"
                  onChange={() => setHighQuality(bitrate)}
                  value={bitrate}
                />
                <p>Show only high quality radio stations</p> */}
                <div className="searchInner">
                  <input
                    className="landingSearch"
                    id="inputAuto"
                    type="text"
                    list="genre"
                    placeholder="Search by genre, decade, or language"
                    value={value}
                    onChange={onChange}
                    onClick={() => setDisplay(!display)}
                    autoFocus
                    required
                  />
                  <button class="searchButton" onClick={() => onSearch(value)}>
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                </div>
                {display && (
                  <div ref={wrapperRef} className="dropdown">
                    {genre.tag
                      .filter((item) => {
                        const searchTerm = value.toLowerCase();
                        const tag = item.genre.toLowerCase();

                        return (
                          searchTerm &&
                          tag.startsWith(searchTerm) &&
                          tag != searchTerm
                        );
                      })
                      .slice(0, 5)
                      .map((item) => {
                        return (
                          <button
                            onClick={() => onSearch(item.genre)}
                            className="dropdownRow"
                            key={item.index}
                            value={item.genre}
                            tabIndex="0"
                          >
                            <p>{item.genre}</p>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </form>
          </div>
          <Footer />
        </div>
      ) : null}
      {search ? (
        <Radio
          genre={search}
          quality={bitrate}
          setQuality={setBitrate}
          landingView={landingView}
          value={value}
          onSearch={onSearch}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      ) : null}
    </section>
  );
};

export default Search;
