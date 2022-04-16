//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LinkPool
{
    address private LINKADDRESS = 0xa36085F69e2889c224210F603D836748e7dC0088;
    mapping(address => bool) public verified;
    address owner ;

    constructor()
    {
        owner = msg.sender;
    }

    function verifyAddress(address _addr) public
    {
        require(owner == msg.sender);
        verified[_addr] = true;
    }

    function withdrawAllLink() public 
    {
        require(owner == msg.sender);
        uint x = ERC20(LINKADDRESS).balanceOf(address(this));
        ERC20(LINKADDRESS).transfer(owner, x);
    }

    function sendLinkTo(address _addr, uint _amount) public
    {
        require(verified[msg.sender]);
        ERC20(LINKADDRESS).transfer(_addr, _amount);
    }


    /*
        Returns true if at least 20 LINK tokens are available with the pool
    */
    function getLINKBalance() public view returns (uint , bool )
    {
        uint res = ERC20(LINKADDRESS).balanceOf(address(this));
        if(res > 10 ether) // 0.2 LINK is link is needed for 2 API requests to get homeScore and awayScore
            return (res, true);
        else
            return (res, false);
    } 


}


// LINK pool deployed on Kovan at: 0xd0EedECB88d7e6ef365A46786d9e29F8C29DD46C