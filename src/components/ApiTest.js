const stationsList = require("../data/stations.json");

let geoFilter = [];

for (let geo in stationsList) {
  if (stationsList[geo].geo_lat != null) {
    geoFilter.push(stationsList[geo]);
  }
}

const ApiTest = () => {
  console.log(geoFilter);

  let newFilter = [];

  for (let filter in geoFilter) {
    if (geoFilter[filter].tags === "rock") {
      newFilter.push(geoFilter[filter]);
    }
  }

  console.log(newFilter);

  let bitrateFilter = [];

  for (let bitrate in newFilter) {
    if (newFilter[bitrate].bitrate >= 320) {
      bitrateFilter.push(newFilter[bitrate]);
    }
  }

  console.log(bitrateFilter);

  if (bitrateFilter.length > 0) {
    console.log("we good");
  }

  const sort_by = (field, reverse, primer) => {
    const key = primer
      ? function (x) {
          return primer(x[field]);
        }
      : function (x) {
          return x[field];
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
    };
  };

  if (bitrateFilter.length === 0) {
    console.log("not good");
  }

  return <h1>api test</h1>;
};

export default ApiTest;
