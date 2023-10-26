// imports
// react
import { useState, useRef, useEffect } from "react";

// firebase
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// components
import About from "./About";
import Login from "./Login";
import Signout from "./Signout";
import Radio from "./Radio";
import Footer from "./Footer";

// data
const genre = require("../data/genreData.json");

const Search = (props) => {
  // states
  // forms
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [bitrate, setBitrate] = useState(32);
  const [quality, setQuality] = useState(false);

  // display states
  const [display, setDisplay] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [aboutModal, setAboutModal] = useState(false);
  const [animateBack, setAnimateBack] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);

  const wrapperRef = useRef(null);

  // user state default definition
  const anonymous = {
    user: { email: "anon@tr1.fm", uid: props.anonKey },
  };

  // user state
  const [user, setUser] = useState(anonymous);

  // localStorage to remember user and device
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUser(JSON.parse(storedData));
    }
  }, []);

  // translating localStorage
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  // about
  const aboutPopUp = (event) => {
    event.preventDefault();
    setAboutModal(true);
    setAnimateBack(false);
  };

  // greeting logic
  const currentTime = new Date().getHours();
  const greeting =
    currentTime >= 5 && currentTime < 12
      ? "good morning"
      : currentTime >= 12 && currentTime < 18
      ? "good afternoon"
      : "good evening";

  // functions
  // login and logout logic
  const login = async () => {
    setShowLanding(false);
    setShowLogin(true);
    await signOut(auth);
  };

  const logout = () => {
    if (showLanding) {
      localStorage.clear();
      setUser(anonymous);
      setShowLanding(false);
      setShowLogin(false);
      setShowSignOut(true);
      setHideFooter(true);
      setTimeout(() => {
        setShowLanding(true);
        setShowSignOut(false);
        setHideFooter(false);
      }, 1000);
    } else {
      localStorage.clear();
      setUser(anonymous);
    }
  };

  // search form logic
  const onChange = (event) => {
    const searchInput = event.target.value;

    const lowercaseSearch = searchInput.toLowerCase();

    setValue(lowercaseSearch);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  const setHighQuality = (kbps) => {
    if (kbps === 32) {
      setBitrate(96);
      setQuality(true);
      console.log("it's 96");
    }
    if (kbps === 96) {
      setBitrate(32);
      setQuality(false);
      console.log("its 32");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(value);
    setDisplay(false);
    setShowLanding(false);
    setShowLogin(false);
    setAnimateBack(false);
    setHideFooter(true);
    setValue("");
  };

  // show landing
  const landingView = () => {
    setShowLanding(true);
    setSearch("");
    setBitrate(32);
  };

  // dropdown menu logic
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

  console.log(user.user.photoURL);

  console.log(user.user.photoURL === undefined);

  console.log(user);

  console.log(user.user.displayName === undefined);

  console.log(user.user.email);

  return (
    <section className="landing">
      {showLanding ? (
        <div className="landingInfo">
          {aboutModal ? null : (
            <nav className="landingNav" id={aboutModal ? "vanish " : ""}>
              <div className="navItems">
                <div
                  className="userName"
                  id={user.user.email !== "anon@tr1.fm" ? "" : "hideUser"}
                >
                  {user.user.photoURL === null ? (
                    <i className="fa-solid fa-user"></i>
                  ) : (
                    <img
                      className="userPhoto"
                      src={user.user.photoURL}
                      alt={`${user.user.displayName}'s avatar`}
                    />
                  )}
                  <p>
                    {user.user.displayName === null
                      ? user.user.email
                      : user.user.displayName}
                  </p>
                </div>
                <div className="navButtons">
                  <button className="aboutBtn" onClick={aboutPopUp}>
                    about
                  </button>
                  {user.user.email !== "anon@tr1.fm" ? (
                    <button
                      className="logoutBtn"
                      onClick={logout}
                      value="landing"
                    >
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
                    value={quality ? 96 : 32}
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
          setUser={setUser}
        />
      ) : null}
      {showSignOut ? <Signout /> : null}
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
          setUser={setUser}
          anonymous={anonymous}
          loggedInUser={user}
          logout={logout}
        />
      ) : null}
      {!showLanding && hideFooter ? null : <Footer />}
    </section>
  );
};

export default Search;
