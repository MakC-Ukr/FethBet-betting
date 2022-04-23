import React from "react";
import "./EveryBetMatters.css";
import image1 from "../../components/images/image-1.png";
import image2 from "../../components/images/image-2.png";

class EveryBetMatters extends React.Component {
  render() {
    return (
      <div className="features-7E">
        <div className="containerE">
          <div className="rowE">
            <div className="main-contentE">
              <h1 className="h2-1E">
                Every Bet Matters
              </h1>
              <p className="paragraphE">
                Our audited smart contracts make sure that every bet is <br />
                fairly weighed and the outcome of the fixture&nbsp;&nbsp;cannot be manipulated by any party whatsoever.
              </p>
            </div>
          </div>
        </div>
        <div className="row-1E">
          
          <div className="card-itemE">
            <div className="card-contentE">
              <p className="h5-1E">
                A single source <br />
                of truth
              </p>
              <p className="paragraph-1E ">
                The courtesy of thesportsdb
                <br />
                API allows us to get the result of the fixtures
              </p>
              <img className="image-2E" src={image2} alt="img loading..." />
            </div>
          </div>
  
          <div className="card-item-1E">
            <div className="card-content-1E">
              <div className="h5-1E">
                Off-chain data delivered on-chain
              </div>
              <p className="paragraph-2E ">
                With the help of Chainlink,
                <br />
                the data is read from API and the decision is taken on-chain
              </p>
            </div>
          </div>

  
          <div className="card-item-2E">
            <div className="card-content-2E">
              <p className="h5-2E">
                Fastest way to <br />
                take action
              </p>
              <p className="paragraph-3E">
                The decision is taken within 5 minutes of the fixture ending.
              </p>
            </div>
            <img className="image-1E" src={image1} alt="img loading..."/>
          </div>


        </div>
      </div>
    );
  }
}

export default EveryBetMatters;


