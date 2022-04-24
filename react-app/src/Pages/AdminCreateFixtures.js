import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Badge, Table } from "web3uikit";
import "../FixturePageComponents/Fixture.css";
import fethBetRouter from "../contracts/FethBetRouter";
import linkPool from "../contracts/LinkPool";


const leagueIdsToWatch = [4328, 4331, 4332, 4334, 4335];
const leagueApi = { 4328: "English Premier League", 4331: "German Bundesliga", 4332: "Italian Serie A", 4334: "French Ligue 1", 4335: "Spanish La Liga" };



const AdminCreateFixtures = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [renderList, setRenderList] = useState({});
  const [isFetching, setIsFetching] = useState(true);
  const [showBadgeWarningLink, setShowBadgeWarningLink] = useState(false);


  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }


  const getTables = (idToWatch) => {
    return (<Table
      columnsConfig="1fr 1fr 2fr 1fr 2fr 1fr 1fr"
      data={
        renderList['4328'] === undefined ? [] : renderList[idToWatch]
      }
      maxPages={5}
      onPageNumberChanged={function noRefCheck() { }}
      pageSize={3}
      header={[
        <span>Date</span>,
        <span>Time (UTC)</span>,
        <span>League</span>,
        <span>Home Team</span>,
        <span>Away Team</span>,
        ''
      ]}
      isLoading={isFetching ? true : false}
    />);
  }

  const loadEventDetails = async () => {
    const getRenderList = {};
    let loadedMatches = [];

    for (let i = 0; i < leagueIdsToWatch.length; i++) {
      let id = leagueIdsToWatch[i];
      const temp = [];
      const URL = "https://www.thesportsdb.com/api/v1/json/50130162/eventsnextleague.php?id=" + id;
      const response = await axios.get(URL);
      loadedMatches.push(response.data['events']);
      for (let j = 0; j < 3; j++) {

        const getFixtAddr = await fethBetRouter.methods.fixturesDeployed(response.data['events'][j]['idEvent']).call();
        console.log(getFixtAddr);
        if (getFixtAddr === "0x0000000000000000000000000000000000000000") {
          temp.push([
            response.data['events'][j]['dateEvent'],
            response.data['events'][j]['strTime'],
            response.data['events'][j]['strLeague'],
            response.data['events'][j]['strHomeTeam'],
            response.data['events'][j]['strAwayTeam'],
            <Button
              color="green"
              id="test-button-colored-green"
              text="Create Fixture Contract"
              theme="colored"
              type="button"
              onClick={async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

                fethBetRouter.methods.createFixture(
                  id,
                  response.data['events'][j]['idEvent'],
                  69696969
                ).send({
                  from: accounts[0],
                })
              }}
            />
          ]);
        }
      }
      getRenderList[id] = (temp);
    }

    setRenderList(getRenderList);
    setIsFetching(false);
  }


  async function checkLinkBalance() {
    let a, b;
    a = await linkPool.methods.getLINKBalance().call();
    if (!a[1]) {
      setShowBadgeWarningLink(true);
    }
  }

  useEffect(() => {

    async function allTogether() {
      connectWalletHandler();
      loadEventDetails();
      checkLinkBalance();
    }
    allTogether();

  }, []);


  return (
    <div>
      <h2>Note: this page may take time to load</h2>
      {showBadgeWarningLink ? <Badge
        state="warning"
        text="Link Pool balance less thank 10 LINK. Please recharge immediately"
      /> : ""}
      <div style={{ width: "60%" }}>
        {currentAccount == "" ? <button onClick={connectWalletHandler}> connect wallet </button> : <h2>Wallet connected</h2>}
        <h1>Upcoming 3 matches for {leagueApi[leagueIdsToWatch[0]]} which fixtures need to be created</h1>
        {getTables(leagueIdsToWatch[0])}
        <h1>Upcoming 3 matches for {leagueApi[leagueIdsToWatch[1]]} which fixtures need to be created</h1>
        {getTables(leagueIdsToWatch[1])}
        <h1>Upcoming 3 matches for {leagueApi[leagueIdsToWatch[2]]} which fixtures need to be created</h1>
        {getTables(leagueIdsToWatch[2])}
        <h1>Upcoming 3 matches for {leagueApi[leagueIdsToWatch[3]]} which fixtures need to be created</h1>
        {getTables(leagueIdsToWatch[3])}
        <h1>Upcoming 3 matches for {leagueApi[leagueIdsToWatch[4]]} which fixtures need to be created</h1>
        {getTables(leagueIdsToWatch[4])}
      </div>
    </div>
  );
}

export default AdminCreateFixtures;
