import React from "react";
import "./GoToApp.css"
import { Button } from 'web3uikit';
import logo from '../../images/logo.png'

const GoToApp = () => {

    return (
        <div className="features-8">
            <div className="firstRow">
                <img src = {logo} alt="logo" height={100}/>
                <div style={{width: '80%'}}></div>
                <h2>Social Media</h2>
            </div>

            <div className="mainButton">
                <Button
                    color="red"
                    id="test-button-primary-large"
                    onClick={function noRefCheck(){}}
                    text="Go to App"
                    theme="colored"
                    type="button"
                />
            </div>
        </div>
    );


}

export default GoToApp;