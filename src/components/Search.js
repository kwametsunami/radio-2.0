import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Radio from "./Radio";
import Footer from "./Footer";

import Login from "./Login";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const genre = require("../data/genreData.json");

const Search = (props) => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [bitrate, setBitrate] = useState(32);

  const [display, setDisplay] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const wrapperRef = useRef(null);

  const { anonKey } = props;

  const anonymous = {
    user: { email: "anon@tr1.fm", uid: props.anonKey },
  };

  const [user, setUser] = useState(anonymous);

  useEffect(() => {
    sessionStorage.setItem("userData", JSON.stringify(user));

    // if (!isLoggedIn) {
    //   setUser(anonymous);
    // }
  }, [user]);

  const userData = JSON.parse(sessionStorage.getItem("userData"));

  // console.log(userData);

  const login = async () => {
    setShowLanding(false);
    setShowLogin(true);
    await signOut(auth);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(anonymous);
  };

  const currentTime = new Date().getHours();
  const greeting =
    currentTime >= 5 && currentTime < 12
      ? "good morning"
      : currentTime >= 12 && currentTime < 18
      ? "good afternoon"
      : "good evening";

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(value);
    setDisplay(false);
    setShowLanding(false);
    setShowLogin(false);
    setHideFooter(true);
    setValue("");
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
          <nav className="landingNav">
            {isLoggedIn ? (
              <div>
                <p>logged in as: {user.user.email}</p>
                <button className="logoutBtn" onClick={logout}>
                  logout
                </button>
              </div>
            ) : (
              <button className="loginBtn" onClick={login}>
                login
              </button>
            )}
            <Link to="/About">
              <button className="aboutBtn">about</button>
            </Link>
          </nav>
          <div className="centerContent">
            <div className="centerText">
              <h1 className="title">tr-1.fm</h1>
              <h2 className="greeting">{`${greeting}`}</h2>
            </div>
            <form className="searchForm" autoComplete="off" onSubmit={onSubmit}>
              <div className="searchContainer">
                <div className="checkBox">
                  <label htmlFor="checkbox">
                    show only high quality stations
                  </label>
                  <input
                    type="checkbox"
                    className="hqCheckbox"
                    name="hq"
                    id="hq"
                    onChange={() => setHighQuality(bitrate)}
                    value={bitrate}
                  />
                </div>
                <div className="searchInner">
                  <input
                    className="landingSearch"
                    id="inputAuto"
                    type="text"
                    list="genre"
                    placeholder="search by genre, decade, or language"
                    value={value}
                    onChange={onChange}
                    onClick={() => setDisplay(!display)}
                    autoFocus
                    required
                  />
                  <button
                    className="searchButton"
                    onClick={() => onSearch(value)}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
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
                          tag !== searchTerm
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
        </div>
      ) : showLogin ? (
        <Login
          landingView={landingView}
          setHideFooter={setHideFooter}
          setIsLoggedIn={setIsLoggedIn}
          setUser={setUser}
        />
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
          loggedInUser={user}
        />
      ) : null}
      {!showLanding && hideFooter ? null : <Footer />}
    </section>
  );
};

export default Search;
