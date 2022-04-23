import React from "react";
import "./VideoEmbed.css"

class VideoEmbed extends React.Component {
    render() {
      return (
        <div className="features-6V">
          <div className="containerV">
            <iframe
              style={{ border: 0 }}
              id="ytplayer"
              type="text/html"
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/pPEiVvKdZm4?rel=0"
              frameborder="0"
              allowfullscreen="allowfullscreen"
              mozallowfullscreen="mozallowfullscreen"
              msallowfullscreen="msallowfullscreen"
              oallowfullscreen="oallowfullscreen"
              webkitallowfullscreen="webkitallowfullscreen"
              title="rand"
            ></iframe>
          </div>
        </div>
      );
    }
  }
  
  export default VideoEmbed;
  