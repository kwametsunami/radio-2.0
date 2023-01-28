import defaultImage from "../assets/radio.png";

const Dashboard = (props) => {

    const favArr = []

    favArr.push(props.favouritedStations)

    console.log(favArr)

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return (
    <div className="dashboardContainer">
      <h1>Your favourited stations</h1>
      {props.favouritedStations.map((favStation) => {
        return (
          <div className="favItems" key={`${favStation.favourite[0]}`}>
            <img src={`${favStation.favourite[3]}`} onError={setDefaultSrc}/>
            <p>{`${favStation.favourite[1]}`}</p>
            <p>{`${favStation.favourite[5]}`}</p>
            <button value={`${favStation.favourite[2]}`}>play</button>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
