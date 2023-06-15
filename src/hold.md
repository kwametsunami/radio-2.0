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
