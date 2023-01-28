import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Radio from "./Radio";
import Login from "./Login";

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
      <div className="App">
        {showLanding ? (
          <div className="landingInfo">
            {/* <Searchbar placeholder="Search something" data={music}/> */}
            <nav className="landingNav">
              <button onClick={login}>login</button>
              {loginModal ? <Login showModal={login} /> : null}
              <Link to="/About">
                <h3>about page</h3>
              </Link>
            </nav>
            <Link to="/">
              <h1>Satch.fm</h1>
            </Link>
            <h2>Music from around the world</h2>
            <h2>{`${greeting}`}</h2>
            <h2>Search a genre, language, or decade</h2>
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="searchContainer">
                <input
                  type="checkbox"
                  name="hq"
                  id="hq"
                  onChange={() => setHighQuality(bitrate)}
                  value={bitrate}
                  autoFocus
                />
                <p>Show only high quality radio stations</p>
                <div className="searchInner">
                  <input
                    id="inputAuto"
                    type="text"
                    list="genre"
                    placeholder="enter a genre"
                    value={value}
                    onChange={onChange}
                    onClick={() => setDisplay(!display)}
                    autoFocus
                  />
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
              <button onClick={() => onSearch(value)}>Search</button>
            </form>
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
      </div>
    </section>
  );
};

export default Search;
