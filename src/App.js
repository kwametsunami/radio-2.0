import './App.css';

import { useState } from 'react';
import Radio from "./Radio";
import Map from './Map';

const genre = require("./genreData.json")

function App() {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (searchTerm) => {
    setValue(searchTerm)
    console.log('search', searchTerm)
  }

  const onSubmit = () => {
    setSearch(value)
    console.log("submitting...")
  }

  return (
    <div className="App">
      <h1>Radio Player</h1>
      <h2>What do you want to listen to?</h2>
      <form autoComplete="off" onSubmit={onSubmit} action="#">
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
          <input type="checkbox" name="hq" id="hq" /><p>Show only high quality radio stations</p>
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
      {search ? <Radio genre={search} /> : null}
    </div>
  );
}

export default App;
