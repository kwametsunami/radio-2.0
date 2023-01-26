import "./App.scss";
import { Route, Routes } from "react-router-dom"

import Landing from "./components/Landing";
import About from "./components/About";
import Signup from "./components/Signup";
import Test from "./components/Test";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/about" element={<About />} />
      </Routes>
      {/* <Test /> */}
      <Landing />
    </div>
  );
}

export default App;
