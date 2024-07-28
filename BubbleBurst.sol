// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts@4.4.1/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.1/access/Ownable.sol";

contract BubbleBurst is ERC721, Ownable {
    uint256 private PLAY_COST = 1000000000 gwei;
    mapping(address => uint256) private currentPlayerList;

    constructor() ERC721("BubbleBurstGame", "BBG" ) {
    }

    function startPlay() external payable {
        require(msg.value >= PLAY_COST, "Not enough");
        currentPlayerList[msg.sender] = 1;
    }

    function Payback(uint256 amountLeft) public payable{
        require(currentPlayerList[msg.sender] == 1, "Player hasn't played");
        uint256 reward = 0;
        if(amountLeft == 0){
            reward = 2 * PLAY_COST;
        }
        else{
            uint256 totalBurst = ((512 - amountLeft) * 1e18 / 512);
            totalBurst = totalBurst / 1e16;
            totalBurst = (totalBurst * PLAY_COST) / 100;
            reward = totalBurst - 150000000000000000;
        }
        currentPlayerList[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
    }

    function withdrawBalance() public onlyOwner
    {
        require(address(this).balance > 0, "Balance is 0");
        payable(owner()).transfer(address(this).balance);
    }
}
