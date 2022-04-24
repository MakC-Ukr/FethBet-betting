// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Fixture is ChainlinkClient
{
    // Oracle tools
    using Chainlink for Chainlink.Request;
    bytes public data; // is used a middleman for Chainlink for receiving data as bytes

    address routerAddress;
    uint public leagueId;
    uint public eventId;
    uint public time;
    mapping (address => uint) public homeBets;
    mapping (address => uint) public awayBets;
    bool public isFinished = true; // needs to be set to false actually. temporarily set to true for testing purposes
    bool public isCancelled = false; // if a match is cancelled, then the betters can withdraw their funds
    uint public homeSum = 0+1; // 1 is initialized for zero division error
    uint public awaySum = 0+1; 
    uint public winner ; // 1 means home , 2 means draw, 3 means away
    string public homeScore; // => private
    string public awayScore; // => private
    uint public homeScoreInt; // => private
    uint public awayScoreInt; // => private
    string public stringTemp ; // => private
    uint private checkedResultTimestamp = 99999999999999;

    event ReceivedResult(uint a, uint b);

    constructor(uint _leagueId, uint _eventId, uint _time)
    {
        // require(_time > block.timestamp); // events in the past shall not be allowed to added because we would waste LINK tokens from the pool
        routerAddress = msg.sender;
        leagueId = _leagueId;
        eventId = _eventId;
        time = _time;
        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        setChainlinkOracle(0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656);
    }

    function earlyWithdrawBet(bool _isHomeBet) public
    {
        // require(block.timestamp < time - 1 hours, "no bets can be withdrawn 3 hours before the fixture");
        uint toSend;
        if(_isHomeBet)
        {
            toSend = homeBets[msg.sender];
            homeBets[msg.sender] = 0;
        }
        else
        {
            toSend = awayBets[msg.sender]; 
            awayBets[msg.sender] = 0;  
        }
        toSend = toSend * 90 / 100; // 10% commision fees is taken for early withdrawals
        require(toSend > 0, "toSend must be > 0");
        payable(address(msg.sender)).transfer(toSend);
    }

    function checkResult() public
    {
        _requestHomeScore();
        _requestAwayScore();
        checkedResultTimestamp = block.number;
    }

    function decideWinner() public
    {
        require(block.number > checkedResultTimestamp + 1, "decideWinner can be called only 1 block after checkResult. Try again in few seconds"); // this is done with the goal of lettting the chainlink node to update data
        _convertHomeScoresToInt();
        _convertAwayScoresToInt();

        if(homeScoreInt > awayScoreInt)
            winner = 1;
        else if(homeScoreInt == awayScoreInt)
            winner = 2;
        else
            winner = 3;
        if(block.timestamp > time)
            isFinished = true;
        else
            isFinished = true; // intentional mistake made for easier testing
        emit ReceivedResult(homeScoreInt, awayScoreInt);
    }

    function _convertHomeScoresToInt() private{
        bytes memory a = bytes(homeScore);
        for(uint8 i = 0 ; i < a.length; i++)
        {
            uint c = uint8(a[i]);
            if (c >= 48 && c <= 57) 
            {
                homeScoreInt = homeScoreInt * 10 + (c - 48);
            }
        }
    }

    function _convertAwayScoresToInt() private{
        bytes memory b = bytes(awayScore);
        for(uint8 i = 0 ; i < b.length; i++)
        {
            uint c = uint8(b[i]);
            if (c >= 48 && c <= 57) 
            {
                awayScoreInt = awayScoreInt * 10 + (c - 48);
            }
        }
    }


    function _requestHomeScore() private 
    {
        bytes32 specId = "7da2702f37fd48e5b1b9a5715e3509b6";
        uint256 payment = 100000000000000000;
        Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.getHomeScore.selector);
        string memory url = "https://www.thesportsdb.com/api/v1/json/50130162/lookupevent.php?id=";
        string memory _eventIdStr = Strings.toString(eventId);
        bytes memory temp;
        temp = abi.encodePacked(url);  
        temp = abi.encodePacked(temp, _eventIdStr);
        url = string(temp);
        req.add("get",url);
        req.add("path", "events,0,intHomeScore");
        sendOperatorRequest(req, payment);
    }

    function _requestAwayScore() private 
    {
        bytes32 specId = "7da2702f37fd48e5b1b9a5715e3509b6";
        uint256 payment = 100000000000000000;
        Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.getAwayScore.selector);
        string memory url = "https://www.thesportsdb.com/api/v1/json/50130162/lookupevent.php?id=";
        string memory _eventIdStr = Strings.toString(eventId);
        bytes memory temp;
        temp = abi.encodePacked(url);  
        temp = abi.encodePacked(temp, _eventIdStr);
        url = string(temp);
        req.add("get",url);
        req.add("path", "events,0,intAwayScore");
        sendOperatorRequest(req, payment);
    }

    function getWinnings() public{
        // require(block.timestamp > time + 1 hours, "winnnings can only be withdrawn 1 hour after the match");
        require(! isCancelled, "the fixing was cancelled");
        require(isFinished, "the match needs to be finished before claiming prizes");
        uint toSend = 0;
        if(winner == 1){
            toSend = homeBets[msg.sender] *  (homeSum + awaySum) ;
            toSend = toSend / (homeSum);
            homeBets[msg.sender]=0;
        }
        else if(winner == 2)
        {
            toSend = homeBets[msg.sender] + awayBets[msg.sender];
            homeBets[msg.sender]=0;
            awayBets[msg.sender]=0;
        }
        else if(winner == 3)
        {
            toSend = awayBets[msg.sender] * (homeSum  + awaySum) ;
            toSend = toSend / (awaySum);
            awayBets[msg.sender]=0;
        }
        require(toSend > 0, "toSend comes out to be <= 0");
        payable(msg.sender).transfer( toSend );
    }

    function calculateWinnings(address _addr) public view returns (uint)
    {
        // require(block.timestamp > time + 1 hours, "winnnings can only be withdrawn 1 hour after the match");
        require(! isCancelled, "the fixing was cancelled");
        require(isFinished, "the match needs to be finished before claiming prizes");
        uint toSend = 0;
        if(winner == 1){
            toSend = homeBets[_addr] *  (homeSum + awaySum) ;
            toSend = toSend / (homeSum);
        }
        else if(winner == 2)
        {
            toSend = homeBets[_addr] + awayBets[_addr];
        }
        else if(winner == 3)
        {
            toSend = awayBets[_addr] * (homeSum  + awaySum) ;
            toSend = toSend / (awaySum);
        }
        return toSend;
    }

    function addBet(bool _isHomeBet) public payable
    {
        require(msg.value >= 0.01 ether);
        // require(block.timestamp < time - 5 minutes, "no bets can be added 10 minutes before the fixture");
        if(_isHomeBet)
        {
            homeBets[msg.sender] += msg.value;
            homeSum += msg.value;
        }
        else
        {
            awayBets[msg.sender] += msg.value;
            awaySum += msg.value;
        }
    }

    function cancelMatch() external
    {
        require(msg.sender == routerAddress);
        isCancelled = true;
    }

    /*
        Allows the user to withdraw all their bets (away and home) for the fixture if it is cancelled.
    */
    function withdrawIfCancelled() public
    {
        require(isCancelled);
        uint toSend = homeBets[msg.sender] + awayBets[msg.sender];
        require(toSend > 0);
        homeBets[msg.sender] = 0;
        awayBets[msg.sender] = 0;
        payable(msg.sender).transfer(toSend);
    }

    event RequestFulfilled(
        bytes32 indexed requestId,
        bytes indexed data
    );

    function getHomeScore(bytes32 requestId,bytes memory bytesData) public recordChainlinkFulfillment(requestId)
    {
        emit RequestFulfilled(requestId, bytesData);
        data = bytesData;
        homeScore = string(data);
    }

    function getAwayScore(bytes32 requestId,bytes memory bytesData) public recordChainlinkFulfillment(requestId)
    {
        emit RequestFulfilled(requestId, bytesData);
        data = bytesData;
        awayScore = string(data);
    }

    function getLINKBalance() public view returns (uint , bool )
    {
        uint res = ERC20(0xa36085F69e2889c224210F603D836748e7dC0088).balanceOf(address(this));
        if(res > 0.2 ether) // 0.2 LINK is link is needed for 2 API requests to get homeScore and awayScore
            return (res, true);
        else
            return (res, false);
    } 

    /* 
        When the last eth for the bet is withdrawn from the pool, the LINK tokens from the fixture will be 
        returned to the link pool.
    */

    function returnLinkTokens()  public // To be implemented and later called when homeSum + awaySum == 0 if isFinished
    {
        
    }
}



// 1,1154110,69696969