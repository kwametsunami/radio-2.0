                        <button
                          className="favourite"
                          onClick={favourite}
                          value={[
                            `${stationDetails.changeuuid}`,
                            `${stationDetails.url_resolved}`,
                            `${stationDetails.favicon}`,
                            `${stationDetails.geo_lat}`,
                            `${stationDetails.geo_long}`,
                            `${stationDetails.name}`,
                          ]}
                        >



    if (props.recentStations.length > 0) {
      for (let i = 0; i < props.recentStations.length; i++) {
        if (props.recentStations[i][0] !== dashboardStationArr[0]) {
          props.addToRecent(dashboardStationArr);
          console.log("for loop added");
        } else {
          const newArr = props.recentStations[i].filter(
            (item) => item !== dashboardStationArr
          );

          props.setSendToRecent(newArr);
        }
      }
    } else {
      props.addToRecent(dashboardStationArr);
      console.log("added");
    }

// useEffect(() => {
// const database = getDatabase(firebase);
// const dbRef = ref(database);

// onValue(dbRef, (response) => {
// const newState = [];

// const data = response.val();

// for (let key in data) {
// newState.push({
// key: key,
// data: data[key],
// });
// }

// const uniqueFav = [];
// const searchedFav = [];

// for (let i = 0; i < newState.length; i++) {
// const favIdKey = newState[i];

// if (!searchedFav[favIdKey.data]) {
// searchedFav[favIdKey.data] = true;
// uniqueFav.push(favIdKey);
// }
// }
// setTestArr(uniqueFav);

// const stationKeys = [];

// for (let i = 0; i < uniqueFav.length; i++) {
// stationKeys.push(uniqueFav[i].data[0]);
// }

// setTestKeys(stationKeys);
// });
// }, []);

                                  .replace(/_/g, "")
                                  .replace(/-/g, " ")
                                  .replace(/  +/, " ")
                                  .replace(/\//g, "")
