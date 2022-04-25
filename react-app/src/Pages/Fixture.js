import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Button, Card, Input, Stepper, Table } from "web3uikit";
import Header from "../BetPageComponents/Header";
import "../FixturePageComponents/Fixture.css";
import fethBetRouter from "../contracts/FethBetRouter";
import fixtureContractAbi from "../contracts/FixtureContractAbi";
import web3 from "../web3";

function Fixture() {
    const { fixtureId } = useParams();
    const [matchDetails, setMatchDetails] = useState({});
    const [userBetOnHome, setUserBetOnHome] = useState(true);
    const [betSizeInEth, setBetSizeInEth] = useState(0.1);
    const [isFixtureCreated, setIsFixtureCreated] = useState(null);
    const [fixture, setFixture] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [alreadyPlacedBetsOnHome, setAlreadyPlacedBetsOnHome] = useState(0);
    const [alreadyPlacedBetsOnAway, setAlreadyPlacedBetsOnAway] = useState(0);
    const [winnerAfterFinish, setWinnerAfterFinish] = useState("");
    const [winningsCalculateFromContract, setWinningsCalculateFromContract] = useState();
    const [checkResultHasBeenCalled, setCheckResultHasBeenCalled] = useState(false);
    const [decideWinnerHasBeenCalled, setDecideWinnerHasBeenCalled] = useState(false);

    const connectWalletHandler = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            alert("Please install Metamask!");
        }
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            // console.log("Found an account! Address: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err)
        }
    }

    const loadEventDetails = async () => {
        const URL = "https://www.thesportsdb.com/api/v1/json/50130162/lookupevent.php?id=" + fixtureId;
        const response = await axios.get(URL);
        const data = response.data['events'][0];
        setMatchDetails(data);
        const tempFixtAddr = await fethBetRouter.methods.fixturesDeployed(data.idEvent).call();
        if (tempFixtAddr === "0x0000000000000000000000000000000000000000") {
            setIsFixtureCreated(false);
        }
        else {
            setFixture(new web3.eth.Contract(fixtureContractAbi, tempFixtAddr));
            setIsFixtureCreated(true);
        }
    }

    const getAlreadyPlacedBets = async () => {
        if (isFixtureCreated) {
            const temp1 = web3.utils.fromWei(await fixture.methods.homeBets(currentAccount).call());
            const temp2 = web3.utils.fromWei(await fixture.methods.awayBets(currentAccount).call());
            setAlreadyPlacedBetsOnHome(temp1);
            setAlreadyPlacedBetsOnAway(temp2);
        }
    }

    useEffect(
        () => {

            console.log(isFixtureCreated);
            calculateWinnings();
        }, [isFixtureCreated]
    );


    const calculateWinnings = async () => {
        if (isFixtureCreated && matchDetails.strStatus === "Match Finished") {
            const checkedResultTimestamp = await fixture.methods.checkedResultTimestamp().call();
            const winnerInContract = await fixture.methods.winner().call();
            if (String(checkedResultTimestamp) === "9999999999999999") // contract must be redeployed
            {
                setCheckResultHasBeenCalled(false);
            }
            else if (winnerInContract === 0) {
                setCheckResultHasBeenCalled(true);
                setDecideWinnerHasBeenCalled(false);
            }
            else {
                setDecideWinnerHasBeenCalled(true);
                const tempFixtAddr = await fethBetRouter.methods.fixturesDeployed(fixtureId).call();
                const fixtureTemp = new web3.eth.Contract(fixtureContractAbi, tempFixtAddr)
                const intHomeScore = matchDetails.intHomeScore;
                const intAwayScore = matchDetails.intAwayScore;
                const temp1 = web3.utils.fromWei(await fixtureTemp.methods.homeBets(currentAccount).call());
                const temp2 = web3.utils.fromWei(await fixtureTemp.methods.awayBets(currentAccount).call());
                setAlreadyPlacedBetsOnHome(temp1);
                setAlreadyPlacedBetsOnAway(temp2);
                if (intHomeScore > intAwayScore) {
                    setWinnerAfterFinish(matchDetails.strHomeTeam + " has won");
                }
                else if (intHomeScore === intAwayScore) {
                    setWinnerAfterFinish("It was a draw. You may collect your bet.");
                }
                else {
                    setWinnerAfterFinish(matchDetails.strAwayTeam + " has won !");
                }
                const tempRes = await fixture.methods.calculateWinnings(currentAccount).call();
                setWinningsCalculateFromContract(web3.utils.fromWei(tempRes));
            }
        }
    }




    const getWinnings = async () => {
        await fixture.methods.getWinnings().send({
            from: currentAccount
        })
    }

    const getStepper = () => {
        return (<Stepper onComplete={function noRefCheck() { }}
            step={1}
            hasNavButtons={false}
            stepData={[
                {
                    content: <div style={{ justifyContent: "center", display: "flex" }}>
                        <p>Let's place a wager on the side{' '}<strong>you bet will win !   .</strong></p>
                        <Button
                            id="next"
                            onClick={function noRefCheck() { }}
                            size="small"
                            text="Next"
                            theme="primary"
                            type="button"
                        />
                    </div>,
                    title: 'Welcome to FethBet'
                },
                {
                    content:
                        <div style={{ justifyContent: "center", display: "flex", gap: "20px" }}>
                            <Button
                                color="blue"
                                id="next"
                                onClick={() => {
                                    setUserBetOnHome(true);
                                }}
                                text="Home"
                                theme="secondary"
                                type="button"
                            />

                            <Button
                                color="yellow"
                                id="next"
                                onClick={() => {
                                    setUserBetOnHome(false);
                                }}
                                text="Away"
                                theme="secondary"
                                type="button"
                            />
                        </div>,
                    title: 'Choose side'
                },
                {
                    content: <div style={{ justifyContent: "center", display: "flex", gap: "20px" }}>
                        <Input
                            label="ETH?"
                            name="Test number Input"
                            onChange={(event) => {
                                setBetSizeInEth(event.currentTarget.value);
                            }}
                            type="number"
                            value={betSizeInEth}
                        />
                        <Button
                            id="next"
                            onClick={() => {
                                if (isFixtureCreated) {
                                    console.log(fixture);
                                    console.log(currentAccount);
                                    fixture.methods.addBet(userBetOnHome).send({
                                        value: web3.utils.toWei(betSizeInEth, "ether"),
                                        from: currentAccount,
                                    })
                                }
                                else {
                                    console.log("Fixture not deployed on-chain yet. You may ask the auditors to do so.")
                                }
                            }}
                            size="small"
                            text="Place Bet"
                            theme="primary"
                            type="button"
                        />
                    </div>,
                    title: 'Choose the amount of ETH to wager'
                },
            ]}
        />);
    }

    const stepTwoHelper = () => {
        return (
            <Card>
                <h2>Step 2: Make the bets available for re-collection by calling decideWinner()</h2>
                <Button
                    onClick={async () => {
                        try {
                            await fixture.methods.decideWinner().send({
                                from: currentAccount
                            });
                            calculateWinnings();
                        } catch (err) {
                            console.log(err);
                        }

                    }
                    }
                    text="decideWinner"
                    theme="secondary"
                    type="button"
                />
            </Card>
        );
    }

    function stepOneHelper() {
        return (<Card>
            <h2>Step 1: Get the result in the smart contract by calling checkResult</h2>
            <Button
                onClick={async () => {
                    try {
                        await fixture.methods.checkResult().send({
                            from: currentAccount
                        });
                        calculateWinnings();
                    } catch (err) {
                        console.log(err);
                    }

                }
                }
                text="Check Result"
                theme="secondary"
                type="button"
            />
        </Card>);
    }

    const getWinningCollector = () => {
        return (
            <div style={{ display: "grid", gridRowGap: "10px" }}>
                {checkResultHasBeenCalled ? "" : stepOneHelper()}
                {(!checkResultHasBeenCalled && decideWinnerHasBeenCalled) ? "" : stepTwoHelper()}
                <img alt = ""></img>
                <Card>
                    <h2>Match finished !</h2>
                    <h3>{winnerAfterFinish}</h3>
                    <h3>My winnings: {isFixtureCreated ? winningsCalculateFromContract : 0} ETH</h3>
                    <Button
                        onClick={() => {
                            getWinnings();
                        }}
                        size="small"
                        text="Get Winnings"
                        theme="primary"
                        type="button"
                    />
                </Card>

            </div>
        );
    }

    useEffect(() => {

        async function allTogether() {
            await connectWalletHandler();
            await loadEventDetails();
            await getAlreadyPlacedBets();
        }
        allTogether();

    }, []);

    return (
        <div>
            <Header />
            <div className="mainRowFixture">
                <div className="leftColumnFixture" style={{ width: "40%", gridRowGap: "20px", display: "grid" }}>
                    <Card>
                        <img src={matchDetails.strThumb === null ? ""
                            : matchDetails.strThumb + "/preview"} alt="thumbnail loading" style={{ height: "300px" }} />
                        <h4>
                            {matchDetails.strEvent}
                        </h4>
                    </Card>

                    <Card>
                        <h4>My bets on Home Team: {alreadyPlacedBetsOnHome} ETH </h4>
                        <h4>My bets on Away Team: {alreadyPlacedBetsOnAway} ETH </h4>
                    </Card>
                </div>

                <div className="rightColumnFixture" style={{ width: "60%" }}>
                    <div className="matchDetails" style={{ margin: "10px" }}>
                        <Table
                            columnsConfig="1fr 4fr"
                            data={[
                                ["Time", matchDetails.strTime],
                                ["Date", matchDetails.dateEvent],
                                ["Venue", matchDetails.strVenue],
                                ["Status", matchDetails.strStatus]
                            ]}
                            header={[
                                '', ''
                            ]}
                            noPagination
                            pageSize={5}
                        />
                    </div>

                    <div style={{ height: '1px', padding: "40px" }}>
                        {matchDetails.strStatus === "Not Started"
                            ? getStepper()
                            : getWinningCollector()
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fixture;
