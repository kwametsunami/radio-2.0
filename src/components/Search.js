import { useState } from "react";
import Radio from "./Radio";
import Login from "./Login";

const genre = require("../genreData.json");

const Search = () => {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [bitrate, setBitrate] = useState(32);
  const [loginModal, setLoginModal] = useState(false);
  const [closeModal, setCloseModal] = useState(true)

  const login = () => {
    setLoginModal(!loginModal);
    setCloseModal(!closeModal)
    console.log("closing!!")
  };

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    console.log("search", searchTerm);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setSearch(value);
    console.log("submitting...");
  };

  const setHighQuality = (kbps) => {
    if (kbps === 32) {
      setBitrate(96);
    }
    if (kbps === 96) {
      setBitrate(32);
    }
  };

  return (
    <div className="App">
      <h1>Radio Player</h1>
      <button onClick={login}>login</button>
      {loginModal ? <Login showModal={login}/> : null}
      <h2>What do you want to listen to?</h2>
      <form autoComplete="off" onSubmit={onSubmit}>
        <div className="searchContainer">
          <div className="searchInner">
            <input
              id="inputAuto"
              type="text"
              placeholder="enter a genre"
              value={value}
              onChange={onChange}
            />
          </div>
          <input
            type="checkbox"
            name="hq"
            id="hq"
            onChange={() => setHighQuality(bitrate)}
            value={bitrate}
          />
          <p>Show only high quality radio stations</p>
          <div className="dropdown">
            {genre.tag
              .filter((item) => {
                const searchTerm = value.toLowerCase();
                const tag = item.genre.toLowerCase();

                return (
                  searchTerm && tag.startsWith(searchTerm) && tag != searchTerm
                );
              })
              .slice(0, 5)
              .map((item) => {
                return (
                  <div
                    onClick={() => onSearch(item.genre)}
                    className="dropdownRow"
                    key={item.genre}
                  >
                    {item.genre}
                  </div>
                );
              })}
          </div>
        </div>
        <button onClick={() => onSearch(value)}>Search</button>
      </form>
      {search ? <Radio genre={search} quality={bitrate} /> : null}
    </div>
  );
};

export default Search;
