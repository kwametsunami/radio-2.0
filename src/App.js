import "../src/styles/styles.scss"
import { Route, Routes } from "react-router-dom"


import Search from "./components/Search";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";

import SignUpTest from "./components/SignUpTest";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/About" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Test" element={<SignUpTest />} />
      </Routes>
    </div>
  );
}

export default App;
