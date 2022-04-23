import React from "react";
import "./WhatWeDo.css";
import icon1 from "../../icons/icon1.svg"
import icon2 from "../../icons/icon2.svg"
import icon3 from "../../icons/icon3.svg"


class WhatWeDo extends React.Component {
    render() {
      return (
        <div className="features-5">
          <div className="container1">
            <div className="row">
              <div className="main-content">
                <h1 className="h2">
                  What We Do
                </h1>
                <p className="paragraph">
                  We allow users to make bets on their favorite football teams playing in the La Liga, Premier League,
                  <br />
                  Series A etc. on the Ethereum blockchain. The decision for the winner of the bet is&nbsp;&nbsp;taken in a decentralized
                  manner <br />
                  with Chainlink oracles.
                </p>
              </div>
            </div>
            <div className="row-1">
              <div className="card-item">
                <img className="icn-settings-icn-lg" src={icon1} alt="img loading..."/>
                <div className="h5">
                  Decentralized
                </div>
              </div>
              <div className="card-item-1">
                <img className="icn-settings-icn-lg" src={icon2} alt="img loading..."/>
                <div className="h5-1">
                  Fair
                </div>
              </div>
              <div className="card-item-2">
                <img className="icn-settings-icn-lg-1" src={icon3} alt="img loading..."/>
                <div className="h5-2">
                  0% platform fees
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  export default WhatWeDo;
  