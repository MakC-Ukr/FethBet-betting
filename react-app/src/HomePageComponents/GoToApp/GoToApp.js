import React from "react";
import "./GoToApp.css"
import { Button } from 'web3uikit';
import { useNavigate } from "react-router";
import logo from "../../assets/images/logo.png"
import twitterIcon from "../../assets/icons/twitter.svg";
import githubIcon from "../../assets/icons/github.png";
import instagramIcon from "../../assets/icons/instagram.svg";
import {Card} from "web3uikit";



const GoToApp = () => {
    let navigate = useNavigate();

    return (
        <div className="features-8">
            <div className="firstRow">
                <img src={logo} alt="logo" height={100} />
                <div style={{ width: '80%' }}></div>
                <div style={{width: '158px'}}>
                <Card >
                    <img src={twitterIcon} alt="img loading..."/>
                    <img src={instagramIcon} alt="img loading..."/>
                    <img src={githubIcon} alt="img loading..."/>
                </Card>
            </div>
            </div>

            <div className="mainButton">
                <Button
                    color="red"
                    id="test-button-primary-large"
                    onClick={() => {navigate("/app")}}
                    text="Go to App"
                    theme="colored"
                    type="button"
                />
            </div>
        </div>
    );


}

export default GoToApp;