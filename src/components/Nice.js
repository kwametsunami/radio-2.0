import SelectSearch from "react-select-search";

import genre from "../data/genreData.json";
import "react-select-search/style.css";

const options = [
  { name: "Swedish", value: "sv" },
  { name: "English", value: "en" }
];


const Nice = () => {
  const getValue = (value) => {
    console.log(value.value);
  };

  return (
    <SelectSearch
      options={options}
      value="sv"
      name="language"
      placeholder="Choose your language"
    />
  );
};

export default Nice;
