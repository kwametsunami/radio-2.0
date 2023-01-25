import "./App.scss";
import { Route, Routes } from "react-router-dom"

import Search from "./components/Search";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup />}/>
      </Routes>
  
      <Search />
    </div>
  );
}

export default App;
