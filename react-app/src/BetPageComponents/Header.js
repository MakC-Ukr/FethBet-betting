import React from "react";
import logo from "../assets/images/logo.png";
import twitterIcon from "../assets/icons/twitter.svg";
import githubIcon from "../assets/icons/github.png";
import instagramIcon from "../assets/icons/instagram.svg";
import { Card, Button } from "web3uikit";
import "./Header.css";
import { useEffect, useState } from 'react';


const Header = (props) => {

    const [currentAccount, setCurrentAccount] = useState('');

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

    useEffect(() => {
        connectWalletHandler();
    },[]);

    return (
        <div className="topRowBet">
            <img src={logo} alt="logo" height={100} />
            <div style={{ width: '32%' }}></div>
            <div style={{ height: '70px' }}>
                {
                    currentAccount === '' ?
                        <Button
                            icon="plus"
                            id="test-button-secondary-icon"
                            onClick={connectWalletHandler}
                            text="Connect Wallet"
                            theme="secondary"
                            type="button" />
                        :
                        <Button
                        icon = 'chainlink'
                            color="green"
                            id="test-button-colored-green"
                            onClick={function noRefCheck() { }}
                            text={"Wallet Connected"}
                            theme="colored"
                            type="button" />
                }

            </div>
            <div style={{ width: '32%' }}></div>
            <div style={{ width: '158px' }}>
                <Card >
                    <a href="https://twitter.com/vitalikNotABot" target="_blank" rel="noreferrer" >
                        <img src={twitterIcon} alt="img loading..." />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" >
                        <img src={instagramIcon} alt="img loading..." />
                    </a>
                    <a href="https://github.com/MakC-Ukr" target="_blank" rel="noreferrer" >
                        <img src={githubIcon} alt="img loading..." />
                    </a>
                </Card>
            </div>

        </div>
    );
}

export default Header;