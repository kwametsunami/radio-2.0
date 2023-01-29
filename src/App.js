import "../src/styles/styles.scss"
import { Route, Routes } from "react-router-dom"

import Landing from "./components/Landing";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";

import Test from "./components/Test";

import Nice from "./components/Nice";


function App() {
  const styles = {
    // app: {
    //   backgroundColor: "rgba(0,0,0,0.1)",
    //   justifyItems: "center",
    //   alignItems: "center",
    //   display: "grid",
    //   height: "100vh",
    //   fontFamily: "Arial",
    //   color: "rgba(0,0,100,1)",
    //   gridTemplateColumns: "1fr",
    //   fontSize: 25,
    // },
    select: {
      width: "100%",
      maxWidth: 600,
    },
  };

  const options = [
        { label: "00s", value: "00s" },
        { label: "50s", value: "50s"},
        { label: "60s", value: "60s"},
        { label: "70s", value: "70s"},
        { label: "80s", value: "80s"},
        { label: "90s", value: "90s"},
        { label: "acid jazz", value: "acid jazz"},
        { label: "african", value: "african"}
  ];

  function onChangeInput(value) {
    console.log(value);
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/About" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* <Nice /> */}
      {/* <Landing /> */}
    </div>
  );
}

export default App;
