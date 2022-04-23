// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Fixture.sol";
import "./LinkPool.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FethBetRouter is AccessControl
{
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    mapping (uint => address) public fixturesDeployed; 
    LinkPool linkPool;
    address public latestFixtureAdded;

    event FixtureCreated(address deplpoyedAddr, uint eventId);

    constructor() 
    {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender); // the admin also is also an auditor
        setLinkPool(0xd0EedECB88d7e6ef365A46786d9e29F8C29DD46C);
    }

    function setLinkPool(address _addr) public
    {
        require(hasRole(AUDITOR_ROLE, msg.sender), "Caller is not an auditor");
        linkPool = LinkPool(_addr);
    }

    function createFixture(uint _leagueId, uint _eventId, uint _timestamp) public isAuditor
    {
        // require(block.timestamp + 1 days < _timestamp, "time to fixture < 1 day. not allowed");
        require(fixturesDeployed[_eventId] == address(0), "fixture already exists");
        fixturesDeployed[_eventId] = address(new Fixture(_leagueId, _eventId, _timestamp));
        linkPool.sendLinkTo(fixturesDeployed[_eventId], 1 ether); // send 1 LINK token to the deployed fixture for the oracle to work. This should be enough.
        emit FixtureCreated(fixturesDeployed[_eventId], _eventId);
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

    function addNewAuditor(address _newAddr) public
    {
        require(hasRole(AUDITOR_ROLE, msg.sender));
        _grantRole(AUDITOR_ROLE,  _newAddr);
    } 
}

//1,1154245,69696969
