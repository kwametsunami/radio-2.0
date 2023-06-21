import "../src/styles/styles.scss";

import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Search from "./components/Search";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";
import SignUpTest from "./components/SignUpTest";
import ApiTest from "./components/ApiTest";

const App = () => {
  const browserKey = () => {
    const anonKey = uuidv4();
    return anonKey;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Search anonKey={browserKey()} />} />
        <Route path="/About" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Test" element={<SignUpTest />} />
        <Route path="/ApiTest" element={<ApiTest />} />
      </Routes>
    </div>
  );
};

export default App;
