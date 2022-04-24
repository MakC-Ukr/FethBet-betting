import React from "react";
import HomePage from "./Pages/HomePage";
import Bet from "./Pages/Bet";
import ErrorPage from "./Pages/ErrorPage";

import {
  BrowserRouter as Router,
  Routes,
  Route
  // Link
} from "react-router-dom";
import Fixture from './Pages/Fixture'


class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element = {<HomePage/>} / >
          <Route path="/app" element = {<Bet/>} /> 
          <Route path="/fixture/:fixtureId" element= {<Fixture/>} />
          <Route path="*" element= {<ErrorPage/>} />
        </Routes>
      </Router>
    );
  }
}

export default App;