// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
import "./Fixture.sol";

contract Fethball is AccessControl
{
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    mapping (uint => address) public fixturesDeployed;

    constructor() 
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender); // the admin also is also an auditor
    }

    function createFixture(uint _eventId, uint _leagueId, uint _timestamp) public isAuditor
    {
        require(block.timestamp + 1 days < _timestamp, "time to fixture < 1 day. not allowed");
        require(fixturesDeployed[_eventId] == address(0), "fixture already exists");
        fixturesDeployed[_eventId] = address(new Fixture(_eventId, _leagueId, _timestamp));
    }

    function cancelFixture(uint _eventId) public isAuditor
    {
        require(fixturesDeployed[_eventId] != address(0), "fixture contract with this eventId has not been deployed");
        Fixture(fixturesDeployed[_eventId]).cancelMatch();
    }


    modifier isAuditor()
    {
        require(hasRole(AUDITOR_ROLE, msg.sender), "Caller is not an auditor");
        _;
    }
}

// 1154245,4328,696969696, 0x9d77f6BEEc5E5257B53Cc9b5f9f9952dFfFac6b0