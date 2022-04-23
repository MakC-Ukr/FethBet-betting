import React from "react";
import EveryBetMatters from "../HomePageComponents/EveryBetMatters/EveryBetMatters";
import GoToApp from "../HomePageComponents/GoToApp/GoToApp";
import VideoEmbed from "../HomePageComponents/VideoEmbed/VideoEmbed";
import WhatWeDo from "../HomePageComponents/WhatWeDo/WhatWeDo";


const HomePage = () => {
    return (
        <div>
          <GoToApp/>
          <WhatWeDo/>
          <EveryBetMatters/>
          <VideoEmbed/>
        </div>
      );
}

export default HomePage;