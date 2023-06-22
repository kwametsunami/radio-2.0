import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import About from "./About";
import Login from "./Login";
import Radio from "./Radio";
import Footer from "./Footer";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const genre = require("../data/genreData.json");

const Search = (props) => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [bitrate, setBitrate] = useState(32);

  const [display, setDisplay] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [aboutModal, setAboutModal] = useState(false);
  const [animateBack, setAnimateBack] = useState(false);
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
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUser(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  const login = async () => {
    setShowLanding(false);
    setShowLogin(true);
    await signOut(auth);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUser(anonymous);
  };

  const aboutPopUp = (event) => {
    event.preventDefault();
    setAboutModal(true);
    setAnimateBack(false);
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
          {aboutModal ? null : (
            <nav className="landingNav" id={aboutModal ? "vanish " : ""}>
              <div className="navItems">
                {user.user.email !== "anon@tr1.fm" ? (
                  <div className="userName">
                    <i className="fa-solid fa-user"></i>
                    <p>{user.user.email}</p>
                  </div>
                ) : null}
                <div className="navButtons">
                  <button className="aboutBtn" onClick={aboutPopUp}>
                    about
                  </button>
                  {user.user.email !== "anon@tr1.fm" ? (
                    <button className="logoutBtn" onClick={logout}>
                      logout
                    </button>
                  ) : (
                    <button className="loginBtn" onClick={login}>
                      login
                    </button>
                  )}
                </div>
              </div>
            </nav>
          )}
          {aboutModal ? (
            <About
              aboutPopUp={aboutPopUp}
              aboutModal={setAboutModal}
              animateBack={setAnimateBack}
            />
          ) : null}
          <div
            className={`centerContent ${animateBack ? "contentBack" : ""}`}
            id={aboutModal ? "backgroundBlur" : ""}
          >
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
          setHideFooter={setHideFooter}
          setShowLogin={setShowLogin}
          search={setSearch}
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
