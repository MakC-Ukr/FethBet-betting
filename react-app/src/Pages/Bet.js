import React from "react";
import "./Bet.css";
import Header from "../BetPageComponents/Header";
import TableBet from "../BetPageComponents/TableBet";

document.body.style = 'background: #ADD8E6;';

const setCurrentAccount = (p) => {
    this.setState({accountConnected: p})
}

class HomePage extends React.Component {
 
  


  constructor()
  {
    super();
    this.state=  {
      accountConnected: '',
    }
  }

  

  render() {
    

    return (
      <div>
        <Header setCurrentAccount = {setCurrentAccount}/>
          <div style ={{padding:"12px", margin: "5px"}}>
          <TableBet/>
        </div>
      </div>
    );
  }


}

export default HomePage;