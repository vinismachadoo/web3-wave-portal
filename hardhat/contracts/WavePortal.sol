// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; // initialize variable at 0
    uint256 private seed; // will be a random number generate every transaction
    
    event NewWave(address indexed from, uint256 timestamp, string message); // the event will be emitted so other services can access

    struct Wave { // struct -> custom datatype (schema)
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves; // variable wave will store an array of structs Wave

    mapping(address => uint256) public lastWavedAt; // maps every address with an number (last time the user waved at us)

    constructor() payable {
        console.log("This is my first smart contract");
        seed = (block.timestamp + block.difficulty) % 100;
        console.log(seed);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function wave(string memory _message) public { // make the function available to be called at run.js

        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30s"
        ); // garantees the gap between txn is bigger than 15min to avoid spams

        lastWavedAt[msg.sender] = block.timestamp; // update the last time wave

        totalWaves += 1;
        console.log("%s has waved!", msg.sender); // msg.sender is kinda auth0, it's the waver's wallet address

        waves.push(Wave(msg.sender, _message, block.timestamp)); // store the wave data in the array

        seed = (block.difficulty + block.timestamp + seed) % 100; // new seed value for the next transaction
        console.log(seed);

        if (seed <= 10) { // 10% chance of winning 
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

}