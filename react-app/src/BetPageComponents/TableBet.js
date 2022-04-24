import React from "react";
import { Table, Button } from "web3uikit";
import axios from 'axios';
import "./Header.css"
import { Link } from "react-router-dom";
{/* <script src="https://unpkg.com/axios/dist/axios.min.js"></script> */ }

// const leagueApi = { 4328: "English Premier League",  4331: "German Bundesliga", 4332: "Italian Serie A", 4334: "French Ligue 1" , 4335: "Spanish La Liga"};
const leagueIdsToWatch = [4328, 4331, 4332, 4334, 4335];

const getTables = (self, idToWatch) => {
  return (<Table
          columnsConfig="1fr 1fr 2fr 1fr 2fr 1fr 1fr"
          data={
            self.state.renderList['4328'] === undefined ? [] : self.state.renderList[idToWatch]
          }
          maxPages={5}
          onPageNumberChanged={function noRefCheck() { }}
          pageSize={3}
          header={[
            <span>Date</span>,
            <span>Time (UTC)</span>,
            <span>League</span>,
            <span>Home Team</span>,
            '',
            <span>Away Team</span>,
            ''
          ]}
          isLoading={self.state.isFetching ? true : false}
        />);
}

class TableBet extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      upcomingMatches: [],
      renderList: {}
    };
  }

  async componentDidMount() {
    await this.fetchMatches();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  async fetchMatchesAsync() {
    this.setState({ isFetching: true });
    try {
      const getRenderList = {} ;
      let loadedMatches = [];

      for (let i = 0; i < leagueIdsToWatch.length; i++) {
        let id = leagueIdsToWatch[i];
        const temp = [];
        const URL = "https://www.thesportsdb.com/api/v1/json/50130162/eventsnextleague.php?id=" + id;
        const response = await axios.get(URL);
        loadedMatches.push(response.data['events']);
        for(let j = 0 ; j < response.data['events'].length; j++)
        {
          const imgUrl = response.data['events'][j]['strThumb']+ "/preview";
          temp.push([
            response.data['events'][j]['dateEvent'],
            response.data['events'][j]['strTime'],
            response.data['events'][j]['strLeague'],
            response.data['events'][j]['strHomeTeam'],
            <img src = {imgUrl} alt = "thumbnail not loaded" style ={{height:'100px'}}/>,
            response.data['events'][j]['strAwayTeam'],

            <Link to = {"/fixture/"+response.data['events'][j]['idEvent']}>

            <Button
              color="green"
              id="test-button-colored-green"
              text="Bet"
              theme="colored"
              type="button"
            />
            </Link>
          
          ]);
        }
        getRenderList[id] = (temp);
      }
      
      await this.setState({ upcomingMatches: loadedMatches });
      await this.setState({ renderList: getRenderList });
      await this.setState({ isFetching: false });
      // console.log(this.state.renderList['4328']);
    } catch (e) {
      console.log(e);
      this.setState({ isFetching: false });
    }
  };

  fetchMatches = this.fetchMatchesAsync;

  render() {
    return (
      <div className = "tableBet">
        <div style = {{width: '80%'}}>

        {/*just take a random id and if it is loaded already that means other IDs must have been loaded as well
          the main problem is that componentDidMount is being called twice. I tried creating a boolean isDataLoaded and updating it, 
          however, due to the doubling of componentDidMount this boolean was getting set to true after first update, even though the 
          data is not yet loaded. Hence simply checking for undefined did the trick. */}
          <div>
            <h2>Premier League</h2>
            {getTables(this, leagueIdsToWatch[0])}
          </div>

          <div>
            <h2>Bundesliga</h2>
            {getTables(this, leagueIdsToWatch[1])}
          </div>


          <div>
            <h2>Serie A</h2>
            {getTables(this, leagueIdsToWatch[2])}
          </div>


          <div>
            <h2>Ligue 1</h2>
            {getTables(this, leagueIdsToWatch[3])}
          </div>


          <div>
            <h2>La Liga</h2>
            {getTables(this, leagueIdsToWatch[4])}
          </div>
        </div>
      </div>
    );
  }
}





export default TableBet;