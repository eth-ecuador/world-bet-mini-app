// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "../lib/forge-std/src/Script.sol";
import {GGTToken} from "../src/Contracts.sol";
import {Pool} from "../src/Contracts.sol";

contract ContractsScript is Script {
    Pool public pool;
    GGTToken public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        token = new GGTToken();
        pool = new Pool(address(token));

        vm.stopBroadcast();
    }
}
