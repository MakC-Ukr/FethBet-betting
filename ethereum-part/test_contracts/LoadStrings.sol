//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/ChainlinkClient.sol";
// import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";


contract GenericLargeResponse is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  bytes public data;
  string public image_url;

  constructor() {
    setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
    // setChainlinkOracle(0x25C7ac1900de67605c0A1812109E960068B1C3d6);
    setChainlinkOracle(0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656);

  }

  function requestBytes() public
  {
    // bytes32 specId = "b3b68ecd35464833a16613742640ae89";
    bytes32 specId = "7da2702f37fd48e5b1b9a5715e3509b6";
    uint256 payment = 100000000000000000;
    Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfillBytes.selector);
    req.add("get","https://testing-chainlink-default-rtdb.asia-southeast1.firebasedatabase.app/fixtures.json");
    req.add("path", "date");
    sendOperatorRequest(req, payment);
  }

  event RequestFulfilled(
    bytes32 indexed requestId,
    bytes indexed data
  );

  function fulfillBytes(
    bytes32 requestId,
    bytes memory bytesData
  )
    public
    recordChainlinkFulfillment(requestId)
  {
    emit RequestFulfilled(requestId, bytesData);
    data = bytesData;
    image_url = string(data);
  }
}