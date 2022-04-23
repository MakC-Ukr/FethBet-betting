import React from "react";
import EveryBetMatters from "../src/HomePageComponents/EveryBetMatters/EveryBetMatters";
import GoToApp from "../src/HomePageComponents/GoToApp/GoToApp";
import VideoEmbed from "../src/HomePageComponents/VideoEmbed/VideoEmbed";
import WhatWeDo from "../src/HomePageComponents/WhatWeDo/WhatWeDo";

class App extends React.Component {
  render() {
    return (
      <div>
        <GoToApp/>
        <WhatWeDo/>
        <EveryBetMatters/>
        <VideoEmbed/>
      </div>
    );
  }
}

export default App;


